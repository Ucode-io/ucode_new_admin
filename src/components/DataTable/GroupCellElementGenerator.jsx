import {get} from "@ngard/tiny-get";
import {useMemo} from "react";
import DownloadIcon from "@mui/icons-material/Download";
import {getRelationFieldTableCellLabel} from "../../utils/getRelationFieldLabel";
import Many2ManyValue from "../ElementGenerators/Many2ManyValue";
import {formatDate} from "../../utils/dateFormatter";
import {numberWithSpaces} from "../../utils/formatNumbers";
import MultiselectCellColoredElement from "../ElementGenerators/MultiselectCellColoredElement";
import TableTag from "../TableTag";
import {parseBoolean} from "../../utils/parseBoolean";
import LogoDisplay from "../LogoDisplay";
import {generateLink} from "../../utils/generateYandexLink";
import IconGenerator from "../IconPicker/IconGenerator";

const GroupCellElementGenerator = ({field = {}, row, view, index}) => {
  const value = useMemo(() => {
    if (field.type !== "LOOKUPS") return get(row, field.slug, "");

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
  const foundSlugs = [];
  field?.view_fields?.forEach((item) => {
    const slugValue = row?.[`${field.slug}_data`]?.[index]?.[item?.slug];
    if (slugValue !== undefined) {
      foundSlugs.push(slugValue);
    }
  });

  const resultString = useMemo(() => {
    const foundSlugs = [];
    field?.view_fields?.forEach((item) => {
      const slugValue = row?.[`${field.slug}_data`]?.[index]?.[item?.slug];
      if (slugValue !== undefined) {
        foundSlugs.push(slugValue);
      }
    });
    return foundSlugs.join(",");
  }, [field, row, index]);

  if (field.render) {
    return field.render(row);
  }

  // const renderComponentValues = {
  //   LOOKUPS: () => <Many2ManyValue field={field} value={value} />,
  //   LOOKUP: () =>
  //     ((row?.group_by_slug ||
  //       !view?.attributes?.group_by_columns?.find(
  //         (item) => item === field?.relation_id
  //       )) &&
  //       resultString) ||
  //     getRelationFieldTableCellLabel(field, row, field.slug + "_data"),
  //   DATE: () => <span className="text-nowrap">{formatDate(value)}</span>,
  //   NUMBER: () =>
  //     value !== undefined && typeof value === "number"
  //       ? numberWithSpaces(value?.toFixed(1))
  //       : value === undefined
  //         ? value
  //         : "",
  //   DATE_TIME: () => (
  //     <span className="text-nowrap">{formatDate(value, "DATE_TIME")}</span>
  //   ),
  //   MULTISELECT: () => (
  //     <MultiselectCellColoredElement field={field} value={value} />
  //   ),
  //   MULTI_LINE: () => (
  //     <div className=" text_overflow_line">
  //       <span
  //         dangerouslySetInnerHTML={{
  //           __html: `${value.slice(0, 200)}${value.length > 200 ? "..." : ""}`,
  //         }}></span>
  //     </div>
  //   ),
  //   DATE_TIME_WITHOUT_TIME_ZONE: () => timeValue,
  //   PASSWORD: () => (
  //     <div className="text-overflow">
  //       <span
  //         dangerouslySetInnerHTML={{
  //           __html: "*".repeat(value?.length),
  //         }}></span>
  //     </div>
  //   ),
  //   CHECKBOX: () =>
  //     parseBoolean(value) ? (
  //       <TableTag color="success">
  //         {field.attributes?.text_true ?? "Да"}
  //       </TableTag>
  //     ) : (
  //       <TableTag color="error">
  //         {field.attributes?.text_false ?? "Нет"}
  //       </TableTag>
  //     ),
  //   SWITCH: () =>
  //     parseBoolean(value) ? (
  //       <TableTag color="success">
  //         {field.attributes?.text_true ?? "Да"}
  //       </TableTag>
  //     ) : (
  //       <TableTag color="error">
  //         {field.attributes?.text_false ?? "Нет"}
  //       </TableTag>
  //     ),
  //   DYNAMIC: () => computedInputString ?? "",
  //   FORMULA: () => (value ? numberWithSpaces(value) : 0),
  //   FORMULA_FRONTEND: () =>
  //     value !== undefined && typeof value === "number"
  //       ? numberWithSpaces(value?.toFixed(1))
  //       : value === undefined
  //         ? value
  //         : "",

  //   ICON: () => <IconGenerator icon={value} />,
  //   PHOTO: () => (
  //     <span
  //       style={{
  //         display: "flex",
  //         alignItems: "center",
  //         justifyContent: "center",
  //       }}>
  //       <LogoDisplay url={value} />
  //     </span>
  //   ),
  //   MAP: () =>
  //     value ? (
  //       <a
  //         target="_blank"
  //         href={`${generateLink(
  //           value?.split(",")?.[0],
  //           value?.split(",")?.[1]
  //         )}`}
  //         rel="noreferrer"
  //         onClick={(e) => e.stopPropagation()}>
  //         {generateLink(value?.split(",")?.[0], value?.split(",")?.[1])}
  //       </a>
  //     ) : (
  //       ""
  //     ),
  //   FILE: () =>
  //     value ? (
  //       <a
  //         href={value}
  //         className=""
  //         download
  //         target="_blank"
  //         onClick={(e) => e.stopPropagation()}
  //         rel="noreferrer">
  //         <DownloadIcon
  //           style={{width: "25px", height: "25px", fontSize: "30px"}}
  //         />
  //       </a>
  //     ) : (
  //       ""
  //     ),
  // };

  // return renderComponentValues[field?.type] ? (
  //   renderComponentValues[field?.type]
  // ) : (
  //   typeof value === 'object' ? JSON.stringify(value) :
  // )

  switch (field.type) {
    case "LOOKUPS":
      return <Many2ManyValue field={field} value={value} />;

    case "LOOKUP":
      return (
        ((row?.group_by_slug ||
          !view?.attributes?.group_by_columns?.find(
            (item) => item === field?.relation_id
          )) &&
          resultString) ||
        getRelationFieldTableCellLabel(field, row, field.slug + "_data")
      );

    case "DATE":
      return <span className="text-nowrap">{formatDate(value)}</span>;

    case "NUMBER":
      return value !== undefined && typeof value === "number"
        ? numberWithSpaces(value?.toFixed(1))
        : value === undefined
          ? value
          : "";

    case "DATE_TIME":
      return (
        <span className="text-nowrap">{formatDate(value, "DATE_TIME")}</span>
      );

    case "MULTISELECT":
      return <MultiselectCellColoredElement field={field} value={value} />;

    case "MULTI_LINE":
      return (
        <div className=" text_overflow_line">
          <span
            dangerouslySetInnerHTML={{
              __html: `${value.slice(0, 200)}${
                value.length > 200 ? "..." : ""
              }`,
            }}></span>
        </div>
      );

    case "DATE_TIME_WITHOUT_TIME_ZONE":
      return timeValue;

    case "PASSWORD":
      return (
        <div className="text-overflow">
          <span
            dangerouslySetInnerHTML={{
              __html: "*".repeat(value?.length),
            }}></span>
        </div>
      );

    case "CHECKBOX":
    case "SWITCH":
      return parseBoolean(value) ? (
        <TableTag color="success">
          {field.attributes?.text_true ?? "Да"}
        </TableTag>
      ) : (
        <TableTag color="error">
          {field.attributes?.text_false ?? "Нет"}
        </TableTag>
      );

    case "DYNAMIC":
      return computedInputString ?? "";

    case "FORMULA":
      return value ? numberWithSpaces(value) : 0;

    case "FORMULA_FRONTEND":
      return value !== undefined && typeof value === "number"
        ? numberWithSpaces(value?.toFixed(1))
        : value === undefined
          ? value
          : "";

    case "ICON":
      return <IconGenerator icon={value} />;

    case "PHOTO":
      return (
        <span
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
          <LogoDisplay url={value} />
        </span>
      );

    case "MAP":
      return value ? (
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
      );

    case "FILE":
      return value ? (
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
      ) : (
        ""
      );

    default:
      if (typeof value === "object") return JSON.stringify(value);
      return value;
  }
};

export default GroupCellElementGenerator;
