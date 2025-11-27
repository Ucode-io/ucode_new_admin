import React, {useMemo} from "react";
import HCTextField from "./HCTextField";
import {useSelector} from "react-redux";
import {useTranslation} from "react-i18next";
import FieldLabel from "./FieldLabel";
import HCNumberField from "./HCNumberField";
import HCPassword from "./HCPassword";
import HCMultiLine from "./HCMultiline";
import HCFloatNumberField from "./HCFloatNumberField";
import HCMapField from "./HCMapField";
import HCMultipleAutocomplete from "./HCMultipleAutocomplete";
import HCbarcodeField from "./HCBarcodeField";
import HCSwitch from "./HCSwitch";
import HCCheckbox from "./HCCheckbox";
import HCDatePicker from "./HCDataPicker";
import HCTimePicker from "./HCTimePicker";
import HCDateTimePicker from "./HCDateTimePicker";
import HCDateTimePickerWithout from "./HCDateTimePickerWithout";
import HCImageUpload from "./HCImageUpload";
import HCMultiImage from "./HCMultiImage";
import HCVideoUpload from "./HCVideoUpload";
import HCFileUpload from "./HCFileUpload";
import HCFormulaField from "./HCFormulaField";
import HCInternationPhone from "./HCInternationPhone";
import {InputAdornment, Tooltip} from "@mui/material";
import {Lock} from "@mui/icons-material";
import OneCRelationFormElement from "./OneCRelationFormElement";
import OneCMany2ManyFormElement from "./OneCMany2ManyFormElement";
import OneCDynamicFormElement from "./OneCDynamicFormElement";

