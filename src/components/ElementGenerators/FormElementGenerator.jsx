import {Lock} from "@mui/icons-material";
import {InputAdornment, Tooltip} from "@mui/material";
import {Parser} from "hot-formula-parser";
import {useMemo} from "react";
import {useSelector} from "react-redux";
import FRow from "../FormElements/FRow";
import HFAutocomplete from "../FormElements/HFAutocomplete";
import HFCheckbox from "../FormElements/HFCheckbox";
import HFDatePicker from "../FormElements/HFDatePicker";
import HFDateTimePicker from "../FormElements/HFDateTimePicker";
import HFDentist from "../FormElements/HFDentist";
import HFFileUpload from "../FormElements/HFFileUpload";
import HFFloatField from "../FormElements/HFFloatField";
import HFFormulaField from "../FormElements/HFFormulaField";
import HFIconPicker from "../FormElements/HFIconPicker";
import HFImageUpload from "../FormElements/HFImageUpload";
import HFInternationPhone from "../FormElements/HFInternationPhone";
import HFMapField from "../FormElements/HFMapField";
import HFMultipleAutocomplete from "../FormElements/HFMultipleAutocomplete";
import HFNumberField from "../FormElements/HFNumberField";
import HFSwitch from "../FormElements/HFSwitch";
import HFTextEditor from "../FormElements/HFTextEditor";
import HFTextField from "../FormElements/HFTextField";
import HFTextFieldWithMask from "../FormElements/HFTextFieldWithMask";
import HFTimePicker from "../FormElements/HFTimePicker";
import HFVideoUpload from "../FormElements/HFVideoUpload";
import InventoryBarCode from "../FormElements/InventoryBarcode";
import BarcodeGenerator from "./BarcodeGenerator";
import CodabarBarcode from "./CodabarBarcode";
import DynamicRelationFormElement from "./DynamicRelationFormElement";
import ManyToManyRelationFormElement from "./ManyToManyRelationFormElement";
import RelationFormElement from "./RelationFormElement";
import {useTranslation} from "react-i18next";
import HFDateTimePickerWithout from "../FormElements/HFDateTimePickerWithout";
import ManyToManyRelationMultipleInput from "./ManyToManyRelationMultipleInput";
import HFPolygonField from "../FormElements/HFPolygonField";
import HFQrFieldComponent from "../FormElements/HFQrField";
import HFMultiImage from "../FormElements/HFMultiImage";

const parser = new Parser();

