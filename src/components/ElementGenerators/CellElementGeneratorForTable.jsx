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
import {Box} from "@mui/material";

import PhotoIcon from "@mui/icons-material/Photo";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import {makeStyles} from "@mui/styles";
import FunctionsIcon from "@mui/icons-material/Functions";
import DateRangeIcon from "@mui/icons-material/DateRange";
import SingleLine from "./SingleLine";
import Many2OneValue from "./Many2OneValue";

const useStyles = makeStyles(() => ({
  box: {
    padding: "0 10px",
  },
  formula_box: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 10px",
  },
}));

const CellElementGeneratorForTable = ({field = {}, row}) => {
  const classes = useStyles();

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
    if (field?.type === "DATE_TIME_WITHOUT_TIME_ZONE") {
      if (value?.includes("Z")) {
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
      } else return value;
    }
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

  const formula = field?.attributes?.formula ?? "";

  if (field.render) {
    return field.render(row);
  }

  switch (field.type) {
    case "LOOKUPS":
      return <Many2ManyValue field={field} value={value} />;

    case "LOOKUP":
      return <Many2OneValue field={field} value={row?.[field?.slug]} />;

    case "SINGLE_LINE":
      return <SingleLine field={field} value={value} row={row} />;

    case "DATE":
      return (
        <Box className={classes.formula_box}>
          <span className="text-nowrap">{formatDate(value)}</span>
          <DateRangeIcon />
        </Box>
      );

    case "NUMBER":
      return (
        <Box className={classes.box}>
          {value !== undefined && typeof value === "number"
            ? numberWithSpaces(value?.toFixed(1))
            : value === undefined
              ? value
              : 0}
        </Box>
      );

    case "DATE_TIME":
      return (
        <Box className={classes.formula_box}>
          <span className="text-nowrap">{formatDate(value, "DATE_TIME")}</span>
          <DateRangeIcon />
        </Box>
      );

    case "MULTISELECT":
      return (
        <Box className={classes.box}>
          <MultiselectCellColoredElement field={field} value={value} />
        </Box>
      );

    case "MULTI_LINE":
      return (
        <Box className={classes.box}>
          <div className=" text_overflow_line">
            <span
              dangerouslySetInnerHTML={{
                __html: `${value?.slice(0, 200)}${
                  value?.length > 200 ? "..." : ""
                }`,
              }}></span>
          </div>
        </Box>
      );

    case "DATE_TIME_WITHOUT_TIME_ZONE":
      return (
        <Box className={classes.formula_box}>
          {timeValue} <DateRangeIcon />
        </Box>
      );

    case "PASSWORD":
      return (
        <Box className={classes.box}>
          <div className="text-overflow">
            <span
              dangerouslySetInnerHTML={{
                __html: "*".repeat(value?.length),
              }}></span>
          </div>
        </Box>
      );

    case "CHECKBOX":
    case "SWITCH":
      return parseBoolean(value) ? (
        <Box className={classes.box}>
          <TableTag color="success">
            {field.attributes?.text_true ?? "Да"}
          </TableTag>
        </Box>
      ) : (
        <Box className={classes.box}>
          <TableTag color="error">
            {field.attributes?.text_false ?? "Нет"}
          </TableTag>
        </Box>
      );

    case "DYNAMIC":
      return <Box className={classes.box}>{computedInputString ?? ""}</Box>;

    case "FORMULA":
      return (
        <Box className={classes.formula_box}>
          <span>{value ? numberWithSpaces(value) : 0}</span>
          <FunctionsIcon />
        </Box>
      );

    case "FORMULA_FRONTEND":
      return (
        <Box className={classes.formula_box}>
          {formula && typeof value === "number"
            ? numberWithSpaces(value)
            : value}

          <FunctionsIcon />
        </Box>
      );

    case "ICON":
      return (
        <Box className={classes.box}>
          <IconGenerator color={"#007AFF"} icon={value} />
        </Box>
      );

    case "PHOTO":
      return (
        <Box className={classes.box}>
          {value ? (
            <span
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}>
              <LogoDisplay url={value} />
            </span>
          ) : (
            <span
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}>
              <PhotoIcon />
            </span>
          )}
        </Box>
      );

    case "MAP":
      return (
        <Box className={classes.box}>
          {value ? (
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
          )}
        </Box>
      );

    case "FILE":
      return value ? (
        <Box className={classes.box}>
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
        </Box>
      ) : (
        <Box className={classes.box}>
          <CloudUploadIcon />
        </Box>
      );

    default:
      if (typeof value === "object")
        return <Box className={classes.box}>{JSON.stringify(value)}</Box>;
      return <Box className={classes.box}>{value}</Box>;
  }
};

export default CellElementGeneratorForTable;
