import {Delete} from "@mui/icons-material";
import {Box} from "@mui/material";
import {useEffect, useMemo, useState} from "react";
import {useForm} from "react-hook-form";
import {useTranslation} from "react-i18next";
import {useDispatch} from "react-redux";
import {useParams} from "react-router-dom";
import CancelButton from "../../../../components/Buttons/CancelButton";
import SaveButton from "../../../../components/Buttons/SaveButton";
import FRow from "../../../../components/FormElements/FRow";
import HFIosSwitch from "../../../../components/FormElements/HFIosSwitch";
import HFTextField from "../../../../components/FormElements/HFTextField";
import constructorViewService from "../../../../services/constructorViewService";
import {quickFiltersActions} from "../../../../store/filter/quick_filter";
import {viewTypes} from "../../../../utils/constants/viewTypes";
import styles from "./onecstyles.module.scss";
import {Tab, TabList, TabPanel, Tabs} from "react-tabs";
import OneCNavigateSettings from "./OneCViewNavigatingSettings";

const OneCViewForm = ({
  initialValues,
  typeNewView,
  closeForm,
  defaultViewTab,
  fields,
  refetchViews,
  setIsChanged,
  columns,
  relationColumns,
  views,
  setTab,
}) => {
  const {tableSlug, appId} = useParams();
  const [btnLoader, setBtnLoader] = useState(false);
  const [isBalanceExist, setIsBalanceExist] = useState(false);
  const [deleteBtnLoader, setDeleteBtnLoader] = useState(false);
  const dispatch = useDispatch();
  const {i18n} = useTranslation();
  const computedViewTypes = viewTypes?.map((el) => ({value: el, label: el}));
  const financialValues = initialValues?.attributes?.chart_of_accounts;
  const financialTypee = initialValues?.attributes?.percent?.type;
  const group_by_columns = initialValues?.attributes?.group_by_columns;
  const nameMulti = initialValues?.attributes?.[`name_${i18n?.language}`];
  const navigate = initialValues?.attributes?.navigate;
  const relationObjValue =
    initialValues?.attributes?.balance?.table_slug +
    "#" +
    initialValues?.attributes?.balance?.table_id;
  const numberFieldValue =
    initialValues?.attributes?.balance?.field_slug +
    "#" +
    initialValues?.attributes?.balance?.field_id;

  const financialFiledId = initialValues?.attributes?.percent?.field_id;
  const attributes = initialValues?.attributes;

  const form = useForm();
  const type = form.watch("type");
  const relationObjInput = form.watch("relation_obj");
  const numberFieldInput = form.watch("number_field");

  useEffect(() => {
    if (relationObjInput && numberFieldInput) {
      setIsBalanceExist(true);
    }
  }, [relationObjInput, numberFieldInput]);

  const computeFinancialAcc = (values, groupByField, data) => {
    if (values === undefined) return {chart_of_accounts: []};

    const computedFormat = values.map((row) => {
      return {
        group_by: row.group_by,
        field_slug: groupByField,
        chart_of_account: Object.entries(row)
          .filter(([key]) => key !== "group_by")
          .map(([key, value]) => {
            return {
              object_id: key,
              options: value
                .filter((option) => !!option)
                ?.map((option) => ({
                  ...option,
                  filters: option.filterFields?.map((filterField) => ({
                    field_id: filterField.field_id,
                    value: option.filters?.[filterField.field_id],
                  })),
                })),
            };
          }),
      };
    });
    return {
      chart_of_accounts: computedFormat,
      percent: {
        type: data.typee,
        field_id: data.typee === "field" ? data.filed_idss : null,
      },
      ...(isBalanceExist && {
        balance: {
          table_slug:
            data?.relation_obj?.split("#")?.[0] !== "undefined"
              ? data?.relation_obj?.split("#")?.[0]
              : undefined,
          table_id:
            data?.relation_obj?.split("#")?.[1] !== "undefined"
              ? data?.relation_obj?.split("#")?.[1]
              : undefined,
          field_id:
            data?.number_field?.split("#")?.[1] !== "undefined"
              ? data?.number_field?.split("#")?.[1]
              : undefined,
          field_slug:
            data?.number_field?.split("#")?.[0] !== "undefined"
              ? data?.number_field?.split("#")?.[0]
              : undefined,
        },
      }),
    };
  };

  useEffect(() => {
    form.reset({
      ...getInitialValues(
        initialValues,
        tableSlug,
        columns,
        typeNewView,
        relationColumns,
        financialValues,
        financialTypee,
        financialFiledId,
        relationObjValue,
        numberFieldValue,
        navigate,
        group_by_columns,
        nameMulti
      ),
      filters: [],
    });
  }, [initialValues, tableSlug, form, typeNewView]);

  useEffect(() => {
    form.reset({...form.getValues(), number_field: ""});
  }, [relationObjInput, attributes]);

  const onSubmit = (values) => {
    setBtnLoader(true);
    const computedValues = {
      ...values,
      columns:
        values.columns?.filter((el) => el.is_checked).map((el) => el.id) ?? [],
      attributes: {
        ...attributes,
        ...computeFinancialAcc(
          values.chartOfAccounts,
          values?.group_by_field_selected?.slug,
          values
        ),

        ...values?.attributes,
        group_by_columns:
          values.attributes.group_by_columns
            ?.filter((el) => el.is_checked)
            .map((el) => el.id) ?? [],
      },
      name:
        values?.attributes?.[`name_${i18n.language}`] ??
        Object.values(values?.attributes).find(
          (item) => typeof item === "string"
        ),
      app_id: appId,
      order: views?.length ?? 0,
    };

    if (initialValues === "NEW") {
      constructorViewService
        .create(tableSlug, computedValues)
        .then(() => {
          closeForm();
          refetchViews();
          setIsChanged(true);
        })
        .finally(() => {
          setBtnLoader(false);
        });
    } else {
      constructorViewService
        .update(tableSlug, computedValues)
        .then(() => {
          closeForm();
          refetchViews();
          setIsChanged(true);
        })
        .finally(() => {
          setBtnLoader(false);
          dispatch(
            quickFiltersActions.setQuickFiltersCount(
              values?.attributes?.quick_filters?.filter(
                (item) => item?.is_checked
              )?.length
            )
          );
        });
    }
    closeForm();
  };

  const deleteView = () => {
    setDeleteBtnLoader(true);
    constructorViewService
      .delete(initialValues.id, tableSlug)
      .then(() => {
        closeForm();
        refetchViews();
        setIsChanged(true);
      })
      .catch(() => setDeleteBtnLoader(false));
  };

  useEffect(() => {
    if (nameMulti) {
      form.setValue(`attributes.name_${i18n?.language}`, nameMulti);
    }
  }, [nameMulti]);

  return (
    <div className={styles.formSection} id="oneCTabs">
      <div className={styles.OneCviewForm}>
        <div className={styles.section}>
          <Tabs>
            <TabList>
              <Tab>View</Tab>
              <Tab>Navigation</Tab>
            </TabList>

            <TabPanel>
              <div className={styles.section}>
                <div className={styles.sectionBody}>
                  <div className={styles.formRow}>
                    <FRow label="Name">
                      <Box style={{display: "flex", gap: "6px"}}>
                        <HFTextField
                          control={form.control}
                          name={`attributes.name_${i18n?.language}`}
                          placeholder={`Name (${i18n?.language})`}
                          fullWidth
                        />
                      </Box>
                    </FRow>
                  </div>
                  <div style={{marginTop: "25px"}} className={styles.formRow}>
                    <FRow label="Disable Table edit">
                      <HFIosSwitch
                        control={form.control}
                        name={`attributes.table_editable`}
                        fullWidth
                      />
                    </FRow>
                    <FRow label="Table draggable">
                      <HFIosSwitch
                        control={form.control}
                        name={`attributes.table_draggable`}
                        fullWidth
                      />
                    </FRow>
                    <FRow label="1C UI">
                      <HFIosSwitch
                        control={form.control}
                        name={`attributes.table_1c_ui`}
                        fullWidth
                      />
                    </FRow>
                  </div>
                </div>
              </div>
            </TabPanel>

            <TabPanel>
              <OneCNavigateSettings form={form} />
            </TabPanel>
          </Tabs>
        </div>
      </div>

      <div className={styles.formFooter}>
        {initialValues !== "NEW" &&
          initialValues?.attributes?.view_permission?.delete && (
            <CancelButton
              loading={deleteBtnLoader}
              onClick={deleteView}
              title={"Delete"}
              icon={<Delete />}
            />
          )}
        <SaveButton
          style={{background: "#449424", width: "130px"}}
          onClick={form.handleSubmit(onSubmit)}
          loading={btnLoader}
        />
      </div>
    </div>
  );
};

