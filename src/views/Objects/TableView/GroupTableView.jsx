import {Drawer} from "@mui/material";
import {useEffect, useMemo, useState} from "react";
import {useFieldArray, useForm} from "react-hook-form";
import {useQuery} from "react-query";
import {useNavigate, useParams, useSearchParams} from "react-router-dom";
import GroupObjectDataTable from "../../../components/DataTable/GroupObjectDataTable";
import PermissionWrapperV2 from "../../../components/PermissionWrapper/PermissionWrapperV2";
import useFilters from "../../../hooks/useFilters";
import useTabRouter from "../../../hooks/useTabRouter";
import useCustomActionsQuery from "../../../queries/hooks/useCustomActionsQuery";
import constructorFieldService from "../../../services/constructorFieldService";
import constructorObjectService from "../../../services/constructorObjectService";
import constructorRelationService from "../../../services/constructorRelationService";
import layoutService from "../../../services/layoutService";
import {generateGUID} from "../../../utils/generateID";
import {mergeStringAndState} from "../../../utils/jsonPath";
import {listToMap} from "../../../utils/listToMap";
import {pageToOffset} from "../../../utils/pageToOffset";
import FieldSettings from "../../Constructor/Tables/Form/Fields/FieldSettings";
import ModalDetailPage from "../ModalDetailPage/ModalDetailPage";
import styles from "./styles.module.scss";

