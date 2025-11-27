import SingleLineAttributes from "./SingleLineAttributes";

const AttributesButton = ({control, watch, mainForm, button}) => {
  const fieldType = watch("type");

  if (!fieldType) return null;

  switch (fieldType) {
    case "SCAN_BARCODE":
      return button;

    case "MULTISELECT":
    case "PICK_LIST":
      return button;

    case "FORMULA_FRONTEND":
      return button;

    case "FORMULA":
      return button;

    case "INCREMENT_ID":
      return button;

    case "INCREMENT_NUMBER":
      return button;

    case "CODABAR":
      return button;

    case "MAP":
      return button;

    case "POLYGON":
      return button;

    case "CODE":
      return button;

    case "RANDOM_TEXT":
      return button;

    case "MANUAL_STRING":
      return button;

    default:
      return <SingleLineAttributes control={control} />;
  }
};

export default AttributesButton;
