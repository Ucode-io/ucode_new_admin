import { useCallback, useEffect, useRef, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { addMonths, format } from "date-fns";

import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import AddIcon from "@mui/icons-material/Add";
import { Edit } from "@mui/icons-material";
import ArrowCircleDownIcon from "@mui/icons-material/ArrowCircleDown";

import ModalCard from "../../../components/ModalCard";
import constructorFieldService from "../../../services/constructorFieldService";
import { showAlert } from "../../../store/alert/alert.thunk";
import CRangePickerNew from "../../../components/DatePickers/CRangePickerNew";
import PivotTable from "./PivotTable";
import SecondaryButton from "../../../components/Buttons/SecondaryButton";
import useBooleanState from "../../../hooks/useBooleanState";
import ClickActionPages from "./PivotTable/ClickActionPages";
import styles from "./PivotTable/styles.module.scss";
import PivotTemplatesPopover from "./PivotTemplate/PivotTemplatesPopover";
import PivotTemplateModalContent from "./PivotTemplate/PivotTemplateModalContent";
import useDownloader from "../../../hooks/useDownloader";
import pivotService from "../../../services/pivotService";
import ClickActionModalContent from "./PivotTable/ClickActionModalContent";

export default function PivotTableView() {
  const dispatch = useDispatch();
  const { tableSlug, appId } = useParams();
  const sformirovatBtnRef = useRef(null);
  const { download } = useDownloader();

  const [clActModalVisible, showClActModal, hideClActModal] =
    useBooleanState(false);
  const [computedFields, setComputedFields] = useState({
    cols: [],
    rows: [],
    calc: [],
    defaults: [],
    rows_relation: [],
    total_values: [],
  });

  const [isTemplateChanged, setIsTemplateChanged] = useState(false);
  const [modalParams, setModalParams] = useState({ key: "", isOpen: false });
  const [dateRange, setDateRange] = useState({
    $gte: addMonths(new Date(), -1),
    $lt: new Date(),
  });
  const [isCollapsing, setIsCollapsing] = useState(false);
  const [tableSlugData, setTableSlugData] = useState(false);
  const [columnsData, setColumnsData] = useState([]);
  const [clickActionTabs, setClickActionTabs] = useState([]);
  const [activeClickActionTabId, setActiveClickActionTabId] = useState("");
  const [curClActRow, setCurClActRow] = useState(null);
  const [expandedRows, setExpandedRows] = useState({});
  const [computedData, setComputedData] = useState([]);
  const [columnValueData, setColumnValueData] = useState({});
  const [childLoader, setChildLoader] = useState(false);
  const [totalValues, setTotalValues] = useState([]);

  const showModal = (key) => {
    setModalParams({ key, isOpen: true });
  };

  const hideModal = (key) => {
    setModalParams({ key, isOpen: false });
  };

  const form = useForm({ defaultValues: { report_setting_id: "" } });

  const hideModalAndReset = (shouldReset = true) => {
    shouldReset && form.reset();
    hideModal(modalParams.key);
  };

  const excludeEmptyItems = (
    arr,
    key = "table_field_settings",
    recursiveFieldName
  ) => {
    if (!recursiveFieldName) {
      return arr
        .map((row) => ({
          ...row,
          table_field_settings: row.table_field_settings.filter(
            (i) => i.label && i.checked
          ),
        }))
        .filter((row) => row.rowsRelationRow || row.table_field_settings.length)
        .map((row, idx) => ({
          ...row,
          order_number: idx + 1,
        }));
    }
    return arr
      .map((i) => ({
        ...i,
        [key]: excludeEmptyItems(i[key], recursiveFieldName),
      }))
      .filter((i) => i[key].length);
  };

  const findRowRelationOrder = (values) => {
    const index = values?.rows.findIndex((item) => item?.rowsRelationRow);
    const checkedRows = [
      ...excludeEmptyItems(values.rows.filter((i) => i.join)),
      ...excludeEmptyItems(values.rows.filter((i) => !i.join)),
    ];
    if (index >= checkedRows.length) {
      return checkedRows.length + 1;
    } else {
      return index + 1;
    }
  };

  const upsertPivotTemplate = (values) => {
    pivotService
      .upsertPivotTemplate({
        ...values,

        from_date: dateRange
          ? format(new Date(dateRange.$gte), "yyyy-MM-dd")
          : "",
        to_date: dateRange ? format(new Date(dateRange.$lt), "yyyy-MM-dd") : "",
        pivot_table_slug: values.template_name,
        id: modalParams.isOpen ? activeClickActionTabId : values.id,
        report_setting_id: form.watch("report_setting_id"),
        rows: values.rows
          ? [
              ...excludeEmptyItems(values.rows.filter((i) => i.join)),
              ...excludeEmptyItems(values.rows.filter((i) => !i.join)),
            ]?.filter((i) => !i.rowsRelationRow)
          : undefined,
        columns: values.columns ? excludeEmptyItems(values.columns) : undefined,
        values: values.values
          ? excludeEmptyItems(values.values, "objects", "table_field_settings")
          : undefined,
        rows_relation:
          values?.rows_relation?.length > 0
            ? excludeEmptyItems(
                values.rows_relation,
                "objects",
                "table_field_settings"
              )?.map((i, idx) => ({
                ...i,
                order_number: findRowRelationOrder(values),
                // order_number: idx + 1 + excludeEmptyItems(values.rows)?.length
              }))
            : undefined,
      })
      .then((res) => {
        dispatch(showAlert("Successfully Updated!", "success"));
        setExpandedRows((p) => ({ ...p, [res.id]: [] }));
        pivotTemplatesHistory.refetch().then(() => {
          setActiveClickActionTabId(res.id);
        });
        pivotTemplates.refetch();
        setTimeout(() => {
          modalParams.isOpen && sformirovatBtnRef.current.click();
        }, 0);
        hideModalAndReset(false);
        hideClActModal();
        setTimeout(() => {
          refetch();
        }, 0);
      });
  };

  const savePivotTemplate = (values) => {
    pivotService
      .savePivotTemplate({
        pivot_table_slug: values.template_name,
        app_id: appId,
        report_setting_id: values.report_setting_id,
        from_date: dateRange
          ? format(new Date(dateRange.$gte), "yyyy-MM-dd")
          : "",
        to_date: dateRange ? format(new Date(dateRange.$lt), "yyyy-MM-dd") : "",
        clone_id: activeClickActionTabId,
        status: "SAVED",
      })
      .then((res) => {
        dispatch(showAlert("Success", "success"));
        pivotTemplates.refetch();
        hideModalAndReset();
      });
  };

  const onSubmit = (values) => {
    if (modalParams.key === "add") {
      savePivotTemplate(values);
    } else {
      upsertPivotTemplate({ ...values, status: "HISTORY" });
    }
  };

  const pivotTemplateField = useQuery(
    ["GET_PIVOT_TEMPLATE_BY_ID", activeClickActionTabId],
    () => pivotService.getByIdPivotTemplateSetting(activeClickActionTabId),
    {
      enabled: false,
      onSuccess: (res) => {
        form.setValue("report_setting_id", res.report_setting_id);
        if (res.from_date)
          setDateRange({
            $gte: res.from_date
              ? new Date(res.from_date)
              : addMonths(new Date(), -1),
            $lt: res.to_date ? new Date(res.to_date) : new Date(),
          });
        setComputedFields({
          rows: res.rows ?? [],
          cols: res.columns ?? [],
          calc: res.values ?? [],
          rows_relation: res.rows_relation ?? [],
          defaults:
            res.defaults?.reduce(
              (acc, cur) => [...acc, ...cur.table_field_settings],
              []
            ) ?? [],
        });
      },
    }
  );

  const pivotTemplates = useQuery(
    ["GET_TEMPLATES_LIST_SAVED"],
    () =>
      pivotService.getListPivotTemplateSetting({
        app_id: appId,
        status: "SAVED",
      }),
    {
      select: (res) =>
        res?.pivot_templates.map((i) => ({
          label: i.pivot_table_slug,
          value: i.id,
        })) ?? [],
    }
  );

  const { pivotTemplateId } = useParams();

  const pivotTemplatesHistory = useQuery(
    ["GET_TEMPLATES_LIST_HISTORY"],
    () =>
      pivotService.getListPivotTemplateSetting({
        app_id: appId,
        status: "HISTORY",
      }),
    {
      select: (res) =>
        (res.pivot_templates ?? []).map((i) => ({
          label: i.pivot_table_slug,
          value: i.id,
        })) ?? [],
      onSuccess: (data) => {
        setActiveClickActionTabId(pivotTemplateId);
        setTimeout(() => {
          sformirovatBtnRef.current.click();
        }, 0);
      },
    }
  );

  const makeExpandRowParam = (row) => {
    if (row?.child) {
      return {
        [row.slug]: row.real_value,
        child: makeExpandRowParam(row.child),
      };
    }
    return { [row?.slug]: row?.real_value };
  };

  const { isLoading, isRefetching, refetch } = useQuery(
    ["DYNAMIC_REPORT", activeClickActionTabId, [activeClickActionTabId]],
    () =>
      pivotService.dynamicReport(
        {
          data: {
            match_tables: expandedRows[activeClickActionTabId]?.length
              ? makeExpandRowParam(
                  JSON.parse(
                    JSON.stringify(expandedRows[activeClickActionTabId].at(-1))
                  )
                )
              : undefined,
            order_number:
              expandedRows[activeClickActionTabId]?.at(-1)?.order_number,
            from_date: dateRange
              ? format(new Date(dateRange.$gte), "yyyy-MM-dd")
              : "",
            to_date: dateRange
              ? format(new Date(dateRange.$lt), "yyyy-MM-dd")
              : "",
          },
        },
        {
          id: activeClickActionTabId || "default",
        }
      ),
    {
      enabled: false,
      select: (res) => {
        return {
          pageCount: Math.ceil(res.data.data?.count / 10),
          res: res.data.data?.rows ?? [],
          columnsData: res.data.data?.columns,
          columnValuesData: res.data.data?.value,
          tableSlug: res.data?.table_slug ?? "",
          totalValues: res.data.data?.total_values ?? [],
        };
      },
      onSuccess: ({
        res,
        columnsData,
        columnValuesData,
        tableSlug,
        totalValues,
      }) => {
        const curExpRow = expandedRows[activeClickActionTabId];
        const recalculateData = (arr, expandRow, order) => {
          const foundRow = arr.find(
            (row) => expandRow && row.guid === expandRow.real_value
          );
          if (order === 1 && !foundRow?.children?.length) {
            return arr.map((i) =>
              i.guid === expandRow.real_value
                ? {
                    ...i,
                    children: res,
                  }
                : i
            );
          }
          return arr?.map((i) =>
            expandRow && i.guid === expandRow.real_value
              ? {
                  ...i,
                  children: recalculateData(
                    foundRow?.children,
                    expandRow.child,
                    order - 1
                  ),
                }
              : i
          );
        };
        if (!isCollapsing)
          setComputedData((p) => {
            if (!curExpRow?.length) {
              return res;
            }
            if (res.length && curExpRow?.at(-1)?.real_value && p.length) {
              return recalculateData(
                p,
                curExpRow?.at(-1),
                curExpRow?.at(-1)?.is_relaiton_row
                  ? curExpRow?.at(-1).relation_order_number
                  : curExpRow?.at(-1).order_number
              );
            } else {
              return res;
            }
          });

        setTotalValues(totalValues);
        setTableSlugData(tableSlug);
        setColumnValueData(columnValuesData);
        setColumnsData(columnsData ?? []);
        setIsTemplateChanged(false);
        setIsCollapsing(false);
        setChildLoader(false);
      },
      onError: () => {
        setChildLoader(false);
      },
    }
  );

  const getValueRecursively = (row, order) => {
    if (order === 1 || !row.child) {
      return row.combined_value;
    }
    return getValueRecursively(row.child, order - 1);
  };

  const calculateParentValues = (row) => {
    if (row.parent_ids?.length) {
      return row.parent_ids.reduce(
        (acc, cur, idx) =>
          acc + idx === row.parent_ids.length - 1 ? "" : "#" + cur,
        ""
      );
    }
    return "";
  };

  const handleExpandRow = (row, fieldObjArg, isAfterRelationRow) => {
    const fieldObj = {
      ...fieldObjArg,
      order_number: isAfterRelationRow
        ? fieldObjArg.order_number + 1
        : fieldObjArg.order_number,
    };

    const sample = {
      order_number: fieldObj.order_number,
      value: row.guid,
      real_value: row.guid,
      parent_value: row.parent_value,
      parent_value_combined: row.parent_ids.join("#"),
      slug: row.table_slug,
    };

    const repeated = {
      relation_order_number:
        row.slug_type === "RELATION" ? fieldObj.order_number : null,
      is_relaiton_row: row.slug_type === "RELATION",
    };

    // !!! MAKE IT RECURSIVE !!!
    const addExpandRow = (arr) => {
      if (sample.order_number === 2) {
        const parent = arr.find(
          (i) => i.combined_value === sample.parent_value_combined
        );
        return [
          ...arr,
          {
            ...parent,

            ...repeated,
            order_number:
              row.slug_type === "RELATION" ? 1 : sample.order_number,
            child: {
              ...sample,
              value: `${parent.value}#${sample.value}`,
              combined_value: `${sample.parent_value_combined}#${sample.value}`,
              row_slug_type: row.slug_type === "RELATION" ? "RELATION" : null,
            },
          },
        ];
      } else if (sample.order_number === 3) {
        const parent = arr.find(
          (i) => i?.child?.combined_value === sample.parent_value_combined
        );
        return [
          ...arr,
          {
            ...parent,
            ...repeated,
            order_number:
              row.slug_type === "RELATION" ? 2 : sample.order_number,
            child: {
              ...parent.child,
              child: {
                ...sample,
                value: `${sample.parent_value}#${sample.value}`,
                combined_value: `${sample.parent_value_combined}#${sample.value}`,
                row_slug_type: row.slug_type === "RELATION" ? "RELATION" : null,
              },
            },
          },
        ];
      } else if (sample.order_number === 4) {
        const parent = arr.find(
          (i) =>
            i?.child?.child?.combined_value === sample.parent_value_combined
        );
        return [
          ...arr,
          {
            ...parent,
            ...repeated,
            order_number:
              row.slug_type === "RELATION" ? 3 : sample.order_number,
            child: {
              ...parent.child,
              child: {
                ...parent.child.child,
                child: {
                  ...sample,
                  value: `${sample.parent_value}#${sample.value}`,
                  combined_value: `${sample.parent_value_combined}#${sample.value}`,
                  row_slug_type:
                    row.slug_type === "RELATION" ? "RELATION" : null,
                },
              },
            },
          },
        ];
      } else if (sample.order_number === 5) {
        const parent = arr.find(
          (i) =>
            i?.child?.child?.child?.combined_value ===
            sample.parent_value_combined
        );
        return [
          ...arr,
          {
            ...parent,
            ...repeated,
            order_number:
              row.slug_type === "RELATION" ? 4 : sample.order_number,
            child: {
              ...parent.child,
              child: {
                ...parent.child.child,
                child: {
                  ...parent.child.child.child,
                  child: {
                    ...sample,
                    value: `${sample.parent_value}#${sample.value}`,
                    combined_value: `${sample.parent_value_combined}#${sample.value}`,
                    row_slug_type:
                      row.slug_type === "RELATION" ? "RELATION" : null,
                  },
                },
              },
            },
          },
        ];
      }
      return [
        ...arr,
        {
          ...sample,
          ...repeated,
          order_number: row.slug_type === "RELATION" ? 0 : sample.order_number,
          combined_value: sample.real_value,
          row_slug_type: row.slug_type === "RELATION" ? "RELATION" : null,
        },
      ];
    };

    setExpandedRows((p) => {
      const condition = [...row.parent_ids, row.guid].join("#");

      const collapseRows = (arr, expandRow, order) => {
        if (order === 1 || !row?.children) {
          return arr.map((i) =>
            i.guid === expandRow.real_value ? { ...i, children: [] } : i
          );
        }

        return arr.map((i) =>
          i.guid === expandRow.real_value
            ? {
                ...i,
                children: collapseRows(i.children, expandRow.child, order - 1),
              }
            : i
        );
      };

      if (
        p[activeClickActionTabId]?.some(
          (i) => getValueRecursively(i, fieldObj.order_number) === condition
        )
      ) {
        const foundExpandRow = expandedRows[activeClickActionTabId]?.find(
          (i) => getValueRecursively(i, fieldObj.order_number) === condition
        );

        setIsCollapsing(true);
        setComputedData((p) =>
          collapseRows(
            p,
            foundExpandRow,
            foundExpandRow.is_relaiton_row
              ? foundExpandRow.relation_order_number
              : foundExpandRow.order_number
          )
        );
        return {
          ...p,
          [activeClickActionTabId]: p[activeClickActionTabId].filter(
            (i) => getValueRecursively(i, fieldObj.order_number) !== condition
          ),
        };
      } else {
        setIsCollapsing(false);
        setChildLoader(true);

        return {
          ...p,
          [activeClickActionTabId]: addExpandRow(p[activeClickActionTabId]),
        };
      }
    });
  };

  const { mutate: onDeleteTemplate } = useMutation(
    (id) =>
      constructorFieldService.deletePivotTemplate({
        id,
        table_slug: tableSlug,
      }),
    {
      onSuccess: () => {
        dispatch(showAlert("Успешно удалено", "success"));
        pivotTemplates.refetch();
        pivotTemplatesHistory.refetch();
      },
    }
  );

  const onSformirovatClick = () => {
    setExpandedRows((p) => ({ ...p, [activeClickActionTabId]: [] }));
    setIsTemplateChanged(true);
    setComputedData([]);

    setTimeout(() => {
      pivotTemplateField.refetch().then(() => {
        refetch();
      });
    }, 0);
  };

  const isDefaultTemplate = useCallback(
    (value) =>
      pivotTemplates.data?.find((i) => i.value === value)?.label === "DEFAULT",
    [pivotTemplates]
  );

  const onTemplateChange = (id, values = null) => {
    setColumnsData([]);
    setComputedData([]);
    setExpandedRows({ [activeClickActionTabId]: [] });
    setTimeout(() => {
      pivotService.getByIdPivotTemplateSetting(id).then((res) => {
        if (!isDefaultTemplate(activeClickActionTabId))
          upsertPivotTemplate({
            ...(values ?? res),
            instance_id: id,
            template_name: res?.pivot_table_slug,
            id: undefined,
            status: "HISTORY",
          });
      });
    }, 0);
  };

  useEffect(() => {
    if (expandedRows[activeClickActionTabId]?.length) {
      refetch();
    }
  }, [expandedRows]);

  useEffect(() => {
    form.setValue(
      "template_name",
      modalParams.key === "edit"
        ? pivotTemplatesHistory.data?.find(
            (i) => i.value === activeClickActionTabId
          )?.label
        : ""
    );
  }, [modalParams]);

  const { refetch: linkRefetch } = useQuery(
    ["PIVOT_TABLE_EXCEL"],
    () => {
      pivotService.getReportLink(activeClickActionTabId, { app_id: appId });
    },
    {
      enabled: false,
      onSuccess: (res) => {
        download({
          link: "https://" + res?.link,
          fileName: "pivot_table_excel",
        });
      },
    }
  );

  return (
    <div className={styles.wrapper}>
      <div className={styles.actions}>
        <CRangePickerNew
          maxDate={new Date()}
          clearable
          onChange={setDateRange}
          value={dateRange}
          style={{ width: 235, alignSelf: "end", height: "32px" }}
          calendarPosition="top-right"
        />
        {/* <PivotTemplatesPopover
          isDefaultTemplate={isDefaultTemplate}
          onDeleteFn={onDeleteTemplate}
          onChange={onTemplateChange}
          data={pivotTemplates.data}
        /> */}
        <SecondaryButton
          disabled={!activeClickActionTabId}
          size="small"
          onClick={onSformirovatClick}
          ref={sformirovatBtnRef}
        >
          <PlayArrowIcon />
          Сформировать
        </SecondaryButton>
        <SecondaryButton
          disabled={!activeClickActionTabId}
          size="small"
          onClick={() => showModal("add")}
        >
          <AddIcon />
          Add
        </SecondaryButton>
        <SecondaryButton
          disabled={!activeClickActionTabId}
          size="small"
          onClick={() => showModal("edit")}
        >
          <Edit />
          Edit
        </SecondaryButton>
        <SecondaryButton
          disabled={!activeClickActionTabId}
          size="small"
          onClick={() => linkRefetch()}
        >
          <ArrowCircleDownIcon />
          Download
        </SecondaryButton>
      </div>
      <PivotTable
        calculateParentValues={calculateParentValues}
        setCurClActRow={setCurClActRow}
        clickActionTabs={clickActionTabs}
        showClActModal={showClActModal}
        expandedRows={expandedRows[activeClickActionTabId] ?? []}
        handleExpandRow={handleExpandRow}
        computedData={computedData}
        getValueRecursively={getValueRecursively}
        isRefetching={isRefetching}
        isLoading={isLoading}
        childLoader={childLoader}
        columnsData={columnsData}
        computedFields={computedFields}
        isTemplateChanged={isTemplateChanged}
        columnValueData={columnValueData}
        tableSlugData={tableSlugData}
        totalValues={totalValues}
      />
      {modalParams.isOpen && (
        <ModalCard
          width="70%"
          height={modalParams.key === "delete" ? 200 : "80%"}
          title={"PIVOT TABLE VIEW SETTINGS"}
          onClose={hideModalAndReset}
          onSaveButtonClick={() => form.handleSubmit(onSubmit)()}
          submitBtnTxt="Подвердить"
          removeBtns={["x"]}
        >
          <PivotTemplateModalContent
            modalParams={modalParams}
            activeClickActionTabId={activeClickActionTabId}
            dateRange={dateRange}
            setDateRange={setDateRange}
            form={form}
          />
        </ModalCard>
      )}
      {clActModalVisible && (
        <ModalCard
          width="70%"
          height={"40%"}
          title={"PIVOT TABLE CLICK ACTIONS"}
          onClose={hideClActModal}
          onSaveButtonClick={() => form.handleSubmit(onSubmit)()}
          // submitBtnTxt="Подвердить"
          removeBtns={["x"]}
        >
          <ClickActionModalContent
            form={form}
            getValueRecursively={getValueRecursively}
            expandedRows={expandedRows[activeClickActionTabId]}
            activeClickActionTabId={activeClickActionTabId}
            onTemplateChange={onTemplateChange}
            setExpandedRows={setExpandedRows}
            setComputedData={setComputedData}
            curClActRow={curClActRow}
            setClickActionTabs={setClickActionTabs}
            setActiveClickActionTabId={setActiveClickActionTabId}
            hideModal={hideClActModal}
            data={pivotTemplateField.data}
          />
        </ModalCard>
      )}
      {/* {pivotTemplatesHistory.data?.length > 0 && (
        <ClickActionPages
          ref={sformirovatBtnRef}
          refetch={refetch}
          isDefaultTemplate={isDefaultTemplate}
          onDeleteTemplate={onDeleteTemplate}
          pivotTemplatesHistory={pivotTemplatesHistory}
          setExpandedRows={setExpandedRows}
          setComputedData={setComputedData}
          clickActionTabs={clickActionTabs}
          setClickActionTabs={setClickActionTabs}
          setActiveClickActionTabId={setActiveClickActionTabId}
          items={clickActionTabs}
          activeClickActionTabId={activeClickActionTabId}
        />
      )} */}
    </div>
  );
}
