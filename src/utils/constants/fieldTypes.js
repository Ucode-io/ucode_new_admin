export const fieldTypes = [
  "SINGLE_LINE",
  "MULTI_LINE",
  "PICK_LIST",
  "DATE",
  "TIME",
  "DATE_TIME",
  "NUMBER",
  "CHECKBOX",
  "EMAIL",
  "MULTISELECT",
  "MAP",
  "JSON",
  "PROGRAMMING_LANGUAGE",
  "SWITCH",
  "PHOTO",
  "PHONE",
  "INTERNATION_PHONE",
  "ICON",
  "PASSWORD",
  "FORMULA",
  "DENTIST",
  "COLOR",
  "FLOAT_NOLIMIT",
  "DATE_TIME_WITHOUT_TIME_ZONE",
  "PRIMARY_KEY",
  "QR",
  "POLYGON",
];

export const fieldTypesOptions = [
  {
    label: "Text",
    options: [
      {
        icon: "minus.svg",
        label: "Single line",
        value: "SINGLE_LINE",
      },
      {
        icon: "grip-lines.svg",
        label: "Multi line",
        value: "MULTI_LINE",
      },
    ],
  },
  {
    label: "Date",
    options: [
      {
        icon: "calendar.svg",
        label: "Date",
        value: "DATE",
      },
      {
        icon: "clock.svg",
        label: "Date time (without timezone)",
        value: "DATE_TIME_WITHOUT_TIME_ZONE",
      },
      {
        icon: "clock.svg",
        label: "Time",
        value: "TIME",
      },
      {
        icon: "business-time.svg",
        label: "Date time",
        value: "DATE_TIME",
      },
    ],
  },
  {
    label: "Number",
    options: [
      {
        icon: "hashtag.svg",
        label: "Number",
        value: "NUMBER",
      },
      {
        icon: "hashtag.svg",
        label: "Float",
        value: "FLOAT",
      },
    ],
  },
  {
    label: "Input",
    options: [
      {
        icon: "square-check.svg",
        label: "Checkbox",
        value: "CHECKBOX",
      },
      {
        icon: "toggle-on.svg",
        label: "Switch",
        value: "SWITCH",
      },
    ],
  },
  {
    label: "Select",
    options: [
      // {
      //   label: "Picklist",
      //   value: "PICK_LIST"
      // },
      {
        icon: "list-check.svg",
        label: "Multi select",
        value: "MULTISELECT",
      },
      // {
      //   icon: "list-check.svg",
      //   label: "Multi select V2",
      //   value: "MULTISELECT_V2",
      // },
    ],
  },
  {
    label: "Map",
    options: [
      {
        icon: "map-pin.svg",
        label: "Map",
        value: "MAP",
      },
    ],
  },
  {
    label: "Code",
    options: [
      {
        icon: "map-pin.svg",
        label: "Code",
        value: "CODE",
      },
    ],
  },

  {
    label: "File",
    options: [
      {
        icon: "image.svg",
        label: "Photo",
        value: "PHOTO",
      },
      {
        icon: "image.svg",
        label: "Multi Image",
        value: "MULTI_IMAGE",
      },
      {
        icon: "video.svg",
        label: "Video",
        value: "VIDEO",
      },
      {
        icon: "file.svg",
        label: "File",
        value: "FILE",
      },
    ],
  },
  {
    label: "Formula",
    options: [
      {
        icon: "square-root-variable.svg",
        label: "Formula in frontend",
        value: "FORMULA_FRONTEND",
      },
      {
        icon: "plus-minus.svg",
        label: "Formula in backend",
        value: "FORMULA",
      },
    ],
  },
  {
    label: "Primary Key",
    options: [
      {
        icon: "ellipsis.svg",
        label: "Generated string",
        value: "RANDOM_TEXT",
      },
      {
        icon: "regular_id-badge.svg",
        label: "UUID",
        value: "RANDOM_UUID",
      },
      {
        icon: "pen.svg",
        label: "Manual string",
        value: "MANUAL_STRING",
      },
      {
        icon: "arrow-up-a-z.svg",
        label: "Increment number",
        value: "INCREMENT_NUMBER",
      },
    ],
  },
  {
    label: "Other",
    options: [
      // {
      //   icon: "arrow-up-9-1.svg",
      //   label: "FLOAT_NOLIMIT",
      //   value: "FLOAT_NOLIMIT",
      // },
      {
        icon: "arrow-up-9-1.svg",
        label: "Increment ID",
        value: "INCREMENT_ID",
      },
      {
        icon: "code.svg",
        label: "Programming language",
        value: "PROGRAMMING_LANGUAGE",
      },
      {
        icon: "file-lines.svg",
        label: "JSON",
        value: "JSON",
      },
      {
        icon: "draw-polygon.svg",
        label: "Polygon",
        value: "POLYGON",
      },
      {
        icon: "qrcode.svg",
        label: "Qr",
        value: "QR",
      },

      // {
      //   icon: "phone.svg",
      //   label: "Phone",
      //   value: "PHONE",
      // },
      {
        icon: "phone.svg",
        label: "Internation Phone",
        value: "INTERNATION_PHONE",
      },
      {
        icon: "envelope.svg",
        label: "Email",
        value: "EMAIL",
      },
      {
        icon: "icons.svg",
        label: "Icon",
        value: "ICON",
      },
      {
        icon: "lock.svg",
        label: "Password",
        value: "PASSWORD",
      },
      {
        icon: "barcode.svg",
        label: "Barcode",
        value: "BARCODE",
      },
      // {
      //   icon: "barcode.svg",
      //   label: "Codabar",
      //   value: "CODABAR",
      // },
      // {
      //   icon: "fill.svg",
      //   label: "Autofill",
      //   value: "AUTOFILL",
      // },
      // {
      //   icon: "barcode.svg",
      //   label: "Scan-barcode",
      //   value: "SCAN_BARCODE",
      // },
      // {
      //   icon: "teeth.svg",
      //   label: "Dentist",
      //   value: "DENTIST",
      // },
      {
        icon: "colon-sign.svg",
        label: "Color",
        value: "COLOR",
      },
    ],
  },
];
export const numberFieldFormats = [
  {
    label: "Number",
    value: "NUMBER",
    icon: "minus.svg",
  },
  {
    label: "Float",
    value: "FLOAT",
    icon: "minus.svg",
  },
];

