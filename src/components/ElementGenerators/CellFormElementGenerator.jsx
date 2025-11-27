import {Parser} from "hot-formula-parser";
import {useEffect, useMemo} from "react";
import {useWatch} from "react-hook-form";
import {useSelector} from "react-redux";
import CHFFormulaField from "../FormElements/CHFFormulaField";
import HFAutocomplete from "../FormElements/HFAutocomplete";
import HFCheckbox from "../FormElements/HFCheckbox";
import HFDatePicker from "../FormElements/HFDatePicker";
import HFDateTimePicker from "../FormElements/HFDateTimePicker";
import HFFormulaField from "../FormElements/HFFormulaField";
import HFIconPicker from "../FormElements/HFIconPicker";
import HFMultipleAutocomplete from "../FormElements/HFMultipleAutocomplete";
import HFNumberField from "../FormElements/HFNumberField";
import HFSwitch from "../FormElements/HFSwitch";
import HFTextField from "../FormElements/HFTextField";
import HFTextFieldWithMask from "../FormElements/HFTextFieldWithMask";
import HFTimePicker from "../FormElements/HFTimePicker";
import CellElementGenerator from "./CellElementGenerator";
import CellManyToManyRelationElement from "./CellManyToManyRelationElement";
import CellRelationFormElement from "./CellRelationFormElement";
import HFFloatField from "../FormElements/HFFloatField";
import InventoryBarCode from "../FormElements/InventoryBarcode";
import HFPassword from "../FormElements/HFPassword";
import HFModalMap from "../FormElements/HFModalMap";
import HFFileUpload from "../FormElements/HFFileUpload";
import HFInternationPhone from "../FormElements/HFInternationPhone";

const parser = new Parser();