const GroupTableView = ({
  tab,
  view,
  shouldGet,
  selectedView,
  reset = () => {},
  fieldsMap,
  isDocView,
  sortedDatas = [],
  setSortedDatas,
  formVisible,
  setFormVisible,
  selectedObjects,
  checkedColumns,
  searchText,
  setDataLength,
  setSelectedObjects,
  selectedLinkedObject,
  selectedTabIndex,
  selectedLinkedTableSlug,
  menuItem,
  setFormValue,
  ...props
}) => {
  const {navigateToForm} = useTabRouter();
  const navigate = useNavigate();
  const {id, slug, tableSlug, appId} = useParams();
  const {filters, filterChangeHandler} = useFilters(tableSlug, view.id);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [deleteLoader, setDeleteLoader] = useState(false);
  const [drawerState, setDrawerState] = useState(null);
  const mainForm = useForm({
    defaultValues: {
      show_in_menu: true,
      fields: [],
      app_id: appId,
      builder_service_view_id: view?.id,
      summary_section: {
        id: generateGUID(),
        label: "Summary",
        fields: [],
        icon: "",
        order: 1,
        column: "SINGLE",
        is_summary_section: true,
      },
      label: "",
      description: "",
      slug: "",
      icon: "",
    },
    mode: "all",
  });

  const {fields, prepend, update, remove} = useFieldArray({
    control: mainForm.control,
    name: "fields",
    keyName: "key",
  });

  const getRelationFields = async () => {
    return new Promise(async (resolve) => {
      const getFieldsData = constructorFieldService.getList({
        table_id: id ?? menuItem?.table_id,
      });

      const getRelations = constructorRelationService.getList(
        {
          table_slug: slug,
          relation_table_slug: slug,
        },
        slug
      );
      const [{relations = []}, {fields = []}] = await Promise.all([
        getRelations,
        getFieldsData,
      ]);
      mainForm.setValue("fields", fields);
      const relationsWithRelatedTableSlug = relations?.map((relation) => ({
        ...relation,
        relatedTableSlug:
          relation.table_to?.slug === slug ? "table_from" : "table_to",
      }));

      const layoutRelations = [];
      const tableRelations = [];

      relationsWithRelatedTableSlug?.forEach((relation) => {
        if (
          (relation.type === "Many2One" &&
            relation.table_from?.slug === slug) ||
          (relation.type === "One2Many" && relation.table_to?.slug === slug) ||
          relation.type === "Recursive" ||
          (relation.type === "Many2Many" && relation.view_type === "INPUT") ||
          (relation.type === "Many2Dynamic" &&
            relation.table_from?.slug === slug)
        ) {
          layoutRelations.push(relation);
        } else {
          tableRelations.push(relation);
        }
      });

      const layoutRelationsFields = layoutRelations.map((relation) => ({
        ...relation,
        id: `${relation[relation.relatedTableSlug]?.slug}#${relation.id}`,
        attributes: {
          fields: relation.view_fields ?? [],
        },
        label:
          relation?.label ?? relation[relation.relatedTableSlug]?.label
            ? relation[relation.relatedTableSlug]?.label
            : relation?.title,
      }));

      mainForm.setValue("relations", relations);
      mainForm.setValue("relationsMap", listToMap(relations));
      mainForm.setValue("layoutRelations", layoutRelationsFields);
      mainForm.setValue("tableRelations", tableRelations);
      resolve();
    });
  };

  // OLD CODE

  function customSortArray(a, b) {
    const commonItems = a?.filter((item) => b.includes(item));
    commonItems?.sort();
    const remainingItems = a?.filter((item) => !b.includes(item));
    const sortedArray = commonItems?.concat(remainingItems);
    return sortedArray;
  }

  const columns = useMemo(() => {
    const result = [];
    for (const key in view.attributes.fixedColumns) {
      if (view.attributes.fixedColumns.hasOwnProperty(key)) {
        if (view.attributes.fixedColumns[key])
          result.push({id: key, value: view.attributes.fixedColumns[key]});
      }
    }
    return customSortArray(
      view?.columns,
      result.map((el) => {
        if (el?.type === "LOOKUP" || el?.type === "LOOKUPS") {
          return el?.relation_id;
        } else {
          return el?.id;
        }
      })
    )
      ?.map((el) => fieldsMap[el])
      ?.filter((el) => el);
  }, [view, fieldsMap]);

  const columnss = useMemo(() => {
    return view?.columns?.map((el) => fieldsMap[el])?.filter((el) => el);
  }, [view, fieldsMap]);

  const computedSortColumns = useMemo(() => {
    const resultObject = {};

    let a = sortedDatas?.map((el) => {
      if (el.field) {
        return {
          [fieldsMap[el?.field].slug]: el.order === "ASC" ? 1 : -1,
        };
      }
    });

    a.forEach((obj) => {
      for (const key in obj) {
        resultObject[key] = obj[key];
      }
    });

    return resultObject;
  }, [sortedDatas, fieldsMap]);

  const detectStringType = (inputString) => {
    if (/^\d+$/.test(inputString)) {
      return "number";
    } else {
      return "string";
    }
  };
  const [combinedTableData, setCombinedTableData] = useState([]);

  const {
    data: {tableData, pageCount} = {
      tableData: [],
      pageCount: 1,
    },
    refetch,
    isLoading: tableLoader,
  } = useQuery({
    queryKey: [
      "GET_OBJECTS_LIST_TEST",
      {
        tableSlug,
        searchText,
        sortedDatas,
        currentPage,
        checkedColumns,
        limit,
        filters: {...filters, [tab?.slug]: tab?.value},
        shouldGet,
        view,
      },
    ],
    queryFn: () => {
      return constructorObjectService.getListV2(tableSlug, {
        data: {
          view_type: "TABLE",
          offset: pageToOffset(currentPage, limit),
          app_id: appId,
          order: computedSortColumns,
          view_fields: checkedColumns,
          builder_service_view_id: view.id,
          search:
            detectStringType(searchText) === "number"
              ? parseInt(searchText)
              : searchText,
          limit,
          ...filters,
          [tab?.slug]: tab
            ? Object.values(fieldsMap).find((el) => el.slug === tab?.slug)
                ?.type === "MULTISELECT"
              ? [`${tab?.value}`]
              : tab?.value
            : undefined,
        },
      });
    },
    select: (res) => {
      return {
        tableData: res.data?.response ?? [],
        pageCount: isNaN(res.data?.count)
          ? 1
          : Math.ceil(res.data?.count / limit),
      };
    },
    onSuccess: (data) => {
      const checkdublicate = combinedTableData?.filter((item) => {
        return data?.tableData?.find((el) => el.guid === item.guid);
      });
      const result = data?.tableData?.filter((item) => {
        return !checkdublicate?.find((el) => el.guid === item.guid);
      });
      setCombinedTableData((prev) => [...prev, ...result]);
    },
  });

  useEffect(() => {
    if (isNaN(parseInt(view?.default_limit))) setLimit(20);
    else setLimit(parseInt(view?.default_limit));
  }, [view?.default_limit]);

  useEffect(() => {
    if (tableData?.length > 0) {
      reset({
        multi: tableData.map((i) => i),
      });
    }
  }, [tableData, reset]);

  const {data: {custom_events: customEvents = []} = {}} = useCustomActionsQuery(
    {
      tableSlug,
    }
  );

  const onCheckboxChange = (val, row) => {
    if (val) setSelectedObjects((prev) => [...prev, row.guid]);
    else setSelectedObjects((prev) => prev.filter((id) => id !== row.guid));
  };

  const deleteHandler = async (row) => {
    setDeleteLoader(true);
    try {
      await constructorObjectService.delete(tableSlug, row.guid);
      refetch();
    } finally {
      setDeleteLoader(false);
    }
  };

  const [layoutType, setLayoutType] = useState("SimpleLayout");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    layoutService
      .getList(
        {
          "table-slug": tableSlug,
        },
        tableSlug
      )
      .then((res) => {
        res?.layouts?.find((layout) => {
          layout.type === "PopupLayout"
            ? setLayoutType("PopupLayout")
            : setLayoutType("SimpleLayout");
        });
      });
  }, [menuItem?.id, tableSlug]);

  const navigateToEditPage = (row) => {
    if (layoutType === "PopupLayout") {
      setOpen(true);
    } else {
      navigateToDetailPage(row);
    }
  };

  const navigateToDetailPage = (row) => {
    if (view?.navigate?.params?.length || view?.navigate?.url) {
      const params = view.navigate?.params
        ?.map(
          (param) =>
            `${mergeStringAndState(param.key, row)}=${mergeStringAndState(
              param.value,
              row
            )}`
        )
        .join("&&");
      const result = `${view?.navigate?.url}${params ? "?" + params : ""}`;
      navigate(result);
    } else {
      navigateToForm(tableSlug, "EDIT", row, {}, menuItem?.id ?? appId);
    }
  };

  useEffect(() => {
    refetch();
  }, [view?.quick_filters?.length, refetch]);

  const openFieldSettings = () => {
    setDrawerState("CREATE");
  };

  const [selectedObjectsForDelete, setSelectedObjectsForDelete] = useState([]);

  const multipleDelete = async () => {
    setDeleteLoader(true);
    try {
      await constructorObjectService.deleteMultiple(tableSlug, {
        ids: selectedObjectsForDelete.map((i) => i.guid),
      });
      refetch();
    } finally {
      setDeleteLoader(false);
    }
  };

  const [elementHeight, setElementHeight] = useState(null);

  useEffect(() => {
    const element = document.querySelector("#data-table");
    if (element) {
      const height = element.getBoundingClientRect().height;
      setElementHeight(height);
    }
  }, []);

  return (
    <div className={styles.wrapper}>
      {/* {(view?.quick_filters?.length > 0 ||
        (new_list[tableSlug] &&
          new_list[tableSlug].some((i) => i.checked))) && (
        <div className={styles.filters}>
          <p>{t("filters")}</p>
          <FastFilter
            view={view}
            fieldsMap={fieldsMap}
            getFilteredFilterFields={getFilteredFilterFields}
            isVertical
          />
        </div>
      )} */}
      <PermissionWrapperV2 tableSlug={tableSlug} type={"read"}>
        <div
          style={{display: "flex", alignItems: "flex-start", width: "100%"}}
          id="data-table">
          <GroupObjectDataTable
            disablePagination={false}
            defaultLimit={view?.default_limit}
            formVisible={formVisible}
            selectedView={selectedView}
            setSortedDatas={setSortedDatas}
            sortedDatas={sortedDatas}
            setDrawerState={setDrawerState}
            isTableView={true}
            elementHeight={elementHeight}
            setFormVisible={setFormVisible}
            setFormValue={setFormValue}
            mainForm={mainForm}
            isRelationTable={false}
            removableHeight={isDocView ? 150 : 170}
            currentPage={currentPage}
            pagesCount={pageCount}
            selectedObjectsForDelete={selectedObjectsForDelete}
            setSelectedObjectsForDelete={setSelectedObjectsForDelete}
            columns={columns}
            multipleDelete={multipleDelete}
            openFieldSettings={openFieldSettings}
            limit={limit}
            setLimit={setLimit}
            onPaginationChange={setCurrentPage}
            loader={tableLoader || deleteLoader}
            data={tableData}
            disableFilters
            isChecked={(row) => selectedObjects?.includes(row.guid)}
            onCheckboxChange={!!customEvents?.length && onCheckboxChange}
            filters={filters}
            filterChangeHandler={filterChangeHandler}
            onRowClick={navigateToEditPage}
            onDeleteClick={deleteHandler}
            tableSlug={tableSlug}
            view={view}
            tableStyle={{
              borderRadius: 0,
              border: "none",
              borderBottom: "1px solid #E5E9EB",
              // width: view?.quick_filters?.length ? "calc(100vw - 254px)" : "calc(100vw - 375px)",
              width: "100%",
              margin: 0,
            }}
            isResizeble={true}
            {...props}
          />

          {/* <Button variant="outlined" style={{ borderColor: "#F0F0F0", borderRadius: "0px" }} onClick={openFieldSettings}>
            <AddRoundedIcon />
            Column
          </Button> */}
        </div>
      </PermissionWrapperV2>

      <ModalDetailPage open={open} setOpen={setOpen} />

      <Drawer
        open={drawerState}
        anchor="right"
        onClose={() => setDrawerState(null)}
        orientation="horizontal">
        <FieldSettings
          closeSettingsBlock={() => setDrawerState(null)}
          isTableView={true}
          onSubmit={(index, field) => update(index, field)}
          field={drawerState}
          formType={drawerState}
          mainForm={mainForm}
          selectedTabIndex={selectedTabIndex}
          height={`calc(100vh - 48px)`}
          getRelationFields={getRelationFields}
        />
      </Drawer>
    </div>
  );
};

export default GroupTableView;
