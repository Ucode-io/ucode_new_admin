import {
  TfiLayoutGrid2Alt,
  TfiLayoutGrid3Alt,
  TfiLayoutGrid4,
  TfiLayoutGrid4Alt,
} from "react-icons/tfi";

const FileTypes = ({ item }) => {
  switch (item) {
    case "PNG":
      return "PNG";
    case "JPG":
      return "JPG";
    case "JPEG":
      return "JPEG";
    case "PDF":
      return "PDF";
    case "TXT":
      return "TXT";
    case "SVG":
      return "SVG";
    case "XLSX":
      return "XLSX";
    case "DOCS":
      return "DOCS";
    case "XLS":
      return "XLS";
    case "CVC":
      return "CVC";
    case "MP4":
      return "MP4";
    case "MP3":
      return "MP3";
    case "TEXT":
      return "TEXT";
    case "PKG":
      return "PKG";
    case "TORRENT":
      return "TORRENT";
    default:
      return "DOC";
  }
};

export const SizeType = ({ item }) => {
  switch (true) {
    case item?.includes("small"):
      return <TfiLayoutGrid4 />;
    case item?.includes("middle"):
      return <TfiLayoutGrid4Alt />;
    case item?.includes("biggest"):
      return <TfiLayoutGrid2Alt />;
    case item?.includes("big"):
      return <TfiLayoutGrid3Alt />;
    default:
      return <TfiLayoutGrid4 />;
  }
};
export const onSizeChange = (item, setSize, style) => {
  switch (true) {
    case item?.includes("small"):
      return setSize(style.miniocontainermiddle);
    case item?.includes("middle"):
      return setSize(style.miniocontainerbig);
    case item?.includes("biggest"):
      return setSize(style.miniocontainersmall);
    case item?.includes("big"):
      return setSize(style.miniocontainerbiggest);
    default:
      return <TfiLayoutGrid4 />;
  }
};

export default FileTypes;
