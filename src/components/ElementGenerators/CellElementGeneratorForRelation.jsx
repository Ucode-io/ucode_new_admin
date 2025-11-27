import {Parser} from "hot-formula-parser";
import {useEffect, useMemo, useState} from "react";
import {useTranslation} from "react-i18next";
import {useSelector} from "react-redux";
import CellManyToManyRelationElement from "./CellManyToManyRelationElement";
import CellRelationFormElementForNewColumn from "./CellRelationFormElementForNewColumn";
import CellRelationFormElementForTableView from "./CellRelationFormElementForTable";

const parser = new Parser();

const CellElementGeneratorForRelation = ({
  relOptions,
  tableView,
  field,
  isBlackBg = false,
  row,
  relationfields,
  updateObject,
  control,
  setFormValue,
  index,
  data,
  isTableView = false,
  isNewRow = false,
  newColumn = false,
  mainForm,
}) => {
  const userId = useSelector((state) => state.auth.userId);
  const tables = useSelector((state) => state.auth.tables);
  const [objectIdFromJWT, setObjectIdFromJWT] = useState();
  const {i18n} = useTranslation();
  let relationTableSlug = "";

  if (field?.id.includes("#")) {
    relationTableSlug = field?.id.split("#")[0];
  } else if (field?.type === "LOOKUP") {
    relationTableSlug = field?.table_slug;
  }

  const computedSlug = useMemo(() => {
    if (!isNewRow) {
      if (field?.enable_multilanguage) {
        return `multi.${index}.${field.slug}`;
      } else if (field.id?.includes("@")) {
        return `$${field?.id?.split("@")?.[0]}.${field?.slug}`;
      }
      return `multi.${index}.${field.slug}`;
    } else {
      if (field?.enable_multilanguage) {
        return `${field.slug}`;
      } else if (field.id?.includes("@")) {
        return `$${field?.id?.split("@")?.[0]}.${field?.slug}`;
      }
      return `${field.slug}`;
    }
  }, [field, i18n?.language]);

  const isDisabled =
    field.attributes?.disabled ||
    !field.attributes?.field_permission?.edit_permission;

  const defaultValue = useMemo(() => {
    const defaultValue =
      field.attributes?.defaultValue ?? field.attributes?.default_values;

    if (field?.attributes?.object_id_from_jwt === true) return objectIdFromJWT;
    if (field?.attributes?.is_user_id_default === true) return userId;

    if (field.relation_type === "Many2One" || field?.type === "LOOKUP") {
      if (Array.isArray(defaultValue)) {
        return defaultValue[0];
      } else {
        return defaultValue;
      }
    }

    if (!defaultValue) return undefined;

    const {error, result} = parser.parse(defaultValue);

    return error ? undefined : result;
  }, [field, objectIdFromJWT]);

  useEffect(() => {
    tables?.forEach((table) => {
      if (table.table_slug === relationTableSlug) {
        setObjectIdFromJWT(table?.object_id);
      }
    });
  }, [tables, relationTableSlug, field]);

  useEffect(() => {
    if (!row?.[field.slug]) {
      setFormValue(computedSlug, row?.[field.table_slug]?.guid || defaultValue);
    }
  }, [row, computedSlug, defaultValue]);

  switch (field.type) {
    case "LOOKUP":
      return newColumn ? (
        <CellRelationFormElementForNewColumn
          mainForm={mainForm}
          relOptions={relOptions}
          isNewRow={isNewRow}
          tableView={tableView}
          disabled={isDisabled}
          isFormEdit
          isBlackBg={isBlackBg}
          updateObject={updateObject}
          isNewTableView={true}
          control={control}
          name={computedSlug}
          field={field}
          row={row}
          placeholder={field.attributes?.placeholder}
          setFormValue={setFormValue}
          index={index}
          defaultValue={defaultValue}
          relationfields={relationfields}
          data={data}
        />
      ) : (
        <CellRelationFormElementForTableView
          relOptions={relOptions}
          tableView={tableView}
          disabled={isDisabled}
          isTableView={true}
          isFormEdit
          isBlackBg={isBlackBg}
          updateObject={updateObject}
          isNewTableView={true}
          control={control}
          name={computedSlug}
          field={field}
          row={row}
          placeholder={field.attributes?.placeholder}
          setFormValue={setFormValue}
          index={index}
          defaultValue={defaultValue}
          relationfields={relationfields}
          data={data}
        />
      );

    case "LOOKUPS":
      return (
        <CellManyToManyRelationElement
          relOptions={relOptions}
          disabled={isDisabled}
          isFormEdit
          updateObject={updateObject}
          isNewTableView={true}
          isBlackBg={isBlackBg}
          control={control}
          name={computedSlug}
          field={field}
          row={row}
          placeholder={field.attributes?.placeholder}
          setFormValue={setFormValue}
          index={index}
          defaultValue={defaultValue}
        />
      );
  }
};

export default CellElementGeneratorForRelation;
