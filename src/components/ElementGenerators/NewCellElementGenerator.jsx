import {Parser} from "hot-formula-parser";
import {useEffect, useMemo} from "react";
import {useTranslation} from "react-i18next";
import {useSelector} from "react-redux";
import CHFFormulaField from "../FormElements/CHFFormulaField";
import HFAutocomplete from "../FormElements/HFAutocomplete";
import HFCheckbox from "../FormElements/HFCheckbox";
import HFColorPicker from "../FormElements/HFColorPicker";
import HFDatePicker from "../FormElements/HFDatePicker";
import HFDateTimePicker from "../FormElements/HFDateTimePicker";
import HFFileUpload from "../FormElements/HFFileUpload";
import HFFloatField from "../FormElements/HFFloatField";
import HFFormulaField from "../FormElements/HFFormulaField";
import HFIconPicker from "../FormElements/HFIconPicker";
import HFModalMap from "../FormElements/HFModalMap";
import HFMultipleAutocomplete from "../FormElements/HFMultipleAutocomplete";
import HFNumberField from "../FormElements/HFNumberField";
import HFPassword from "../FormElements/HFPassword";
import HFSwitch from "../FormElements/HFSwitch";
import HFTextField from "../FormElements/HFTextField";
import HFTextFieldWithMask from "../FormElements/HFTextFieldWithMask";
import HFTimePicker from "../FormElements/HFTimePicker";
import HFVideoUpload from "../FormElements/HFVideoUpload";
import InventoryBarCode from "../FormElements/InventoryBarcode";
import CellElementGenerator from "./CellElementGenerator";
import MultiLineCellFormElement from "./MultiLineCellFormElement";
import CellRelationFormElement from "./CellRelationFormElement";
import CellManyToManyRelationElement from "./CellManyToManyRelationElement";

const parser = new Parser();