export const barcodeFieldFormats = [
  {
    label: "QR",
    value: "QR",
    icon: "minus.svg",
  },
  {
    label: "Barcode",
    value: "BARCODE",
    icon: "minus.svg",
  },
];
export const textFieldFormats = [
  {
    label: "Text",
    value: "SINGLE_LINE",
    icon: "minus.svg",
  },
  {
    label: "Text Area",
    value: "MULTI_LINE",
    icon: "minus.svg",
  },
];

export const incrementFieldFormats = [
  {
    label: "Increment ID",
    value: "INCREMENT_ID",
    icon: "minus.svg",
  },
  // {
  //   label: "Increment Number",
  //   value: "INCREMENT_NUMBER",
  //   icon: "minus.svg",
  // },
];

export const PrimaryKeyFieldFormats = [
  {
    icon: "ellipsis.svg",
    label: "Generated string",
    value: "RANDOM_TEXT",
  },
  {
    icon: "regular_id-badge.svg",
    label: "UUID",
    value: "RANDOM_UUID",
  },
  {
    icon: "pen.svg",
    label: "Manual string",
    value: "MANUAL_STRING",
  },
  {
    icon: "arrow-up-a-z.svg",
    label: "Increment number",
    value: "INCREMENT_NUMBER",
  },

  // {
  //   label: "Increment Number",
  //   value: "INCREMENT_NUMBER",
  //   icon: "minus.svg",
  // },
];

