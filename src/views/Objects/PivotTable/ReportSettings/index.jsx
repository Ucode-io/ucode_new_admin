import React, { useEffect, useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";

import { Save } from "@mui/icons-material";

import PrimaryButton from "../../../../components/Buttons/PrimaryButton";
import Footer from "../../../../components/Footer";
import pivotService from "../../../../services/pivotService";
import { showAlert } from "../../../../store/alert/alert.thunk";
import FiltersBlock from "./FiltersBlock";
import MainBlock from "./MainBlock";
import RepeatedBlock from "./RepeatedBlock";
import RowsRelation from "./RowsRelation";
import ValuesBlock from "./ValuesBlock";
import styles from "./styles.module.scss";
import constructorTableService from "../../../../services/constructorTableService";

export default function ReportSettings(props) {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const [settingId, setSettingId] = useState(undefined);

  const { data: reportSettings } = useQuery(["GET_REPORT_SETTINGS_LIST"], () => pivotService.getListReportSetting(), {
    select: (data) => data.report_settings ?? [],
  });

  const { mutate } = useMutation(() => pivotService.upsertReportSetting(), {
    onSuccess: (res) => {
      setSettingId(res.id);
    },
  });

  const { mutate: deleteReportSetting } = useMutation((id) => pivotService.deleteReportSetting(id), {
    onSuccess: () => {
      dispatch(showAlert("Успешно удалено", "success"));
      queryClient.refetchQueries(["GET_REPORT_SETTINGS_LIST"]);
    },
  });

  return (
    <div className={styles.outerWrapper}>
      <>
        <Item id={settingId} setId={setSettingId} {...props} />
      </>
    </div>
  );
}

function Item(props) {
  const { reportSettingsId } = useParams();
  const queryClient = useQueryClient();
  const [tables, setTables] = useState([]);
  const [upsertLoading, setUpsertLoading] = useState(false);
  const params = {};

  useQuery(["GET_REPORT_SETTING_BY_ID"], () => pivotService.getByIdReportSetting(reportSettingsId, params), {
    enabled: reportSettingsId === "create" ? false : true,
    onSuccess: (res) => {
      if (Object.keys(res).length) {
        form.reset({
          ...res,
          rows: res?.rows,
          columns: res?.columns ?? [],
          defaults: res?.defaults ?? [],
          values: res?.values ?? [],
          rows_relation: res?.rows_relation ?? [],
        });
      }
    },
  });

  const dispatch = useDispatch();

  const form = useForm({
    defaultValues: {
      main_table_label: "",
      main_table_slug: "",
      rows: [{ slug: "", label: "", table_field_settings: [] }],
      rows_relation: [
        {
          label: "",
          order_number: "",
          objects: [
            {
              label: "",
              slug: "",
              order_number: 1,
              inside_relation_table_slug: "",
              table_field_settings: [],
            },
          ],
        },
      ],
      columns: [{ slug: "", label: "", table_field_settings: [] }],
      values: [{ label: "", objects: [{ label: "" }] }],
      filters: [{ slug: "", label: "", field: {} }],
      defaults: [{ slug: "", label: "", table_field_settings: [] }],
    },
  });

  const onSubmit = (values) => {
    setUpsertLoading(true);
    pivotService
      .upsertReportSetting({
        id: reportSettingsId === "create" ? undefined : reportSettingsId,
        rows_relation: values.rows_relation.filter((i) => i.label),
        main_table_label: values.main_table_label,
        main_table_slug: values.main_table_slug,
        rows: values.rows,
        columns: values.columns,
        defaults: values.defaults.filter((i) => i.table_field_settings),
        values: values.values,
        filters: values.filters?.filter((i) => i.label),
      })
      .then(() => {
        dispatch(showAlert("Successfully updated!", "success"));
        queryClient.refetchQueries(["GET_REPORT_SETTINGS_LIST"]);
      })
      .finally(() => {
        setUpsertLoading(false);
        queryClient.refetchQueries(["MENU"]);
      });
  };

  const getTables = (search) => {
    constructorTableService
      .getList({
        search: search || undefined,
      })
      .then((res) => {
        setTables(res);
      });
  };

  useEffect(() => {
    getTables();
  }, []);

  const tableOptions = useMemo(() => {
    return tables?.tables?.map((item, index) => ({
      label: item.label,
      value: item.slug,
    }));
  }, [tables]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.settings}>
        <Tabs>
          <div className={styles.tabsHead}>
            <TabList>
              <Tab>Main</Tab>
              <Tab>Rows</Tab>
              <Tab>Rows Relation</Tab>
              <Tab>Columns</Tab>
              <Tab>Values</Tab>
              <Tab>Filters</Tab>
              <Tab>Defaults</Tab>
            </TabList>
          </div>
          <TabPanel>
            <MainBlock form={form} tables={tableOptions} allTables={tables?.tables} getTables={getTables} />
          </TabPanel>
          <TabPanel>
            <RepeatedBlock form={form} tables={tables?.tables} getTables={getTables} keyName="rows" />
          </TabPanel>
          <TabPanel>
            <RowsRelation form={form} tables={tables?.tables} getTables={getTables} />
          </TabPanel>
          <TabPanel>
            <RepeatedBlock form={form} tables={tables?.tables} getTables={getTables} keyName="columns" />
          </TabPanel>
          <TabPanel>
            <ValuesBlock form={form} tables={tables?.tables} getTables={getTables} />
          </TabPanel>
          <TabPanel>
            <FiltersBlock form={form} tables={tables?.tables} getTables={getTables} />
          </TabPanel>
          <TabPanel>
            <RepeatedBlock form={form} tables={tables?.tables} keyName="defaults" />
          </TabPanel>
        </Tabs>
      </div>

      <div className={styles.footer}>
        <Footer
          extra={
            <>
              <PrimaryButton loader={upsertLoading} onClick={() => form.handleSubmit(onSubmit)()}>
                <Save /> Save
              </PrimaryButton>
            </>
          }
        />
      </div>
    </div>
  );
}