const getInitialValues = (
  initialValues,
  tableSlug,
  columns,
  typeNewView,
  relationColumns,
  financialValues,
  financialTypee,
  financialFiledId,
  relationObjValue,
  numberFieldValue,
  navigate,
  group_by_columns
) => {
  if (initialValues === "NEW")
    return {
      type: typeNewView,
      users: [],
      name: "",
      default_limit: "",
      main_field: "",
      time_interval: 60,
      status_field_slug: "",
      disable_dates: {
        day_slug: "",
        table_slug: "",
        time_from_slug: "",
        time_to_slug: "",
      },
      columns: columns?.map((el) => ({...el, is_checked: true})) ?? [],
      group_fields: [],
      navigate: {
        params: [],
        url: "",
        headers: [],
        cookies: [],
      },
      table_slug: tableSlug,
      updated_fields: [],
      multiple_insert: false,
      multiple_insert_field: "",
      chartOfAccounts: [{}],
      attributes: {
        group_by_columns:
          columns?.map((el) => ({...el, is_checked: false})) ?? [],
        summaries: [],
        navigate: {
          params: [],
          url: "",
          headers: [],
          cookies: [],
        },
      },
    };
  return {
    type: initialValues?.type ?? "TABLE",
    users: initialValues?.users ?? [],
    name: initialValues?.name ?? "",
    // attributes: initialValues?.attributes ?? {},
    default_limit: initialValues?.default_limit ?? "",
    main_field: initialValues?.main_field ?? "",
    status_field_slug: initialValues?.status_field_slug ?? "",
    disable_dates: {
      day_slug: initialValues?.disable_dates?.day_slug ?? "",
      table_slug: initialValues?.disable_dates?.table_slug ?? "",
      time_from_slug: initialValues?.disable_dates?.time_from_slug ?? "",
      time_to_slug: initialValues?.disable_dates?.time_to_slug ?? "",
    },
    columns: computeColumns(initialValues?.columns, columns),
    attributes: {
      ...initialValues?.attributes,
      group_by_columns: computeGroups(group_by_columns, columns),
      summaries: initialValues?.attributes?.summaries ?? [],
      navigate: {
        params: initialValues?.attributes?.navigate?.params,
        url: initialValues?.attributes?.navigate?.url,
        headers: [],
        cookies: [],
      },
    },
    group_fields: computeGroupFields(
      initialValues?.group_fields,
      initialValues?.type === "CALENDAR" || initialValues?.type === "GANTT"
        ? [...columns, ...relationColumns]
        : columns
    ),
    navigate: {
      params: navigate?.params,
      url: navigate?.url,
      headers: [],
      cookies: [],
    },
    table_slug: tableSlug,
    id: initialValues?.id,
    calendar_from_slug: initialValues?.calendar_from_slug ?? "",
    calendar_to_slug: initialValues?.calendar_to_slug ?? "",
    time_interval: initialValues?.time_interval ?? 60,
    updated_fields: initialValues?.updated_fields ?? [],
    multiple_insert: initialValues?.multiple_insert ?? false,
    multiple_insert_field: initialValues?.multiple_insert_field ?? "",
    chartOfAccounts: computeFinancialColumns(financialValues),
    typee: financialTypee ?? "",
    relation_obj: relationObjValue ?? "",
    number_field: numberFieldValue ?? "",
    filed_idss: financialFiledId ?? "",
  };
};