export const codeFieldFormats = [
  {
    label: "JSON",
    value: "JSON",
    icon: "minus.svg",
  },
  {
    label: "Programming Language",
    value: "PROGRAMMING_LANGUAGE",
    icon: "computer.svg",
  },
];
export const mapFieldFormats = [
  {
    label: "Map",
    value: "MAP",
    icon: "map-pin.svg",
  },
  {
    label: "Polygon",
    value: "POLYGON",
    icon: "draw-polygon.svg",
  },
];
export const dateFieldFormats = [
  {
    label: "Date",
    value: "DATE",
    icon: "minus.svg",
  },
  {
    label: "Date time (without timezone)",
    value: "DATE_TIME_WITHOUT_TIME_ZONE",
    icon: "minus.svg",
  },
  {
    label: "Time",
    value: "TIME",
    icon: "minus.svg",
  },
  {
    label: "Date time",
    value: "DATE_TIME",
    icon: "minus.svg",
  },
];
export const fileFieldFormats = [
  {
    icon: "image.svg",
    label: "Photo",
    value: "PHOTO",
  },
  {
    icon: "image.svg",
    label: "Multiple photo",
    value: "MULTI_IMAGE",
  },
  {
    icon: "video.svg",
    label: "Video",
    value: "VIDEO",
  },
  {
    icon: "file.svg",
    label: "File",
    value: "FILE",
  },
];

export const newFieldTypes = [
  {
    label: "Text",
    value: "SINGLE_LINE",
    icon: "minus.svg",
  },
  {
    label: "Number",
    value: "NUMBER",
    icon: "hashtag.svg",
  },
  {
    label: "Date",
    value: "DATE",
    icon: "calendar.svg",
  },
  {
    label: "Dropdown",
    value: "MULTISELECT",
    icon: "square-caret-down.svg",
  },
  {
    label: "Checkbox",
    value: "CHECKBOX",
    icon: "square-check.svg",
  },
  {
    label: "Switch",
    value: "SWITCH",
    icon: "toggle-on.svg",
  },
  {
    label: "Formula",
    value: "FORMULA_FRONTEND",
    icon: "plus-minus.svg",
  },
  {
    label: "Relation",
    value: "RELATION",
    icon: "link-simple.svg",
  },
  {
    label: "File",
    value: "FILE",
    icon: "file.svg",
  },
  {
    label: "Map",
    value: "MAP",
    icon: "map-pin.svg",
  },
  {
    label: "Primary key",
    value: "PRIMARY_KEY",
    icon: "map-pin.svg",
  },
  {
    label: "Code",
    value: "CODE",
    icon: "map-pin.svg",
  },
  {
    label: "Phone",
    value: "PHONE",
    icon: "phone.svg",
  },
  {
    label: "Email",
    value: "EMAIL",
    icon: "envelope.svg",
  },
  {
    label: "Increment",
    value: "INCREMENT",
    icon: "envelope.svg",
  },
  {
    label: "Password",
    value: "PASSWORD",
    icon: "lock.svg",
  },
  {
    label: "Color",
    value: "COLOR",
    icon: "colon-sign.svg",
  },
  {
    label: "Barcode",
    value: "BARCODE",
    icon: "barcode.svg",
  },
];

export const fieldFormats = [
  {
    label: "Text",
    value: "SINGLE_LINE",
    icon: "minus.svg",
  },
  {
    label: "Number",
    value: "NUMBER",
    icon: "hashtag.svg",
  },
  {
    label: "Date",
    value: "DATE",
    icon: "calendar.svg",
  },
  {
    label: "Dropdown",
    value: "MULTISELECT",
    icon: "square-caret-down.svg",
  },
  {
    label: "Checkbox",
    value: "CHECKBOX",
    icon: "square-check.svg",
  },
  {
    label: "Switch",
    value: "SWITCH",
    icon: "toggle-on.svg",
  },
  {
    label: "Formula",
    value: "FORMULA_FRONTEND",
    icon: "plus-minus.svg",
  },
  {
    label: "Relation",
    value: "RELATION",
    icon: "link-simple.svg",
  },
  {
    label: "File",
    value: "FILE",
    icon: "file.svg",
  },
  {
    label: "Map",
    value: "MAP",
    icon: "map-pin.svg",
  },
  {
    label: "Phone",
    value: "PHONE",
    icon: "phone.svg",
  },
  {
    label: "Email",
    value: "EMAIL",
    icon: "envelope.svg",
  },
  {
    label: "Password",
    value: "PASSWORD",
    icon: "lock.svg",
  },
  {
    label: "Color",
    value: "COLOR",
    icon: "colon-sign.svg",
  },
  {
    label: "File",
    value: "BARCODE",
    icon: "barcode.svg",
  },
  {
    icon: "image.svg",
    label: "File",
    value: "PHOTO",
  },
  {
    icon: "video.svg",
    label: "File",
    value: "VIDEO",
  },
  {
    icon: "file.svg",
    label: "File",
    value: "FILE",
  },
  {
    label: "Date",
    value: "DATE",
    icon: "minus.svg",
  },
  {
    label: "Date",
    value: "DATE_TIME_WITHOUT_TIME_ZONE",
    icon: "minus.svg",
  },
  {
    label: "Date",
    value: "TIME",
    icon: "minus.svg",
  },
  {
    label: "Date",
    value: "DATE_TIME",
    icon: "minus.svg",
  },
  {
    label: "Text",
    value: "MULTI_LINE",
    icon: "minus.svg",
  },
  {
    label: "Number",
    value: "FLOAT",
    icon: "minus.svg",
  },
  {
    label: "Relation",
    value: "LOOKUP",
    icon: "minus.svg",
  },
];