const CellFormElementGenerator = ({
  field,
  fields,
  isBlackBg = false,
  watch,
  columns = [],
  row,
  control,
  setFormValue,
  shouldWork = false,
  index,
  relationfields,
  data,
  ...props
}) => {
  const selectedRow = useSelector((state) => state.selectedRow.selected);
  const userId = useSelector((state) => state.auth.userId);
  const tables = useSelector((state) => state.auth.tables);
  let relationTableSlug = "";
  let objectIdFromJWT = "";

  if (field?.id.includes("#")) {
    relationTableSlug = field?.id.split("#")[0];
  }

  tables?.forEach((table) => {
    if (table.table_slug === relationTableSlug) {
      objectIdFromJWT = table.object_id;
    }
  });

  const computedSlug = useMemo(() => {
    return `multi.${index}.${field.slug}`;
  }, [field.slug, index]);

  const changedValue = useWatch({
    control,
    name: computedSlug,
  });

  const isDisabled = useMemo(() => {
    return (
      field.attributes?.disabled ||
      !field.attributes?.field_permission?.edit_permission
    );
  }, [field]);

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
  }, [field.attributes, field.type, field.id, field.relation_type]);

  useEffect(() => {
    if (!row?.[field.slug]) {
      setFormValue(computedSlug, row?.[field.table_slug]?.guid || defaultValue);
    }
  }, [field, row, setFormValue, computedSlug]);

  useEffect(() => {
    if (columns.length && changedValue !== undefined && changedValue !== null) {
      columns.forEach(
        (i, rowIndex) =>
          selectedRow.includes(i.guid) &&
          setFormValue(`multi.${rowIndex}.${field.slug}`, changedValue)
      );
    }
  }, [changedValue, setFormValue, columns, field, selectedRow]);

  const renderComponents = {
    LOOKUP: () => (
      <CellRelationFormElement
        disabled={isDisabled}
        isFormEdit
        isBlackBg={isBlackBg}
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
        isBlackBg={isBlackBg}
        control={control}
        name={computedSlug}
        fullWidth
        required={field.required}
        placeholder={field.attributes?.placeholder}
        {...props}
        defaultValue={defaultValue}
      />
    ),
    PASSWORD: () => (
      <HFPassword
        isDisabled={isDisabled}
        isFormEdit
        isBlackBg={isBlackBg}
        control={control}
        name={computedSlug}
        fullWidth
        field={field}
        required={field.required}
        type="password"
        placeholder={field.attributes?.placeholder}
        {...props}
        defaultValue={defaultValue}
      />
    ),
    SCAN_BARCODE: () => (
      <InventoryBarCode
        control={control}
        name={computedSlug}
        fullWidth
        setFormValue={setFormValue}
        required={field.required}
        placeholder={field.attributes?.placeholder}
        defaultValue={defaultValue}
        field={field}
        disabled={isDisabled}
        {...props}
      />
    ),
    PHONE: () => (
      <HFTextFieldWithMask
        disabled={isDisabled}
        isFormEdit
        isBlackBg={isBlackBg}
        control={control}
        name={computedSlug}
        fullWidth
        required={field.required}
        placeholder={field.attributes?.placeholder}
        mask={"(99) 999-99-99"}
        defaultValue={defaultValue}
        {...props}
      />
    ),
    FORMULA: () => (
      <HFFormulaField
        disabled={isDisabled}
        isFormEdit
        isBlackBg={isBlackBg}
        control={control}
        name={computedSlug}
        fullWidth
        required={field.required}
        placeholder={field.attributes?.placeholder}
        mask={"(99) 999-99-99"}
        defaultValue={defaultValue}
        {...props}
      />
    ),
    FORMULA_FRONTEND: () => (
      <CHFFormulaField
        setFormValue={setFormValue}
        control={control}
        required={field.required}
        placeholder={field.attributes?.placeholder}
        name={computedSlug}
        fieldsList={fields}
        disabled={!isDisabled}
        field={field}
        index={index}
        {...props}
        defaultValue={defaultValue}
      />
    ),
    PICK_LIST: () => (
      <HFAutocomplete
        disabled={isDisabled}
        isBlackBg={isBlackBg}
        isFormEdit
        control={control}
        name={computedSlug}
        width="100%"
        options={field?.attributes?.options}
        required={field.required}
        placeholder={field.attributes?.placeholder}
        defaultValue={defaultValue}
        {...props}
      />
    ),
    INTERNATION_PHONE: () => (
      <HFInternationPhone
        control={control}
        name={computedSlug}
        tabIndex={field?.tabIndex}
        fullWidth
        required={field?.required}
        placeholder={field.attributes?.placeholder}
        mask={"(99) 999-99-99"}
        defaultValue={defaultValue}
        disabled={isDisabled}
        {...props}
      />
    ),
    MULTISELECT: () => (
      <HFMultipleAutocomplete
        disabled={isDisabled}
        isFormEdit
        control={control}
        name={computedSlug}
        width="100%"
        required={field.required}
        setFormValue={setFormValue}
        field={field}
        placeholder={field.attributes?.placeholder}
        isBlackBg={isBlackBg}
        defaultValue={defaultValue}
        {...props}
      />
    ),
    MULTISELECT_V2: () => (
      <HFMultipleAutocomplete
        disabled={isDisabled}
        isFormEdit
        control={control}
        name={computedSlug}
        width="100%"
        required={field.required}
        field={field}
        placeholder={field.attributes?.placeholder}
        isBlackBg={isBlackBg}
        defaultValue={defaultValue}
        {...props}
      />
    ),
    DATE: () => (
      <HFDatePicker
        control={control}
        name={computedSlug}
        fullWidth
        width={"100%"}
        mask={"99.99.9999"}
        isFormEdit
        isBlackBg={isBlackBg}
        required={field.required}
        placeholder={field.attributes?.placeholder}
        defaultValue={defaultValue}
        disabled={isDisabled}
        {...props}
      />
    ),
    DATE_TIME: () => (
      <HFDateTimePicker
        disabled={isDisabled}
        isFormEdit
        isBlackBg={isBlackBg}
        showCopyBtn={false}
        control={control}
        name={computedSlug}
        required={field.required}
        placeholder={field.attributes?.placeholder}
        defaultValue={defaultValue}
        {...props}
      />
    ),
    TIME: () => (
      <HFTimePicker
        disabled={isDisabled}
        isFormEdit
        isBlackBg={isBlackBg}
        control={control}
        name={computedSlug}
        required={field.required}
        placeholder={field.attributes?.placeholder}
        defaultValue={defaultValue}
        {...props}
      />
    ),
    NUMBER: () => (
      <HFNumberField
        disabled={isDisabled}
        isFormEdit
        control={control}
        name={computedSlug}
        fullWidth
        required={field.required}
        placeholder={field.attributes?.placeholder}
        isBlackBg={isBlackBg}
        defaultValue={defaultValue}
        {...props}
      />
    ),
    FLOAT: () => (
      <HFFloatField
        disabled={isDisabled}
        isFormEdit
        control={control}
        name={computedSlug}
        fullWidth
        required={field.required}
        placeholder={field.attributes?.placeholder}
        isBlackBg={isBlackBg}
        defaultValue={defaultValue}
        {...props}
      />
    ),
    FLOAT_NOLIMIT: () => (
      <HFFloatField
        disabled={isDisabled}
        isFormEdit
        control={control}
        name={computedSlug}
        fullWidth
        required={field.required}
        placeholder={field.attributes?.placeholder}
        isBlackBg={isBlackBg}
        defaultValue={defaultValue}
        {...props}
      />
    ),
    CHECKBOX: () => (
      <HFCheckbox
        disabled={isDisabled}
        isFormEdit
        isBlackBg={isBlackBg}
        control={control}
        name={computedSlug}
        required={field.required}
        defaultValue={defaultValue}
        {...props}
      />
    ),
    SWITCH: () => (
      <HFSwitch
        disabled={isDisabled}
        isFormEdit
        isBlackBg={isBlackBg}
        control={control}
        name={computedSlug}
        required={field.required}
        defaultValue={defaultValue}
        {...props}
      />
    ),
    EMAIL: () => (
      <HFTextField
        disabled={isDisabled}
        isFormEdit
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
        {...props}
      />
    ),
    FILE: () => (
      <HFFileUpload
        control={control}
        name={computedSlug}
        tabIndex={field?.tabIndex}
        required={field?.required}
        defaultValue={defaultValue}
        disabled={isDisabled}
        {...props}
      />
    ),
    ICON: () => (
      <HFIconPicker
        isFormEdit
        control={control}
        name={computedSlug}
        required={field.required}
        defaultValue={defaultValue}
        {...props}
      />
    ),
    MAP: () => (
      <HFModalMap
        control={control}
        field={field}
        defaultValue={defaultValue}
        isFormEdit
        name={computedSlug}
        required={field?.required}
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

export default CellFormElementGenerator;
