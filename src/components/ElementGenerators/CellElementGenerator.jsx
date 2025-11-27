import AttachFileIcon from "@mui/icons-material/AttachFile";
import BackupTableIcon from "@mui/icons-material/BackupTable";
import DescriptionIcon from "@mui/icons-material/Description";
import DownloadIcon from "@mui/icons-material/Download";
import PhotoLibraryIcon from "@mui/icons-material/PhotoLibrary";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import {get} from "@ngard/tiny-get";
import {useMemo} from "react";
import {formatDate} from "../../utils/dateFormatter";
import {numberWithSpaces} from "../../utils/formatNumbers";
import {generateLink} from "../../utils/generateYandexLink";
import {getRelationFieldTableCellLabel} from "../../utils/getRelationFieldLabel";
import {parseBoolean} from "../../utils/parseBoolean";
import IconGenerator from "../IconPicker/IconGenerator";
import LogoDisplay from "../LogoDisplay";
import TableTag from "../TableTag";
import Many2ManyValue from "./Many2ManyValue";
import MultiselectCellColoredElement from "./MultiselectCellColoredElement";

const CellElementGenerator = ({field = {}, row}) => {
  const value = useMemo(() => {
    if (field.type !== "LOOKUP") return get(row, field.slug, "");

    const result = getRelationFieldTableCellLabel(
      field,
      row,
      field.slug + "_data"
    );

    return result;
  }, [row, field]);

  const timeValue = useMemo(() => {
    if (typeof value === "object") return JSON.stringify(value);

    let dateObj = new Date(value);

    let formattedDate = dateObj.toLocaleString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
      timeZone: "UTC",
    });

    return formattedDate;
  }, [field, value]);

  const tablesList = useMemo(() => {
    return (
      field.attributes?.dynamic_tables?.map((el) => {
        return el.table ? {...el.table, ...el} : el;
      }) ?? []
    );
  }, [field.attributes?.dynamic_tables]);

  const getValue = useMemo(() => {
    let val = tablesList?.find((table) => value?.[`${table.slug}_id`]) ?? "";
    if (!val) return "";
    return value?.[`${val?.slug}_id_data`];
  }, [value, tablesList]);

  const computedInputString = useMemo(() => {
    let val = "";
    let getVal = tablesList
      ? tablesList?.find((table) => value?.[`${table.slug}_id`])
      : [];
    let viewFields = getVal?.view_fields;

    viewFields &&
      viewFields?.map((item) => {
        val += `${getValue ? getValue?.[item?.slug] + " " : ""}`;
      });

    return val;
  }, [getValue, tablesList, value]);

  const getFileName = (item) => {
    const itemArray = item?.split("/");
    const computedName = itemArray?.[itemArray?.length - 1].split("_");
    return computedName.slice(1).join("");
  };

  const computedFileExtension = (element) => {
    const getExten = element?.split(".");
    return getExten?.[getExten?.length - 1];
  };

  if (field.render) {
    return field.render(row);
  }

  const renderInputValues = {
    LOOKUPS: () => <Many2ManyValue field={field} value={value} />,
    DATE: () => <span className="text-nowrap">{formatDate(value)}</span>,
    NUMBER: () =>
      value !== undefined && typeof value === "number"
        ? numberWithSpaces(value?.toFixed(1))
        : value === undefined
          ? value
          : "",
    DATE_TIME: () => (
      <span className="text-nowrap">{formatDate(value, "DATE_TIME")}</span>
    ),
    MULTISELECT: () => (
      <MultiselectCellColoredElement field={field} value={value} />
    ),
    MULTI_LINE: () => (
      <div className=" text_overflow_line">
        <span
          dangerouslySetInnerHTML={{
            __html: `${value.slice(0, 200)}${value.length > 200 ? "..." : ""}`,
          }}></span>
      </div>
    ),
    DATE_TIME_WITHOUT_TIME_ZONE: () => timeValue,
    PASSWORD: () => (
      <div className="text-overflow">
        <span
          dangerouslySetInnerHTML={{
            __html: "*".repeat(value?.length),
          }}></span>
      </div>
    ),
    CHECKBOX: () =>
      parseBoolean(value) ? (
        <TableTag color="success">
          {field.attributes?.text_true ?? "Да"}
        </TableTag>
      ) : (
        <TableTag color="error">
          {field.attributes?.text_false ?? "Нет"}
        </TableTag>
      ),
    SWITCH: () =>
      parseBoolean(value) ? (
        <TableTag color="success">
          {field.attributes?.text_true ?? "Да"}
        </TableTag>
      ) : (
        <TableTag color="error">
          {field.attributes?.text_false ?? "Нет"}
        </TableTag>
      ),
    DYNAMIC: () => computedInputString ?? "",
    FORMULA: () => (value ? numberWithSpaces(value) : 0),
    FORMULA_FRONTEND: () =>
      value !== undefined && typeof value === "number"
        ? numberWithSpaces(value?.toFixed(1))
        : value === undefined
          ? value
          : "",
    ICO: () => <IconGenerator icon={value} />,
    PHOTO: () => (
      <span
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}>
        <LogoDisplay url={value} />
      </span>
    ),
    MAP: () =>
      value ? (
        <a
          target="_blank"
          href={`${generateLink(
            value?.split(",")?.[0],
            value?.split(",")?.[1]
          )}`}
          rel="noreferrer"
          onClick={(e) => e.stopPropagation()}>
          {generateLink(value?.split(",")?.[0], value?.split(",")?.[1])}
        </a>
      ) : (
        ""
      ),
    FILE: () =>
      value ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}>
            <span
              style={{
                marginRight: "10px",
              }}>
              {computedFileExtension(getFileName(value)) === "pdf" ? (
                <PictureAsPdfIcon style={{color: "red"}} />
              ) : computedFileExtension(getFileName(value)) === "xlsx" ? (
                <BackupTableIcon style={{color: "green"}} />
              ) : computedFileExtension(getFileName(value)) === "png" ||
                computedFileExtension(getFileName(value)) === "jpeg" ||
                computedFileExtension(getFileName(value)) === "jpg" ? (
                <PhotoLibraryIcon style={{color: "green"}} />
              ) : computedFileExtension(getFileName(value)) === "txt" ||
                computedFileExtension(getFileName(value)) === "docx" ? (
                <DescriptionIcon style={{color: "#007AFF"}} />
              ) : (
                <AttachFileIcon style={{color: "blue"}} />
              )}
            </span>
            {getFileName(value)}
          </div>
          <div>
            <a
              href={value}
              className=""
              download
              target="_blank"
              onClick={(e) => e.stopPropagation()}
              rel="noreferrer">
              <DownloadIcon
                style={{width: "25px", height: "25px", fontSize: "30px"}}
              />
            </a>
          </div>
        </div>
      ) : (
        ""
      ),
  };

  return renderInputValues[field?.type] ? (
    renderInputValues[field?.type]()
  ) : (
    <div>{typeof value === "object" ? JSON.stringify(value) : value}</div>
  );
};

export default CellElementGenerator;
