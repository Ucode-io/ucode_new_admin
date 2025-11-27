import { useEffect, useMemo } from "react";
import { useWatch } from "react-hook-form";
import { useParams } from "react-router-dom";
import { upperCase } from "lodash-es";
import { store } from "../../../../../../store";
import { useTablesListQuery } from "../../../../../../services/tableService";
import listToOptions from "../../../../../../utils/listToOptions";
import { useObjectsListQuery } from "../../../../../../services/constructorObjectService";
import HFSelect from "../../../../../FormElements/HFSelect";
import { Box } from "@mui/material";
import styles from "./index.module.scss";

const TemplateRelationTable = ({
  tableKey,
  tables,
  control,
  removeTable,
  type,
  form,
  setFieldIsLoading,
}) => {
  const { projectId } = useParams();
  const company = store.getState().company;

  const index = useMemo(() => {
    return tables.findIndex((table) => table.key === tableKey);
  }, [tables, tableKey]);

  const { data: projectTables } = useTablesListQuery({
    params: {
      envId: company.environmentId,
      "project-id": projectId,
    },
    queryParams: {
      select: (res) => res.tables,
    },
  });

  const selectedTableId = useWatch({
    control,
    name: `tables.${type === "input" ? 0 : 1}.table_id`,
  });

  const tableOptions = useMemo(
    () => listToOptions(projectTables, "label"),
    [projectTables]
  );

  const selectedTable = useMemo(() => {
    return projectTables?.find((table) => table.id === selectedTableId);
  }, [selectedTableId, projectTables]);

  useEffect(() => {
    form.setValue(`tables.${type === "input" ? 0 : 1}.type`, upperCase(type));
  }, [selectedTableId]);

  const { data: objects } = useObjectsListQuery({
    params: {
      envId: company.environmentId,
      project_id: projectId,
      tableSlug: selectedTable?.slug,
    },
    queryParams: {
      enabled: Boolean(selectedTable?.slug),
      select: (res) =>
        res.data?.response?.map((el) => ({
          value: el.guid,
          label:
            el[selectedTable?.subtitle_field_slug] ??
            el.name ??
            el.title ??
            el.guid,
        })),
    },
  });

  const { data: fields, isLoading } = useObjectsListQuery({
    params: {
      envId: company.environmentId,
      project_id: projectId,
      tableSlug: selectedTable?.slug,
    },
    queryParams: {
      enabled: Boolean(selectedTable?.slug),
      select: (res) => {
        const fields = res.data?.fields ?? [];
        const relationFields =
          res?.data?.relation_fields?.map((el) => ({
            ...el,
            label: `${el.label} (${el.table_label})`,
          })) ?? [];

        const result = [...fields, ...relationFields]?.filter(
          (el) => el.type !== "LOOKUP"
        );

        form.setValue("variables", result);
      },
    },
  });

  useEffect(() => {
    setFieldIsLoading(isLoading);
  }, [isLoading]);

  return (
    <Box className={styles.box}>
      <Box className={styles.card}>
        <Box className={styles.label}>Table</Box>
        <Box className={styles.select}>
          <HFSelect
            control={control}
            name={`tables.${type === "input" ? 0 : 1}.table_id`}
            options={tableOptions}
            placeholder={"Table"}
          />
        </Box>
      </Box>{" "}
      <Box className={styles.card}>
        <Box className={styles.label}>Object</Box>
        <Box className={styles.select}>
          <HFSelect
            control={control}
            name={`tables.${type === "input" ? 0 : 1}.object_id`}
            options={objects}
            placeholder={"Object"}
          />
        </Box>
      </Box>{" "}
      <Box className={styles.card}>
        <Box className={styles.label}>Relations</Box>
        <Box className={styles.select}>
          <HFSelect
            control={control}
            name={`tables.${type === "input" ? 0 : 1}.relations`}
            placeholder={"Relations"}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default TemplateRelationTable;
