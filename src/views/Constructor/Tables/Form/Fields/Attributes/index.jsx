import {useEffect, useRef} from "react";
import CheckboxAttributes from "./CheckboxAttributes";
import CodabarIncrements from "./CodabarAttributes";
import DateAttributes from "./DateAttributes";
import FormulaAttributes from "./FormulaAttributes";
import FrontendFormulaAttributes from "./FrontendFormulaAttributes";
import IncrementIDAttributes from "./IncrementIDAttributes";
import IncrementNumberAttributes from "./IncrementNumberAttributes";
import InventoryBarcodeAttributes from "./InventoryBarcodeAttributes";
import MultiLineAttributes from "./MultiLineAttributes";
import NumberAttributes from "./NumberAttributes";
import PickListAttributes from "./PickListAttributes";
import SingleLineAttributes from "./SingleLineAttributes";
import MapAttributes from "./MapAttributes";
import PolygonAttributes from "./PolygonAttributes";
import CodeAttributes from "./CodeAttributes";
import RandomTextAttributes from "./RandomTextAttributes";
import ManualStringAttributes from "./ManualStringAttributes";

const Attributes = ({control, watch, mainForm}) => {
  const fieldType = watch("type");

  if (!fieldType) return null;

  switch (fieldType) {
    case "SCAN_BARCODE":
      return <InventoryBarcodeAttributes control={control} />;

    case "SINGLE_LINE":
      return <SingleLineAttributes control={control} />;

    case "MULTISELECT":
    case "PICK_LIST":
      return <PickListAttributes control={control} />;

    case "MULTI_LINE":
      return <MultiLineAttributes control={control} />;

    case "DATE":
      return <DateAttributes control={control} />;

    case "NUMBER":
      return <NumberAttributes control={control} />;

    case "SWITCH":
    case "CHECKBOX":
      return <CheckboxAttributes control={control} />;

    case "FORMULA_FRONTEND":
      return (
        <FrontendFormulaAttributes control={control} mainForm={mainForm} />
      );

    case "FORMULA":
      return <FormulaAttributes control={control} mainForm={mainForm} />;

    case "INCREMENT_ID":
      return <IncrementIDAttributes control={control} />;

    case "INCREMENT_NUMBER":
      return <IncrementNumberAttributes control={control} />;

    case "CODABAR":
      return <CodabarIncrements control={control} />;

    case "MAP":
      return <MapAttributes control={control} />;

    case "POLYGON":
      return <PolygonAttributes control={control} />;

    case "CODE":
      return <CodeAttributes control={control} />;

    case "RANDOM_TEXT":
      return <RandomTextAttributes control={control} />;

    case "MANUAL_STRING":
      return <ManualStringAttributes control={control} mainForm={mainForm} />;

    default:
      return <SingleLineAttributes control={control} />;
  }
};

export default Attributes;