const FormElementGenerator = ({
  field = {},
  control,
  setFormValue,
  formTableSlug,
  checkRequired = true,
  activeLang,
  fieldsList,
  checkPermission = true,
  isMultiLanguage,
  relatedTable,
  valueGenerator,
  errors,
  sectionModal,
  watch,
  ...props
}) => {
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

  if (field?.id?.includes("#")) {
    if (field?.relation_type === "Many2Many") {
      return field?.attributes?.multiple_input ? (
        <ManyToManyRelationMultipleInput
          control={control}
          field={field}
          setFormValue={setFormValue}
          defaultValue={defaultValue}
          disabled={isDisabled}
          checkRequiredField={checkRequiredField}
          name={computedSlug}
          {...props}
        />
      ) : (
        <ManyToManyRelationFormElement
          control={control}
          field={field}
          setFormValue={setFormValue}
          defaultValue={defaultValue}
          disabled={isDisabled}
          checkRequiredField={checkRequiredField}
          name={computedSlug}
          {...props}
        />
      );
    } else if (field?.relation_type === "Many2Dynamic") {
      return (
        <DynamicRelationFormElement
          control={control}
          field={field}
          setFormValue={setFormValue}
          defaultValue={defaultValue}
          disabled={isDisabled}
          checkRequiredField={checkRequiredField}
          {...props}
        />
      );
    } else {
      return (
        <RelationFormElement
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
      );
    }
  }

  switch (field.type) {
    case "MAP":
      return (
        <FRow label={label} required={field.required}>
          <HFMapField
            control={control}
            name={computedSlug}
            tabIndex={field?.tabIndex}
            required={checkRequiredField}
            defaultValue={defaultValue}
            disabled={isDisabled}
            field={field}
            {...props}
          />
        </FRow>
      );
    case "POLYGON":
      return (
        <FRow label={label} required={field.required}>
          <HFPolygonField
            control={control}
            name={computedSlug}
            tabIndex={field?.tabIndex}
            required={checkRequiredField}
            defaultValue={defaultValue}
            disabled={isDisabled}
            setFormValue={setFormValue}
            field={field}
            {...props}
          />
        </FRow>
      );
    case "QR":
      return (
        <FRow label={label} required={field.required}>
          <HFQrFieldComponent
            control={control}
            name={computedSlug}
            defaultValue={defaultValue}
            field={field}
            required={checkRequiredField}
          />
        </FRow>
      );
    case "SCAN_BARCODE":
      return valueGenerator ? (
        <InventoryBarCode
          relatedTable={relatedTable}
          control={control}
          name={computedSlug}
          fullWidth
          setFormValue={setFormValue}
          required={field.required}
          placeholder={field.attributes?.placeholder}
          defaultValue={defaultValue}
          field={field}
          disabled={isDisabled}
          checkRequiredField={checkRequiredField}
          key={computedSlug}
          valueGenerator={valueGenerator}
          {...props}
        />
      ) : (
        <FRow label={label} required={field.required}>
          <InventoryBarCode
            relatedTable={relatedTable}
            control={control}
            name={computedSlug}
            fullWidth
            setFormValue={setFormValue}
            required={field.required}
            placeholder={field.attributes?.placeholder}
            defaultValue={defaultValue}
            field={field}
            disabled={isDisabled}
            checkRequiredField={checkRequiredField}
            key={computedSlug}
            valueGenerator={valueGenerator}
            {...props}
          />
        </FRow>
      );
    case "SINGLE_LINE":
      return (
        <FRow label={label} required={field.required}>
          <HFTextField
            field={field}
            setFormValue={setFormValue}
            control={control}
            name={computedSlug}
            tabIndex={field?.tabIndex}
            fullWidth
            watch={watch}
            placeholder={
              field?.attributes?.show_label
                ? ""
                : (field?.attributes?.[`label_${i18n.language}`] ?? field.label)
            }
            required={checkRequiredField}
            defaultValue={defaultValue}
            disabled={isDisabled}
            checkRequiredField={checkRequiredField}
            key={computedSlug}
            rules={{
              pattern: {
                value: new RegExp(field?.attributes?.validation),
                message: field?.attributes?.validation_message,
              },
            }}
            {...props}
          />
        </FRow>
      );

    case "PHONE":
      return (
        <FRow label={label} required={field.required}>
          <HFTextFieldWithMask
            control={control}
            name={computedSlug}
            tabIndex={field?.tabIndex}
            fullWidth
            placeholder={
              field?.attributes?.show_label
                ? ""
                : (field?.attributes?.[`label_${i18n.language}`] ?? field.label)
            }
            required={checkRequiredField}
            mask={"(99) 999-99-99"}
            defaultValue={defaultValue}
            disabled={isDisabled}
            {...props}
          />
        </FRow>
      );

    case "INTERNATIONAL_PHONE":
      return (
        <FRow label={label} required={field.required}>
          <HFInternationPhone
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
        </FRow>
      );

    case "INTERNATION_PHONE":
      return (
        <FRow label={label} required={field.required}>
          <HFInternationPhone
            control={control}
            name={computedSlug}
            tabIndex={field?.tabIndex}
            fullWidth
            required={checkRequiredField}
            placeholder={field.attributes?.placeholder}
            mask={"(99) 999-99-99"}
            defaultValue={defaultValue}
            disabled={isDisabled}
            {...props}
          />
        </FRow>
      );

    case "PICK_LIST":
      return (
        <FRow label={label} required={field.required}>
          <HFAutocomplete
            control={control}
            tabIndex={field?.tabIndex}
            name={computedSlug}
            width="100%"
            options={field?.attributes?.options}
            required={checkRequiredField}
            placeholder={field.attributes?.placeholder}
            defaultValue={defaultValue}
            disabled={isDisabled}
            key={computedSlug}
            {...props}
          />
        </FRow>
      );

    case "MULTI_LINE":
      return (
        <FRow label={label} required={field.required}>
          <HFTextEditor
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
        </FRow>
      );

    case "DATE":
      return (
        <FRow label={label} required={field.required}>
          <HFDatePicker
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
        </FRow>
      );

    case "DATE_TIME":
      return (
        <FRow label={label} required={field.required}>
          <HFDateTimePicker
            field={field}
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
        </FRow>
      );

    case "DATE_TIME_WITHOUT_TIME_ZONE":
      return (
        <FRow label={label} required={field.required}>
          <HFDateTimePickerWithout
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
        </FRow>
      );

    case "TIME":
      return (
        <FRow label={label} required={field.required}>
          <HFTimePicker
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
        </FRow>
      );

    case "NUMBER":
      return (
        <FRow label={label} required={field.required}>
          <HFNumberField
            control={control}
            name={computedSlug}
            tabIndex={field?.tabIndex}
            fullWidth
            type="number"
            placeholder={
              field?.attributes?.show_label
                ? ""
                : (field?.attributes?.[`label_${i18n.language}`] ?? field.label)
            }
            required={checkRequiredField}
            field={field}
            defaultValue={defaultValue}
            disabled={isDisabled}
            rules={{
              pattern: {
                value: new RegExp(field?.attributes?.validation),
                message: field?.attributes?.validation_message,
              },
            }}
            {...props}
          />
        </FRow>
      );
    case "FLOAT":
      return (
        <FRow label={label} required={field.required}>
          <HFFloatField
            control={control}
            name={computedSlug}
            tabIndex={field?.tabIndex}
            fullWidth
            type="number"
            required={checkRequiredField}
            placeholder={field.attributes?.placeholder}
            defaultValue={defaultValue}
            disabled={isDisabled}
            key={computedSlug}
            {...props}
          />
        </FRow>
      );

    case "FLOAT_NOLIMIT":
      return (
        <FRow label={label} required={field.required}>
          <HFFloatField
            control={control}
            name={computedSlug}
            tabIndex={field?.tabIndex}
            fullWidth
            type="number"
            required={checkRequiredField}
            placeholder={field.attributes?.placeholder}
            defaultValue={defaultValue}
            disabled={isDisabled}
            key={computedSlug}
            {...props}
          />
        </FRow>
      );

    case "CHECKBOX":
      return (
        <FRow label={label}>
          <HFCheckbox
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
        </FRow>
      );

    case "MULTISELECT":
      return (
        <FRow label={label} required={field.required}>
          <HFMultipleAutocomplete
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
        </FRow>
      );

    case "SWITCH":
      return (
        <FRow label={label}>
          <HFSwitch
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
        </FRow>
      );

    case "EMAIL":
      return (
        <FRow label={label} required={field.required}>
          <HFTextField
            control={control}
            name={computedSlug}
            rules={{
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: "Incorrect email format",
              },
            }}
            fullWidth
            placeholder={
              field?.attributes?.show_label
                ? ""
                : (field?.attributes?.[`label_${i18n.language}`] ?? field.label)
            }
            required={checkRequiredField}
            defaultValue={defaultValue}
            tabIndex={field?.tabIndex}
            disabled={isDisabled}
            key={computedSlug}
            {...props}
          />
        </FRow>
      );

    case "PHOTO":
      return (
        <FRow label={label} required={field.required}>
          <HFImageUpload
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
        </FRow>
      );

    case "MULTI_IMAGE":
      return (
        <FRow label={label} required={field.required}>
          <HFMultiImage
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
        </FRow>
      );

    case "VIDEO":
      return (
        <FRow label={label} required={field.required}>
          <HFVideoUpload
            control={control}
            name={computedSlug}
            tabIndex={field?.tabIndex}
            required={checkRequiredField}
            defaultValue={defaultValue}
            disabled={isDisabled}
            {...props}
          />
        </FRow>
      );
    case "FILE":
      return (
        <FRow label={label} required={field.required}>
          <HFFileUpload
            control={control}
            name={computedSlug}
            tabIndex={field?.tabIndex}
            required={checkRequiredField}
            defaultValue={defaultValue}
            disabled={isDisabled}
            field={field}
            {...props}
          />
        </FRow>
      );

    case "BARCODE":
      return (
        <FRow label={label} required={field.required}>
          <BarcodeGenerator
            control={control}
            field={field}
            name={computedSlug}
            tabIndex={field?.tabIndex}
            fullWidth
            required={checkRequiredField}
            placeholder={field.attributes?.placeholder}
            defaultValue={defaultValue}
            // disabled={isDisabled}
            formTableSlug={formTableSlug}
            {...props}
          />
        </FRow>
      );

    case "CODABAR":
      return (
        <FRow label={label} required={field.required}>
          <CodabarBarcode
            control={control}
            name={computedSlug}
            tabIndex={field?.tabIndex}
            fullWidth
            field={field}
            required={checkRequiredField}
            placeholder={field.attributes?.placeholder}
            defaultValue={defaultValue}
            // disabled={isDisabled}
            formTableSlug={formTableSlug}
            {...props}
          />
        </FRow>
      );

    case "DENTIST":
      return (
        <FRow label={label} required={field.required}>
          <HFDentist
            control={control}
            name={computedSlug}
            fullWidth
            required={checkRequiredField}
            placeholder={field.attributes?.placeholder}
            defaultValue={defaultValue}
            tabIndex={field?.tabIndex}
            disabled={isDisabled}
            {...props}
          />
        </FRow>
      );

    // case "CUSTOM_IMAGE":
    //   return (
    //     <FRow label={field.label} required={field.required}>
    //       <HFCustomImage
    //         control={control}
    //         name={computedSlug}
    //         fullWidth
    //         required={field.required}
    //         placeholder={field.attributes?.placeholder}
    //         defaultValue={defaultValue}
    //         tabIndex={field?.tabIndex}
    //         disabled={isDisabled}
    //         {...props}
    //       />
    //     </FRow>
    //   );

    case "ICON":
      return (
        <FRow label={label} required={field.required}>
          <HFIconPicker
            control={control}
            name={computedSlug}
            tabIndex={field?.tabIndex}
            required={checkRequiredField}
            defaultValue={defaultValue}
            disabled={isDisabled}
            {...props}
          />
        </FRow>
      );

    case "FORMULA":
    case "INCREMENT_ID":
      return (
        <FRow label={label} required={field.required}>
          <HFTextField
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
        </FRow>
      );
    case "INCREMENT_NUMBER":
      return (
        <FRow label={label} required={field.required}>
          <HFTextField
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
        </FRow>
      );

    case "FORMULA_FRONTEND":
      return (
        <FRow label={label} required={field.required}>
          <HFFormulaField
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
        </FRow>
      );

    case "COLOR":
      return (
        <FRow label={label} required={field.required}>
          <HFTextField
            control={control}
            name={computedSlug}
            tabIndex={field?.tabIndex}
            fullWidth
            required={checkRequiredField}
            placeholder={field.attributes?.placeholder}
            defaultValue={defaultValue}
            type="color"
            key={computedSlug}
            disabled={isDisabled}
            {...props}
          />
        </FRow>
      );

    case "PASSWORD":
      return (
        <FRow label={label} required={field.required}>
          <HFTextField
            control={control}
            name={computedSlug}
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
            type="password"
            {...props}
          />
        </FRow>
      );

    default:
      return (
        <FRow label={label} required={field.required}>
          <HFTextField
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
        </FRow>
      );
  }
};

export default FormElementGenerator;