function Form1CElementGenerator({
  field = {},
  control,
  setFormValue,
  formTableSlug,
  checkRequired = true,
  activeLang,
  checkPermission = true,
  isMultiLanguage,
  relatedTable,
  valueGenerator,
  errors,
  fields,
  sectionModal,
  ...props
}) {
  const isUserId = useSelector((state) => state?.auth?.userId);
  const tables = useSelector((state) => state?.auth?.tables);
  const {i18n} = useTranslation();

  const checkRequiredField = !checkRequired ? checkRequired : field?.required;
  let relationTableSlug = "";
  let objectIdFromJWT = "";
  if (field?.id?.includes("#")) {
    relationTableSlug = field?.id?.split("#")[0];
  }

  const slugSplit = (slug) => {
    const parts = slug.split("_");
    return parts[parts.length - 1];
  };

  const label = useMemo(() => {
    if (field?.enable_multilanguage) {
      return field?.attributes?.show_label
        ? `${field?.label} (${activeLang ?? slugSplit(field?.slug)})`
        : field?.attributes?.[`label_${i18n?.language}`];
    } else {
      if (field?.show_label === false) return "";
      else
        return (
          field?.attributes?.[`label_${i18n.language}`] || field?.label || " "
        );
    }
  }, [field, activeLang, i18n?.language]);

  tables?.forEach((table) => {
    if (table?.table_slug === relationTableSlug) {
      objectIdFromJWT = table?.object_id;
    }
  });

  const removeLangFromSlug = (slug) => {
    var lastIndex = slug.lastIndexOf("_");
    if (lastIndex !== -1) {
      var result = slug.substring(0, lastIndex);
      return result;
    } else {
      return false;
    }
  };

  const computedSlug = useMemo(() => {
    if (field?.enable_multilanguage) {
      return `${removeLangFromSlug(field.slug)}_${activeLang}`;
    } else if (field.id?.includes("@")) {
      return `$${field?.id?.split("@")?.[0]}.${field?.slug}`;
    } else if (field?.id?.includes("#")) {
      if (field?.type === "Many2Many") {
        return `${field.id?.split("#")?.[0]}_ids`;
      } else if (field?.type === "Many2One") {
        return `${field.id?.split("#")?.[0]}_id`;
      }
    }

    return field?.slug;
  }, [field?.slug, activeLang, field?.enable_multilanguage]);

  const defaultValue = useMemo(() => {
    if (field?.attributes?.object_id_from_jwt === true) return objectIdFromJWT;
    if (field?.attributes?.is_user_id_default === true) return isUserId;

    const defaultValue =
      field.attributes?.defaultValue ?? field.attributes?.default_values;

    if (!defaultValue) return undefined;
    if (field.relation_type === "Many2One") return defaultValue[0];
    if (
      field?.relation_type !== "Many2One" ||
      field?.relation_type !== "Many2Many"
    )
      return defaultValue;
    if (field.type === "MULTISELECT" || field.id?.includes("#"))
      return defaultValue;
    if (field?.type === "SINGLE_LINE") return defaultValue;
    const {error, result} = parser.parse(defaultValue);
    return error ? undefined : result;
  }, [field.type, field.id, field.relation_type, objectIdFromJWT, isUserId]);

  const isDisabled = useMemo(() => {
    const {attributes} = field;

    if (window.location.pathname.includes("create")) {
      if (attributes?.disabled) return true;
      else return false;
    } else {
      return (
        attributes?.disabled ||
        !attributes?.field_permission?.edit_permission ||
        attributes?.is_editable
      );
    }
  }, [field]);

  if (
    !field.attributes?.field_permission?.view_permission &&
    checkPermission &&
    field?.slug !== "default_values"
  ) {
    return null;
  }
  console.log("fieldsfields", fields);
  if (field?.id?.includes("#")) {
    if (field?.relation_type === "Many2Many") {
      return (
        <FieldLabel
          label={
            field?.attributes[`title_${i18n?.language}`] ||
            field?.attributes[`name_${i18n?.language}`] ||
            field?.attributes[`label_to_${i18n?.language}`] ||
            field?.attributes[`label_${i18n?.language}`] ||
            field?.label ||
            "No Label found"
          }>
          <OneCMany2ManyFormElement
            control={control}
            field={field}
            setFormValue={setFormValue}
            defaultValue={defaultValue}
            disabled={isDisabled}
            checkRequiredField={checkRequiredField}
            name={computedSlug}
            {...props}
          />
        </FieldLabel>
      );
    } else if (field?.relation_type === "Many2Dynamic") {
      return (
        <FieldLabel
          label={
            field?.attributes[`title_${i18n?.language}`] ||
            field?.attributes[`name${i18n?.language}`] ||
            field?.attributes[`label_${i18n?.language}`] ||
            field?.label ||
            "No Label found"
          }>
          <OneCDynamicFormElement
            control={control}
            field={field}
            setFormValue={setFormValue}
            defaultValue={defaultValue}
            disabled={isDisabled}
            checkRequiredField={checkRequiredField}
            {...props}
          />
        </FieldLabel>
      );
    } else {
      return (
        <FieldLabel
          label={
            field?.attributes?.[`label_${i18n?.language}`] ||
            field?.attributes?.[`title_${i18n?.language}`] ||
            field?.attributes[`label_to_${i18n?.language}`] ||
            field?.label ||
            "No Label found"
          }>
          <OneCRelationFormElement
            control={control}
            field={field}
            name={computedSlug}
            setFormValue={setFormValue}
            formTableSlug={formTableSlug}
            defaultValue={defaultValue}
            disabled={isDisabled}
            key={computedSlug}
            activeLang={activeLang}
            checkRequiredField={checkRequiredField}
            errors={errors}
            rules={{
              pattern: {
                value: new RegExp(field?.attributes?.validation),
                message: field?.attributes?.validation_message,
              },
            }}
            {...props}
          />
        </FieldLabel>
      );
    }
  }

  switch (field?.type) {
    case "SINGLE_LINE":
      return (
        <FieldLabel key={field?.id} label={label}>
          <HCTextField
            placeholder={field?.placeholder}
            fullWidth
            control={control}
            field={field}
            name={computedSlug}
            required={checkRequiredField}
            disabled={isDisabled}
            defaultValue={defaultValue}
          />
        </FieldLabel>
      );
    case "EMAIL":
      return (
        <FieldLabel key={field?.id} label={label}>
          <HCTextField
            placeholder={field?.placeholder}
            fullWidth
            control={control}
            field={field}
            name={computedSlug}
            required={checkRequiredField}
            disabled={isDisabled}
            defaultValue={defaultValue}
            rules={{
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: "Incorrect email format",
              },
            }}
          />
        </FieldLabel>
      );
    case "NUMBER":
      return (
        <FieldLabel key={field?.id} label={label}>
          <HCNumberField
            control={control}
            name={computedSlug}
            withTrim={true}
            tabIndex={field?.tabIndex}
            required={checkRequiredField}
            rules={{
              pattern: {
                value: new RegExp(field?.attributes?.validation),
                message: field?.attributes?.validation_message,
              },
            }}
            placeholder={
              field?.attributes?.show_label
                ? ""
                : (field?.attributes?.[`label_${i18n.language}`] ?? field.label)
            }
          />
        </FieldLabel>
      );
    case "FLOAT":
      return (
        <FieldLabel key={field?.id} label={label}>
          <HCFloatNumberField
            control={control}
            name={computedSlug}
            withTrim={true}
            tabIndex={field?.tabIndex}
            required={checkRequiredField}
            rules={{
              pattern: {
                value: new RegExp(field?.attributes?.validation),
                message: field?.attributes?.validation_message,
              },
            }}
            placeholder={
              field?.attributes?.show_label
                ? ""
                : (field?.attributes?.[`label_${i18n.language}`] ?? field.label)
            }
          />
        </FieldLabel>
      );
    case "PASSWORD":
      return (
        <FieldLabel key={field?.id} label={label}>
          <HCPassword
            type="password"
            control={control}
            name={computedSlug}
            withTrim={true}
            required={checkRequiredField}
          />
        </FieldLabel>
      );
    case "MULTI_LINE":
      return (
        <FieldLabel label={label}>
          <HCMultiLine
            control={control}
            label={label}
            name={computedSlug}
            tabIndex={field?.tabIndex}
            field={field}
            fullWidth
            multiline
            rows={4}
            placeholder={
              field?.attributes?.show_label
                ? ""
                : (field?.attributes?.[`label_${i18n.language}`] ?? field.label)
            }
            required={checkRequiredField}
            defaultValue={field.defaultValue}
            disabled={isDisabled}
            key={computedSlug}
            {...props}
          />
        </FieldLabel>
      );
    case "MAP":
      return (
        <FieldLabel label={label} required={field.required}>
          <HCMapField
            control={control}
            name={computedSlug}
            tabIndex={field?.tabIndex}
            required={checkRequiredField}
            defaultValue={defaultValue}
            disabled={isDisabled}
            field={field}
            width="400px"
            {...props}
          />
        </FieldLabel>
      );
    case "MULTISELECT":
      return (
        <FieldLabel label={label} required={field.required}>
          <HCMultipleAutocomplete
            control={control}
            name={computedSlug}
            width="100%"
            required={checkRequiredField}
            field={field}
            tabIndex={field?.tabIndex}
            placeholder={field.attributes?.placeholder}
            defaultValue={defaultValue}
            disabled={isDisabled}
            key={computedSlug}
            {...props}
          />
        </FieldLabel>
      );

    case "BARCODE":
      return (
        <FieldLabel label={label} required={field.required}>
          <HCbarcodeField
            control={control}
            field={field}
            name={computedSlug}
            tabIndex={field?.tabIndex}
            fullWidth
            required={checkRequiredField}
            placeholder={field.attributes?.placeholder}
            defaultValue={defaultValue}
            disabled={isDisabled}
            formTableSlug={formTableSlug}
            {...props}
          />
        </FieldLabel>
      );

    case "SWITCH":
      return (
        <FieldLabel label={label} required={field.required}>
          <HCSwitch
            control={control}
            name={computedSlug}
            label={label}
            tabIndex={field?.tabIndex}
            required={checkRequiredField}
            defaultValue={defaultValue}
            disabled={isDisabled}
            key={computedSlug}
            isShowLable={false}
            {...props}
          />
        </FieldLabel>
      );

    case "CHECKBOX":
      return (
        <FieldLabel label={label} required={field.required}>
          <HCCheckbox
            control={control}
            name={computedSlug}
            tabIndex={field?.tabIndex}
            label={label}
            required={checkRequiredField}
            defaultValue={defaultValue}
            disabled={isDisabled}
            key={computedSlug}
            isShowLable={false}
            {...props}
          />
        </FieldLabel>
      );

    case "DATE":
      return (
        <FieldLabel label={label} required={field.required}>
          <HCDatePicker
            control={control}
            name={computedSlug}
            tabIndex={field?.tabIndex}
            required={checkRequiredField}
            fullWidth
            sectionModa={sectionModal}
            width={"100%"}
            mask={"99.99.9999"}
            placeholder={field.attributes?.placeholder}
            defaultValue={defaultValue}
            disabled={isDisabled}
            errors={errors}
            {...props}
          />
        </FieldLabel>
      );

    case "TIME":
      return (
        <FieldLabel label={label} required={field.required}>
          <HCTimePicker
            control={control}
            name={computedSlug}
            sectionModal={sectionModal}
            tabIndex={field?.tabIndex}
            required={checkRequiredField}
            placeholder={field.attributes?.placeholder}
            defaultValue={defaultValue}
            disabled={isDisabled}
            {...props}
          />
        </FieldLabel>
      );

    case "DATE_TIME":
      return (
        <FieldLabel label={label} required={field.required}>
          <HCDateTimePicker
            control={control}
            name={computedSlug}
            sectionModal={sectionModal}
            tabIndex={field?.tabIndex}
            required={checkRequiredField}
            placeholder={field.attributes?.placeholder}
            defaultValue={defaultValue}
            disabled={isDisabled}
            {...props}
          />
        </FieldLabel>
      );

    case "DATE_TIME_WITHOUT_TIME_ZONE":
      return (
        <FieldLabel label={label} required={field.required}>
          <HCDateTimePickerWithout
            control={control}
            name={computedSlug}
            sectionModal={sectionModal}
            tabIndex={field?.tabIndex}
            mask={"99.99.9999"}
            required={checkRequiredField}
            placeholder={field.attributes?.placeholder}
            defaultValue={defaultValue}
            disabled={isDisabled}
            {...props}
          />
        </FieldLabel>
      );

    case "PHOTO":
      return (
        <FieldLabel label={label} required={field.required}>
          <HCImageUpload
            control={control}
            name={computedSlug}
            key={computedSlug}
            tabIndex={field?.tabIndex}
            required={checkRequiredField}
            defaultValue={defaultValue}
            disabled={isDisabled}
            field={field}
            {...props}
          />
        </FieldLabel>
      );

    case "MULTI_IMAGE":
      return (
        <FieldLabel label={label} required={field.required}>
          <HCMultiImage
            control={control}
            name={computedSlug}
            key={computedSlug}
            tabIndex={field?.tabIndex}
            required={checkRequiredField}
            defaultValue={defaultValue}
            disabled={isDisabled}
            field={field}
            {...props}
          />
        </FieldLabel>
      );

    case "VIDEO":
      return (
        <FieldLabel label={label} required={field.required}>
          <HCVideoUpload
            control={control}
            name={computedSlug}
            tabIndex={field?.tabIndex}
            required={checkRequiredField}
            defaultValue={defaultValue}
            disabled={isDisabled}
            {...props}
          />
        </FieldLabel>
      );

    case "FILE":
      return (
        <FieldLabel label={label} required={field.required}>
          <HCFileUpload
            control={control}
            name={computedSlug}
            tabIndex={field?.tabIndex}
            required={checkRequiredField}
            defaultValue={defaultValue}
            disabled={isDisabled}
            field={field}
            {...props}
          />
        </FieldLabel>
      );

    case "FORMULA_FRONTEND":
      return (
        <FieldLabel label={label} required={field.required}>
          <HCFormulaField
            setFormValue={setFormValue}
            control={control}
            required={checkRequiredField}
            placeholder={field.attributes?.placeholder}
            name={computedSlug}
            tabIndex={field?.tabIndex}
            fieldsList={fieldsList}
            field={field}
            defaultValue={defaultValue}
            disabled={isDisabled}
          />
        </FieldLabel>
      );

    case "FORMULA":
    case "INCREMENT_ID":
      return (
        <FieldLabel label={label} required={field.required}>
          <HCTextField
            control={control}
            name={computedSlug}
            tabIndex={field?.tabIndex}
            fullWidth
            required={checkRequiredField}
            placeholder={field.attributes?.placeholder}
            defaultValue={defaultValue}
            disabled={isDisabled}
            InputProps={{
              readOnly: true,
              style: {
                background: "#c0c0c039",
              },
            }}
            {...props}
          />
        </FieldLabel>
      );

    case "INTERNATION_PHONE":
      return (
        <FieldLabel label={label} required={field.required}>
          <HCInternationPhone
            control={control}
            name={computedSlug}
            tabIndex={field?.tabIndex}
            fullWidth
            required={checkRequiredField}
            placeholder={field.attributes?.placeholder}
            defaultValue={defaultValue}
            disabled={isDisabled}
            {...props}
          />
        </FieldLabel>
      );

    default:
      return (
        <FieldLabel label={label} required={field.required}>
          <HCTextField
            control={control}
            name={computedSlug}
            key={computedSlug}
            tabIndex={field?.tabIndex}
            fullWidth
            placeholder={
              field?.attributes?.show_label
                ? ""
                : (field?.attributes?.[`label_${i18n.language}`] ?? field.label)
            }
            required={checkRequiredField}
            defaultValue={defaultValue}
            disabled={isDisabled}
            InputProps={{
              style: isDisabled
                ? {
                    background: "#c0c0c039",
                    paddingRight: "0px",
                  }
                : {
                    background: "inherit",
                    color: "inherit",
                  },

              endAdornment: isDisabled && (
                <Tooltip title="This field is disabled for this role!">
                  <InputAdornment position="start">
                    <Lock style={{fontSize: "20px"}} />
                  </InputAdornment>
                </Tooltip>
              ),
            }}
            {...props}
          />
        </FieldLabel>
      );
  }
}

export default Form1CElementGenerator;
