import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AppsIcon from "@mui/icons-material/Apps";
import ArrowDropDownCircleIcon from "@mui/icons-material/ArrowDropDownCircle";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import ChecklistIcon from "@mui/icons-material/Checklist";
import ColorizeIcon from "@mui/icons-material/Colorize";
import DateRangeIcon from "@mui/icons-material/DateRange";
import EmailIcon from "@mui/icons-material/Email";
import FormatAlignJustifyIcon from "@mui/icons-material/FormatAlignJustify";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import InsertInvitationIcon from "@mui/icons-material/InsertInvitation";
import LinkIcon from "@mui/icons-material/Link";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import LooksOneIcon from "@mui/icons-material/LooksOne";
import MapIcon from "@mui/icons-material/Map";
import PasswordIcon from "@mui/icons-material/Password";
import PhotoSizeSelectActualIcon from "@mui/icons-material/PhotoSizeSelectActual";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import QrCode2Icon from "@mui/icons-material/QrCode2";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import TextFieldsIcon from "@mui/icons-material/TextFields";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import CalculateIcon from "@mui/icons-material/Calculate";
import NumbersIcon from "@mui/icons-material/Numbers";
import NotesIcon from "@mui/icons-material/Notes";
import Filter9PlusIcon from "@mui/icons-material/Filter9Plus";
import FmdGoodIcon from "@mui/icons-material/FmdGood";
import CodeIcon from "@mui/icons-material/Code";
import TerminalIcon from "@mui/icons-material/Terminal";
import QrCodeIcon from "@mui/icons-material/QrCode";
import Grid3x3Icon from "@mui/icons-material/Grid3x3";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import ContactPageIcon from "@mui/icons-material/ContactPage";
import CreateIcon from "@mui/icons-material/Create";
import TextIncreaseIcon from "@mui/icons-material/TextIncrease";

export const columnIcons = (type) => {
  switch (type) {
    case "SINGLE_LINE":
      return <TextFieldsIcon />;
    case "MULTI_LINE":
      return <NotesIcon />;
    case "NUMBER":
      return <NumbersIcon />;
    case "MULTISELECT":
      return <ArrowDropDownCircleIcon />;
    case "PHOTO":
      return <PhotoSizeSelectActualIcon />;
    case "VIDEO":
      return <PlayCircleIcon />;
    case "FILE":
      return <InsertDriveFileIcon />;
    case "FORMULA":
      return <CalculateIcon />;
    case "FORMULA_FRONTEND":
      return <CalculateIcon />;
    case "PHONE":
      return <LocalPhoneIcon />;
    case "INTERNATION_PHONE":
      return <LocalPhoneIcon />;
    case "EMAIL":
      return <EmailIcon />;
    case "ICON":
      return <AppsIcon />;
    case "BARCODE":
      return <QrCodeScannerIcon />;
    case "QRCODE":
      return <QrCode2Icon />;
    case "COLOR":
      return <ColorizeIcon />;
    case "PASSWORD":
      return <PasswordIcon />;
    case "PICK_LIST":
      return <ChecklistIcon />;
    case "DATE":
      return <DateRangeIcon />;
    case "TIME":
      return <AccessTimeIcon />;
    case "DATE_TIME":
      return <InsertInvitationIcon />;
    case "CHECKBOX":
      return <CheckBoxIcon />;
    case "MAP":
      return <MapIcon />;
    case "SWITCH":
      return <ToggleOffIcon />;
    case "FLOAT_NOLIMIT":
      return <LooksOneIcon />;
    case "DATE_TIME_WITHOUT_TIME_ZONE":
      return <InsertInvitationIcon />;
    case "DROPDOWN":
      return <ArrowDropDownCircleIcon />;
    case "FLOAT":
      return <Filter9PlusIcon />;
    case "POLYGON":
      return <FmdGoodIcon />;
    case "JSON":
      return <CodeIcon />;
    case "PROGRAMMING_LANGUAGE":
      return <TerminalIcon />;
    case "CODE":
      return <CodeIcon />;
    case "QR":
      return <QrCodeIcon />;
    case "PRIMARY_KEY":
      return <Grid3x3Icon />;
    case "RANDOM_TEXT":
      return <MoreHorizIcon />;
    case "RANDOM_UUID":
      return <ContactPageIcon />;
    case "MANUAL_STRING":
      return <CreateIcon />;
    case "INCREMENT_NUMBER":
      return <TextIncreaseIcon />;
    default:
      return <LinkIcon />;
  }
};