const computeColumns = (checkedColumnsIds = [], columns) => {
  const selectedColumns =
    checkedColumnsIds
      ?.filter((id) => columns.find((el) => el.id === id))
      ?.map((id) => ({
        ...columns.find((el) => el.id === id),
        is_checked: true,
      })) ?? [];
  const unselectedColumns =
    columns?.filter((el) => !checkedColumnsIds?.includes(el.id)) ?? [];
  return [...selectedColumns, ...unselectedColumns];
};
const computeGroups = (checkedColumnsIds = [], columns) => {
  const selectedColumns =
    checkedColumnsIds
      ?.filter((id) => columns.find((el) => el?.id === id))
      ?.map((id) => ({
        ...columns.find((el) => el.id === id),
        is_checked: true,
      })) ?? [];
  const unselectedColumns =
    columns?.filter((el) => !checkedColumnsIds?.includes(el.id)) ?? [];
  return [...selectedColumns, ...unselectedColumns];
};

const computeFinancialColumns = (financialValues) => {
  return financialValues?.map((row) => {
    const computedRow = {group_by: row.group_by};

    row.chart_of_account?.forEach((chart) => {
      computedRow[chart.object_id] = [];

      chart.options?.forEach((option) => {
        const filters = {};
        const filterFields = [];

        option.filters?.forEach((filter) => {
          filters[filter.field_id] = filter.value;
          filterFields.push({field_id: filter.field_id});
        });
        const computedObj = {...option, filters, filterFields};
        computedRow[chart.object_id].push(computedObj);
      });
    });

    return computedRow;
  });
};

const computeQuickFilters = (quickFilters = [], columns) => {
  const selectedQuickFilters =
    quickFilters
      ?.filter((filter) => columns.find((el) => el.id === filter.field_id))
      ?.map((filter) => ({
        ...columns.find((el) => el.id === filter.field_id),
        ...filter,
        is_checked: true,
      })) ?? [];
  const unselectedQuickFilters =
    columns?.filter(
      (el) => !quickFilters?.find((filter) => filter.field_id === el.id)
    ) ?? [];
  return [...selectedQuickFilters, ...unselectedQuickFilters];
};

const computeGroupFields = (groupFields = [], columns) => {
  return (
    groupFields?.filter((groupFieldID) =>
      columns?.some((column) => column.id === groupFieldID)
    ) ?? []
  );
};

export default OneCViewForm;
