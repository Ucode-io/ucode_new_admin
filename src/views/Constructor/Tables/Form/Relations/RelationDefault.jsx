import { useMemo } from "react";
import { useParams } from "react-router-dom";
import FormElementGenerator from "../../../../../components/ElementGenerators/FormElementGenerator";
import styles from "./style.module.scss";
import { Typography } from "@mui/material";

const RelationDefault = ({ control, watch, columnsList }) => {
  const { tableSlug } = useParams();
  const relation = watch();
  const relatedTableSlug =
    relation?.table_from === tableSlug ? relation?.table_to : relation?.table_from;

  const computedRelation = useMemo(
    () => ({
      id: `${relatedTableSlug ?? ""}#${relation.id ?? ""}`,
      label: relation?.title,
      slug: "default_values",
      attributes: {
        view_fields: relation?.view_fields
          ?.map((fieldId) =>
            columnsList?.find((column) => column.id === fieldId)
          )
          .filter((el) => el),
        default_values: null,
        // field_permission:
      },
      relation_type: relation.type,
    }),
    [relation, relatedTableSlug, columnsList]
  );

  console.log("computedRelation", computedRelation)

  if (!relation.table_to || !relation.table_from) return null;
  return (
    <div style={{ padding: 0 }}>
      <div>
        <Typography variant="h6">Default value</Typography>
        <FormElementGenerator
          disabled={false}
          field={computedRelation}
          control={control}
        />
      </div>
    </div>
  );
};

export default RelationDefault;
