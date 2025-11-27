import React, {useEffect, useMemo, useState} from "react";
import FormPageTopHead from "./FormPageHead/FormPageTopHead";
import FormPageHead from "./FormPageHead/FormPageHead";
import {useForm} from "react-hook-form";
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {useQueryClient} from "react-query";
import useTabRouter from "../../../hooks/useTabRouter";
import {useTranslation} from "react-i18next";
import {useMenuGetByIdQuery} from "../../../services/menuService";
import layoutService from "../../../services/layoutService";
import constructorObjectService from "../../../services/constructorObjectService";
import {sortSections} from "../../../utils/sectionsOrderNumber";
import {showAlert} from "../../../store/alert/alert.thunk";
import {store} from "../../../store";
import DetailPageTabs from "./DetailPageBody/DetailPageTabs";
import {Box} from "@mui/material";
import CPagination from "../Table1CUi/TableComponent/NewCPagination";

function DetailPage1CFormPage({
  tableSlugFromProps,
  handleClose,
  modal = false,
  selectedRow,
  dateInfo,
}) {
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  const {state = {}} = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {navigateToForm} = useTabRouter();
  const queryClient = useQueryClient();
  const isUserId = useSelector((state) => state?.auth?.userId);
  const [loader, setLoader] = useState(false);
  const [btnLoader, setBtnLoader] = useState(false);
  const [sections, setSections] = useState([]);
  const [tableRelations, setTableRelations] = useState([]);
  // const [summary, setSummary] = useState([]);
  const [data, setData] = useState([]);
  const [selectedTab, setSelectTab] = useState();
  const menu = store.getState().menu;
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();
  const [menuItem, setMenuItem] = useState(null);
  const menuId = searchParams.get("menuId");
  const [count, setCount] = useState(0);

  const {id: idFromParam, tableSlug: tableSlugFromParam, appId} = useParams();

  const id = useMemo(() => {
    return (
      state?.[`${tableSlugFromParam}_id`] ||
      idFromParam ||
      selectedRow?.guid ||
      appId
    );
  }, [idFromParam, selectedRow, appId, state]);

  const tableSlug = useMemo(() => {
    return tableSlugFromProps || tableSlugFromParam;
  }, [tableSlugFromParam, tableSlugFromProps]);

  const isInvite = menu.invite;
  const {i18n} = useTranslation();

  const {
    handleSubmit,
    control,
    reset,
    setValue: setFormValue,
    watch,
    getValues,
    formState: {errors},
  } = useForm({
    defaultValues: {
      ...state,
      ...dateInfo,
      invite: isInvite ? menuItem?.data?.table?.is_login_table : false,
    },
  });

  const getAllData = async () => {
    setLoader(true);
    const getLayoutData = layoutService.getLayout(tableSlug, menuId, {
      "table-slug": tableSlug,
      language_setting: i18n?.language,
    });

    const getFormData = id && constructorObjectService.getById(tableSlug, id);

    try {
      const [{data = {}}, layoutData] = await Promise.all([
        getFormData,
        getLayoutData,
      ]);

      setData({
        ...layoutData,
        tabs: layoutData?.tabs?.filter(
          (tab) =>
            tab?.relation?.permission?.view_permission === true ||
            tab?.type === "section"
        ),
      });
      setSections(sortSections(sections));
      // setSummary(layoutData.summary_fields ?? []);

      const defaultLayout = layoutData;

      const relations =
        defaultLayout?.tabs?.map((el) => ({
          ...el,
          ...el.relation,
        })) || [];

      setTableRelations(
        relations.map((relation) => ({
          ...relation,
          relatedTable:
            relation.table_from?.slug === tableSlug
              ? relation.table_to?.slug
              : relation.table_from?.slug,
        }))
      );

      if (!selectedTab?.relation_id) {
        reset(data?.response ?? {});
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoader(false);
    }
  };

  const getFields = async () => {
    const getLayout = layoutService.getLayout(tableSlug, menuId, {
      "table-slug": tableSlug,
      language_setting: i18n?.language,
    });

    try {
      const [layoutData] = await Promise.all([getLayout]);
      const defaultLayout = layoutData;

      setData({
        ...layoutData,
        tabs: layoutData?.tabs?.filter(
          (tab) =>
            tab?.relation?.permission?.view_permission === true ||
            tab?.type === "section"
        ),
      });
      setSections(sortSections(sections));
      const relations =
        defaultLayout?.tabs?.map((el) => ({
          ...el,
          ...el.relation,
        })) ?? [];

      setTableRelations(
        relations.map((relation) => ({
          ...relation,
          relatedTable:
            relation.table_from?.slug === tableSlug
              ? relation.table_to?.slug
              : relation.table_from?.slug,
        }))
      );
    } catch (error) {
      console.error(error);
    } finally {
      setLoader(false);
    }
  };

  const update = (data) => {
    delete data.invite;
    delete data?.merchant_ids_data;
    delete data?.merchant_ids;
    setBtnLoader(true);
    constructorObjectService
      .update(tableSlug, {data})
      .then(() => {
        queryClient.invalidateQueries(["GET_OBJECT_LIST", tableSlug]);
        queryClient.refetchQueries(
          "GET_OBJECTS_LIST_WITH_RELATIONS",
          tableSlug,
          {
            table_slug: tableSlug,
            user_id: isUserId,
          }
        );
        dispatch(showAlert("Successfully updated", "success"));
        if (modal) {
          handleClose();
          queryClient.refetchQueries(["GET_OBJECT_LIST_ALL"]);
        } else {
          navigate(-1);
        }
      })
      .catch((e) => console.log("ERROR: ", e))
      .finally(() => setBtnLoader(false));
  };
  const create = (data) => {
    setBtnLoader(true);
    if (window?.location.pathname?.includes("create")) {
      delete data.guid;
    }
    delete data.invite;
    delete data?.$merchant_ids_data;
    delete data?.merchant_ids;

    constructorObjectService
      .create(tableSlug, {
        data: {
          ...data,
          folder_id: state?.folder_id ?? undefined,
        },
      })
      .then((res) => {
        queryClient.invalidateQueries(["GET_OBJECT_LIST", tableSlug]);
        queryClient.refetchQueries(
          "GET_OBJECTS_LIST_WITH_RELATIONS",
          tableSlug,
          {
            table_slug: tableSlug,
          }
        );
        queryClient.refetchQueries("GET_NOTIFICATION_LIST", tableSlug, {
          table_slug: tableSlug,
          user_id: isUserId,
        });
        dispatch(showAlert("Successfully created", "success"));
        if (modal) {
          handleClose();
          queryClient.refetchQueries(
            "GET_OBJECTS_LIST_WITH_RELATIONS",
            tableSlug,
            {
              table_slug: tableSlug,
            }
          );
          queryClient.refetchQueries(["GET_OBJECT_LIST_ALL"]);
        } else {
          navigate(-1);
          handleClose();
          if (!state) navigateToForm(tableSlug, "EDIT", res.data?.data);
        }

        dispatch(showAlert("Successfully updated!", "success"));
      })
      .catch((e) => console.log("ERROR: ", e))
      .finally(() => setBtnLoader(false));
  };

  const onSubmit = (data) => {
    if (Boolean(id) && !window.location.pathname?.includes("create")) {
      update(data);
    } else {
      create(data);
    }
  };

  const {loader: menuLoader} = useMenuGetByIdQuery({
    menuId: searchParams.get("menuId"),
    queryParams: {
      enabled: Boolean(searchParams.get("menuId")),
      onSuccess: (res) => {
        setMenuItem(res);
      },
    },
  });

  const getRelatedTabeSlug = useMemo(() => {
    return tableRelations?.find((el) => el?.id === selectedTab?.relation_id);
  }, [tableRelations, selectedTab]);

  useEffect(() => {
    if (id) getAllData();
    else getFields();
  }, [id]);

  return (
    <>
      <FormPageTopHead />
      <Box>
        <FormPageHead
          getRelatedTabeSlug={getRelatedTabeSlug}
          onSubmit={handleSubmit(onSubmit)}
          selectedTab={selectedTab}
        />
        <DetailPageTabs
          selectedTab={selectedTab}
          control={control}
          data={data}
          getAllData={getAllData}
          selectedTabIndex={selectedTabIndex}
          setSelectedTabIndex={setSelectedTabIndex}
          relations={tableRelations ?? []}
          getValues={getValues}
          handleSubmit={handleSubmit}
          onSubmit={onSubmit}
          reset={reset}
          setFormValue={setFormValue}
          tableSlug={tableSlugFromProps}
          watch={watch}
          loader={loader}
          setSelectTab={setSelectTab}
          errors={errors}
          relatedTable={tableRelations[selectedTabIndex]?.relatedTable}
          id={id}
          menuItem={menuItem}
          limit={limit}
          setLimit={setLimit}
          setOffset={setOffset}
          offset={offset}
          setCount={setCount}
        />
      </Box>
      {selectedTab?.type === "relation" && (
        <CPagination
          setOffset={setOffset}
          offset={offset}
          limit={limit}
          setLimit={setLimit}
          count={count}
        />
      )}
    </>
  );
}

export default DetailPage1CFormPage;
