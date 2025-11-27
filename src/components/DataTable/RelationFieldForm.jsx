import {Box} from "@mui/material";
import React, {useEffect, useMemo} from "react";
import HFSelect from "../FormElements/HFSelect";
import "./style.scss";
import style from "./field.module.scss";
import {useTablesListQuery} from "../../services/tableService";
import {store} from "../../store";
import listToOptions from "../../utils/listToOptions";
import constructorFieldService from "../../services/constructorFieldService";
import {useQuery} from "react-query";
import HFMultipleSelect from "../FormElements/HFMultipleSelect";
import {useParams} from "react-router-dom";
import {useSelector} from "react-redux";

export default function RelationFieldForm({
  control,
  watch,
  setValue,
  fieldWatch,
  relatedTableSlug,
}) {
  const {tableSlug} = useParams();
  const envId = store.getState().company.environmentId;
  const menuItem = useSelector((state) => state.menu.menuItem);

  useEffect(() => {
    setValue("table_from", menuItem?.data.table?.slug);
  }, []);

  const {data: tables} = useTablesListQuery({
    params: {envId: envId},
    queryParams: {
      select: (res) => {
        return listToOptions(res.tables, "label", "slug");
      },
    },
  });

  const {data: relatedTableFields} = useQuery(
    ["GET_TABLE_FIELDS", relatedTableSlug],
    () => {
      if (!relatedTableSlug) return [];
      return constructorFieldService.getList(
        {table_slug: relatedTableSlug},
        relatedTableSlug
      );
    },
    {
      select: ({fields}) => {
        return listToOptions(
          fields?.filter((field) => field.type !== "LOOKUP"),
          "label",
          "id"
        );
      },
    }
  );

  return (
    <Box className={style.relation}>
      <HFSelect
        className={style.input}
        disabledHelperText
        options={[
          {label: "Single", value: "Many2One"},
          {label: "Multi", value: "Many2Many"},
          {label: "Recursive", value: "Recursive"},
        ]}
        name="relation_type"
        control={control}
        fullWidth
        required
        placeholder="Relation type"
        onChange={(val) => {
          if (val === "Many2Many") {
            setValue("view_type", "INPUT");
          } else if (val === "Recursive") {
            setValue("table_to", tableSlug);
          } else {
            setValue("view_type", undefined);
          }
        }}
      />
      {fieldWatch.relation_type !== "Recursive" && (
        <>
          <HFSelect
            disabledHelperText
            options={tables}
            name="table_to"
            control={control}
            fullWidth
            required
            placeholder="Table to"
            className={style.input}
          />
          <HFMultipleSelect
            disabledHelperText
            options={relatedTableFields}
            name="view_fields"
            control={control}
            fullWidth
            required
            placeholder="View fields"
            className={style.input}
          />
        </>
      )}
    </Box>
  );
}
