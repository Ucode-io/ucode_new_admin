import {Box} from "@mui/material";
import React, {useMemo} from "react";
import {useMutation} from "react-query";
import constructorObjectService from "../../services/constructorObjectService";
import CellElementGeneratorForTable from "./CellElementGeneratorForTable";
import CellElementGeneratorForTableView from "./CellElementGeneratorForTableView";
import CellElementGeneratorForRelation from "./CellElementGeneratorForRelation";

const TableDataForm = ({
  relOptions,
  isTableView,
  tableView,
  tableSlug,
  fields,
  field,
  row,
  getValues,
  index,
  control,
  setFormValue,
  relationfields,
  data,
  isWrap,
  view,
}) => {
  const {mutate: updateObject} = useMutation(() =>
    constructorObjectService.update(tableSlug, {
      data: {...getValues(`multi.${index}`)},
    })
  );

  const isWrapField = useMemo(() => {
    if (!isWrap || !field || !field.id) {
      return null;
    }

    return Object.keys(isWrap)
      .map((key) => {
        return {
          id: key,
          status: isWrap?.[key],
        };
      })
      .find((x) => x?.id === field?.id)?.status;
  }, [isWrap, field?.id]);

  return (
    <Box
      style={{
        position: "relative",
        minWidth: "150px",
        boxSizing: "border-box",
      }}>
      {view?.attributes?.table_editable ? (
        <CellElementGeneratorForTable field={field} row={row} />
      ) : field?.type === "LOOKUP" || field?.type === "LOOKUPS" ? (
        <CellElementGeneratorForRelation
          key={field?.id}
          relOptions={relOptions}
          isTableView={isTableView}
          tableView={tableView}
          tableSlug={tableSlug}
          name={`multi.${index}.${field.slug}`}
          isWrapField={isWrapField}
          updateObject={updateObject}
          fields={fields}
          field={field}
          row={row}
          index={index}
          control={control}
          setFormValue={setFormValue}
          relationfields={relationfields}
          data={data}
        />
      ) : (
        <CellElementGeneratorForTableView
          key={field?.id}
          relOptions={relOptions}
          isTableView={isTableView}
          tableView={tableView}
          tableSlug={tableSlug}
          name={`multi.${index}.${field.slug}`}
          isWrapField={isWrapField}
          updateObject={updateObject}
          fields={fields}
          field={field}
          row={row}
          index={index}
          control={control}
          setFormValue={setFormValue}
          relationfields={relationfields}
          data={data}
        />
      )}
    </Box>
  );
};

export default TableDataForm;