export const math = [
  {
    label: "plus",
    value: "+",
  },
  {
    label: "minus",
    value: "-",
  },
  {
    label: "multiplication",
    value: "*",
  },
  {
    label: "division",
    value: "/",
  },
];

export const relationFieldButtons = [
  {
    label: "Schema",
    value: "SCHEMA",
  },

  {
    label: "Additional",
    value: "AUTOFILL",
  },
  {
    label: "Auto filter",
    value: "AUTO_FILTER",
  },
];

export const fieldButtons = [
  {
    label: "Schema",
    value: "SCHEMA",
  },
  {
    label: "Validation",
    value: "VALIDATION",
  },
  {
    label: "Autofill",
    value: "AUTOFILL",
  },
  {
    label: "Auto filter",
    value: "AUTO_FILTER",
  },

  {
    label: "Field Hide",
    value: "FIELD_HIDE",
  },
];

export const formatIncludes = [
  "NUMBER",
  "DATE",
  "SINGLE_LINE",
  "FILE",
  "FLOAT",
  "DATE_TIME",
  "DATE_TIME_WITHOUT_TIME_ZONE",
  "TIME",
  "BARCODE",
  "PHOTO",
  "MULTI_IMAGE",
  "VIDEO",
  "MULTI_LINE",
  "INCREMENT",
  "CODE",
  "MAP",
  "POLYGON",
  "CODE",
  "JSON",
  "RANDOM_TEXT",
  "PRIMARY_KEY",
];

export const FormatOptionType = (item) => {
  switch (item) {
    case "DATE":
      return dateFieldFormats;
    case "DATE_TIME":
      return dateFieldFormats;
    case "DATE_TIME_WITHOUT_TIME_ZONE":
      return dateFieldFormats;
    case "TIME":
      return dateFieldFormats;
    case "FILE":
      return fileFieldFormats;
    case "PHOTO":
      return fileFieldFormats;
    case "VIDEO":
      return fileFieldFormats;
    case "SINGLE_LINE":
      return textFieldFormats;
    case "INCREMENT":
      return incrementFieldFormats;
    case "CODE":
      return codeFieldFormats;
    case "MAP":
      return mapFieldFormats;
    case "MULTI_LINE":
      return textFieldFormats;
    case "NUMBER":
      return numberFieldFormats;
    case "FLOAT":
      return numberFieldFormats;
    case "BARCODE":
      return barcodeFieldFormats;
    case "PRIMARY_KEY":
      return PrimaryKeyFieldFormats;
    default:
      return textFieldFormats;
  }
};
export const FormatTypes = (format) => {
  switch (format) {
    case "RELATION":
      return true;
    case "LOOKUP":
      return true;
    case "LOOKUPS":
      return true;
    default:
      return false;
  }
};
export const ValueTypes = (value) => {
  switch (value) {
    case "Many2One":
      return true;
    case "Many2Many":
      return true;
    case "Recursive":
      return true;
    default:
      return false;
  }
};
