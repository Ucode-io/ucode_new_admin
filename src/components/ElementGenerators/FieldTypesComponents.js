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
import NewCHFFormulaField from "../FormElements/NewCHFormulaField";
import CellManyToManyRelationElement from "./CellManyToManyRelationElement";
import CellRelationFormElementForTableView from "./CellRelationFormElementForTable";
import MultiLineCellFormElement from "./MultiLineCellFormElement";

export const fieldTypesComponent = {
  LOOKUP: CellRelationFormElementForTableView,
  LOOKUPS: CellManyToManyRelationElement,
  SINGLE_LINE: HFTextField,
  PASSWORD: HFPassword,
  SCAN_BARCODE: InventoryBarCode,
  PHONE: HFTextFieldWithMask,
  FORMULA: HFFormulaField,
  FORMULA_FRONTEND: NewCHFFormulaField,
  PICK_LIST: HFAutocomplete,
  MULTISELECT: HFMultipleAutocomplete,
  MULTISELECT_V2: HFMultipleAutocomplete,
  DATE: HFDatePicker,
  DATE_TIME: HFDateTimePicker,
  TIME: HFTimePicker,
  NUMBER: HFNumberField,
  FLOAT: HFFloatField,
  CHECKBOX: HFCheckbox,
  SWITCH: HFSwitch,
  EMAIL: HFTextField,
  ICON: HFIconPicker,
  MAP: HFModalMap,
  MULTI_LINE: MultiLineCellFormElement,
  CUSTOM_IMAGE: HFFileUpload,
  VIDEO: HFVideoUpload,
  FILE: HFFileUpload,
  COLOR: HFColorPicker,
};