const NewCellElementGenerator = ({
  field,
  fields,
  isBlackBg = false,
  row,
  relationfields,
  isWrapField,
  updateObject,
  control,
  setFormValue,
  index,
  data,
}) => {
  const userId = useSelector((state) => state.auth.userId);
  const tables = useSelector((state) => state.auth.tables);
  const {i18n} = useTranslation();
  let relationTableSlug = "";
  let objectIdFromJWT = "";

  if (field?.id.includes("#")) {
    relationTableSlug = field?.id.split("#")[0];
  }

  useEffect(() => {
    tables?.forEach((table) => {
      if (table.table_slug === relationTableSlug) {
        objectIdFromJWT = table.object_id;
      }
    });
  }, [tables, relationTableSlug]);

  const removeLangFromSlug = useMemo(() => {
    var lastIndex = field.slug.lastIndexOf("_");
    if (lastIndex !== -1) {
      var result = field.slug.substring(0, lastIndex);
      return result;
    } else {
      return false;
    }
  }, [field.slug]);

  const computedSlug = useMemo(() => {
    if (field?.enable_multilanguage) {
      return `multi.${index}.${field.slug}`;
    } else if (field.id?.includes("@")) {
      return `$${field?.id?.split("@")?.[0]}.${field?.slug}`;
    }

    return `multi.${index}.${field.slug}`;
  }, [field, i18n?.language]);

  const isDisabled =
    field.attributes?.disabled ||
    !field.attributes?.field_permission?.edit_permission;

  const defaultValue = useMemo(() => {
    const defaultValue =
      field.attributes?.defaultValue ?? field.attributes?.default_values;

    if (field?.attributes?.is_user_id_default === true) return userId;
    if (field?.attributes?.object_id_from_jwt === true) return objectIdFromJWT;

    if (field.relation_type === "Many2One" || field?.type === "LOOKUP") {
      if (Array.isArray(defaultValue)) {
        return defaultValue[0];
      } else {
        return defaultValue;
      }
    }
    if (field.type === "MULTISELECT" || field.id?.includes("#"))
      return defaultValue;

    if (!defaultValue) return undefined;

    const {error, result} = parser.parse(defaultValue);

    return error ? undefined : result;
  }, [field]);

  useEffect(() => {
    if (!row?.[field.slug]) {
      setFormValue(computedSlug, row?.[field.table_slug]?.guid || defaultValue);
    }
  }, [row, computedSlug, defaultValue]);

  const renderComponents = {
    LOOKUP: () => (
      <CellRelationFormElement
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
    ),
    LOOKUPS: () => (
      <CellManyToManyRelationElement
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
    ),
    SINGLE_LINE: () => (
      <HFTextField
        disabled={isDisabled}
        isFormEdit
        updateObject={updateObject}
        isNewTableView={true}
        isBlackBg={isBlackBg}
        control={control}
        name={computedSlug}
        fullWidth
        field={field}
        required={field.required}
        placeholder={field.attributes?.placeholder}
        defaultValue={defaultValue}
      />
    ),
    PASSWORD: () => (
      <HFPassword
        isDisabled={isDisabled}
        isFormEdit
        updateObject={updateObject}
        isNewTableView={true}
        isBlackBg={isBlackBg}
        control={control}
        name={computedSlug}
        fullWidth
        field={field}
        isTransparent={true}
        required={field.required}
        type="password"
        placeholder={field.attributes?.placeholder}
        defaultValue={defaultValue}
      />
    ),
    SCAN_BARCODE: () => (
      <InventoryBarCode
        control={control}
        name={computedSlug}
        fullWidth
        updateObject={updateObject}
        isNewTableView={true}
        setFormValue={setFormValue}
        required={field.required}
        placeholder={field.attributes?.placeholder}
        defaultValue={defaultValue}
        field={field}
        disabled={isDisabled}
      />
    ),
    PHONE: () => (
      <HFTextFieldWithMask
        disabled={isDisabled}
        isFormEdit
        updateObject={updateObject}
        isNewTableView={true}
        isBlackBg={isBlackBg}
        control={control}
        name={computedSlug}
        fullWidth
        isTransparent={true}
        required={field.required}
        placeholder={field.attributes?.placeholder}
        mask={"(99) 999-99-99"}
        defaultValue={defaultValue}
      />
    ),
    FORMULA: () => (
      <HFFormulaField
        disabled={isDisabled}
        isFormEdit
        updateObject={updateObject}
        isNewTableView={true}
        isTableView={true}
        isBlackBg={isBlackBg}
        control={control}
        name={computedSlug}
        fullWidth
        required={field.required}
        placeholder={field.attributes?.placeholder}
        mask={"(99) 999-99-99"}
        defaultValue={defaultValue}
        isTransparent={true}
      />
    ),
    FORMULA_FRONTEND: () => (
      <CHFFormulaField
        setFormValue={setFormValue}
        control={control}
        updateObject={updateObject}
        isNewTableView={true}
        isTableView={true}
        required={field.required}
        placeholder={field.attributes?.placeholder}
        name={computedSlug}
        fieldsList={fields}
        disabled={!isDisabled}
        isTransparent={true}
        field={field}
        index={index}
        defaultValue={defaultValue}
      />
    ),
    PICK_LIST: () => (
      <HFAutocomplete
        disabled={isDisabled}
        isBlackBg={isBlackBg}
        isFormEdit
        updateObject={updateObject}
        isNewTableView={true}
        control={control}
        name={computedSlug}
        width="100%"
        options={field?.attributes?.options}
        required={field.required}
        placeholder={field.attributes?.placeholder}
        defaultValue={defaultValue}
      />
    ),
    MULTISELECT: () => (
      <HFMultipleAutocomplete
        disabled={isDisabled}
        isFormEdit
        updateObject={updateObject}
        isNewTableView={true}
        control={control}
        name={computedSlug}
        width="100%"
        required={field.required}
        field={field}
        placeholder={field.attributes?.placeholder}
        isBlackBg={isBlackBg}
        defaultValue={defaultValue}
        data={data}
      />
    ),
    MULTISELECT_V2: () => (
      <HFMultipleAutocomplete
        disabled={isDisabled}
        isFormEdit
        updateObject={updateObject}
        isNewTableView={true}
        control={control}
        name={computedSlug}
        width="100%"
        required={field.required}
        field={field}
        placeholder={field.attributes?.placeholder}
        isBlackBg={isBlackBg}
        defaultValue={defaultValue}
        data={data}
      />
    ),
    DATE: () => (
      <HFDatePicker
        control={control}
        name={computedSlug}
        fullWidth
        updateObject={updateObject}
        isNewTableView={true}
        width={"100%"}
        mask={"99.99.9999"}
        isFormEdit
        isBlackBg={isBlackBg}
        required={field.required}
        placeholder={field.attributes?.placeholder}
        defaultValue={defaultValue}
        disabled={isDisabled}
        isTransparent={true}
      />
    ),
    DATE_TIME: () => (
      <HFDateTimePicker
        disabled={isDisabled}
        isFormEdit
        updateObject={updateObject}
        isNewTableView={true}
        isBlackBg={isBlackBg}
        showCopyBtn={false}
        control={control}
        name={computedSlug}
        required={field.required}
        placeholder={field.attributes?.placeholder}
        defaultValue={defaultValue}
        isTransparent={true}
      />
    ),
    TIME: () => (
      <HFTimePicker
        disabled={isDisabled}
        isFormEdit
        updateObject={updateObject}
        isNewTableView={true}
        isBlackBg={isBlackBg}
        control={control}
        name={computedSlug}
        required={field.required}
        placeholder={field.attributes?.placeholder}
        defaultValue={defaultValue}
        isTransparent={true}
      />
    ),
    NUMBER: () => (
      <HFNumberField
        disabled={isDisabled}
        isFormEdit
        updateObject={updateObject}
        isNewTableView={true}
        control={control}
        name={computedSlug}
        fullWidth
        required={field.required}
        placeholder={field.attributes?.placeholder}
        isBlackBg={isBlackBg}
        defaultValue={defaultValue}
        isTransparent={true}
      />
    ),
    FLOAT: () => (
      <HFFloatField
        disabled={isDisabled}
        isFormEdit
        updateObject={updateObject}
        isNewTableView={true}
        control={control}
        name={computedSlug}
        fullWidth
        required={field.required}
        placeholder={field.attributes?.placeholder}
        isBlackBg={isBlackBg}
        defaultValue={defaultValue}
        isTransparent={true}
      />
    ),
    CHECKBOX: () => (
      <HFCheckbox
        disabled={isDisabled}
        isFormEdit
        updateObject={updateObject}
        isNewTableView={true}
        isBlackBg={isBlackBg}
        control={control}
        name={computedSlug}
        required={field.required}
        defaultValue={defaultValue}
      />
    ),
    SWITCH: () => (
      <HFSwitch
        disabled={isDisabled}
        isFormEdit
        updateObject={updateObject}
        isNewTableView={true}
        isBlackBg={isBlackBg}
        control={control}
        name={computedSlug}
        required={field.required}
        defaultValue={defaultValue}
      />
    ),
    EMAIL: () => (
      <HFTextField
        disabled={isDisabled}
        isFormEdit
        updateObject={updateObject}
        isNewTableView={true}
        isBlackBg={isBlackBg}
        control={control}
        name={computedSlug}
        rules={{
          pattern: {
            value: /\S+@\S+\.\S+/,
            message: "Incorrect email format",
          },
        }}
        fullWidth
        required={field.required}
        placeholder={field.attributes?.placeholder}
        defaultValue={defaultValue}
      />
    ),
    ICON: () => (
      <HFIconPicker
        isFormEdit
        control={control}
        updateObject={updateObject}
        isNewTableView={true}
        name={computedSlug}
        required={field.required}
        defaultValue={defaultValue}
      />
    ),
    MAP: () => (
      <HFModalMap
        isTransparent={true}
        control={control}
        updateObject={updateObject}
        isNewTableView={true}
        field={field}
        defaultValue={defaultValue}
        isFormEdit
        name={computedSlug}
        required={field?.required}
      />
    ),
    MULTI_LINE: () => (
      <MultiLineCellFormElement
        control={control}
        isWrapField={isWrapField}
        updateObject={updateObject}
        isNewTableView={true}
        computedSlug={computedSlug}
        field={field}
        isDisabled={isDisabled}
      />
    ),
    CUSTOM_IMAGE: () => (
      <HFFileUpload
        isTransparent={true}
        control={control}
        updateObject={updateObject}
        isNewTableView={true}
        name={computedSlug}
        defaultValue={defaultValue}
        isFormEdit
        required={field.required}
      />
    ),
    VIDEO: () => (
      <HFVideoUpload
        control={control}
        updateObject={updateObject}
        isNewTableView={true}
        name={computedSlug}
        defaultValue={defaultValue}
        isFormEdit
        isBlackBg={isBlackBg}
        required={field.required}
        placeholder={field.attributes?.placeholder}
        isTransparent={true}
      />
    ),
    FILE: () => (
      <HFFileUpload
        control={control}
        updateObject={updateObject}
        isNewTableView={true}
        name={computedSlug}
        defaultValue={defaultValue}
        isFormEdit
        isBlackBg={isBlackBg}
        required={field.required}
        placeholder={field.attributes?.placeholder}
        isTransparent={true}
      />
    ),
    COLOR: () => (
      <HFColorPicker
        control={control}
        updateObject={updateObject}
        isNewTableView={true}
        name={computedSlug}
        defaultValue={defaultValue}
        isFormEdit
        isBlackBg={isBlackBg}
        required={field.required}
        placeholder={field.attributes?.placeholder}
        isTransparent={true}
      />
    ),
  };

  return renderComponents[field?.type] ? (
    renderComponents[field?.type]
  ) : (
    <div style={{padding: "0 4px"}}>
      <CellElementGenerator field={field} row={row} />
    </div>
  );
};

export default NewCellElementGenerator;
