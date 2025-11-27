import {
  AiFillFile,
  AiFillLock,
  AiOutlineBarcode,
  AiOutlineLine,
  AiTwotoneMail,
} from "react-icons/ai";
import { BiTimeFive } from "react-icons/bi";
import {
  BsFillCalendarFill,
  BsFillCameraVideoFill,
  BsImageFill,
  BsSortAlphaUpAlt,
  BsSortNumericUpAlt,
  BsTelephoneFill,
  BsToggleOn,
} from "react-icons/bs";
import { FaBusinessTime, FaGripLines, FaHashtag, FaList } from "react-icons/fa";
import { ImCheckboxChecked } from "react-icons/im";
import { TbIcons, TbMathSymbols, TbSquareRoot2 } from "react-icons/tb";

export const fieldTypes = [
  {
    icon: <BsSortNumericUpAlt />,
    label: "Increment ID",
    value: "INCREMENT_ID",
  },
  {
    icon: <BsSortAlphaUpAlt />,
    label: "Increment number",
    value: "INCREMENT_NUMBER",
  },
  {
    icon: <BsTelephoneFill />,
    label: "Phone",
    value: "PHONE",
  },
  {
    icon: <AiTwotoneMail />,
    label: "Email",
    value: "EMAIL",
  },
  {
    icon: <TbIcons />,
    label: "Icon",
    value: "ICON",
  },
  {
    icon: <AiFillLock />,
    label: "Password",
    value: "PASSWORD",
  },
  {
    icon: <AiOutlineBarcode />,
    label: "Barcode",
    value: "BARCODE",
  },
  {
    icon: <TbSquareRoot2 />,
    label: "Formula in frontend",
    value: "FORMULA_FRONTEND",
  },
  {
    icon: <TbMathSymbols />,
    label: "Formula in backend",
    value: "FORMULA",
  },
  {
    icon: <BsImageFill />,
    label: "Photo",
    value: "PHOTO",
  },
  {
    icon: <BsFillCameraVideoFill />,
    label: "Video",
    value: "VIDEO",
  },
  {
    icon: <AiFillFile />,
    label: "File",
    value: "FILE",
  },
  {
    icon: <FaList />,
    label: "Multi select",
    value: "MULTISELECT",
  },
  {
    icon: <ImCheckboxChecked />,
    label: "Checkbox",
    value: "CHECKBOX",
  },
  {
    icon: <BsToggleOn />,
    label: "Switch",
    value: "SWITCH",
  },
  {
    icon: <FaHashtag />,
    label: "Number",
    value: "NUMBER",
  },
  {
    icon: <BsFillCalendarFill />,
    label: "Date",
    value: "DATE",
  },
  {
    icon: <BiTimeFive />,
    label: "Time",
    value: "TIME",
  },
  {
    icon: <FaBusinessTime />,
    label: "Date time",
    value: "DATE_TIME",
  },
  {
    icon: <AiOutlineLine />,
    label: "Single line",
    value: "SINGLE_LINE",
  },
  {
    icon: <FaGripLines />,
    label: "Multi line",
    value: "MULTI_LINE",
  },
];
