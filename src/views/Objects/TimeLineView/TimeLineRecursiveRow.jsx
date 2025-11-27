import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import {Collapse, alpha} from "@mui/material";
import {get} from "@ngard/tiny-get";
import React, {useEffect, useMemo, useState} from "react";
import constructorObjectService from "../../../services/constructorObjectService";
import styles from "./styles.module.scss";
import {useQuery} from "react-query";

export default function TimeLineRecursiveRow({
  groupItem: item,
  fieldsMap,
  view,
  groupbyFields,
  level,
  selectedType,
  computedColumnsFor,
  setFocusedDays,
  datesList,
  zoomPosition,
  calendar_from_slug,
  calendar_to_slug,
  visible_field,
  openedRows,
  setOpenedRows,
  sub = false,
  lastLabels = "",
}) {
  const [open, setOpen] = useState(false);
  // const [label, setLabel] = useState({});
  const viewFields = Object.values(fieldsMap)
    .find((field) => field?.table_slug === item?.group_by_slug)
    ?.view_fields?.map((field) => field?.slug);

  useEffect(() => {
    if (
      openedRows.includes(
        lastLabels?.length ? lastLabels + "." + item?.label : item?.label
      )
    ) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [item, openedRows, lastLabels]);

  const handleClick = () => {
    const isCurrentlyOpen = openedRows.includes(
      lastLabels?.length ? lastLabels + "." + item?.label : item?.label
    );

    setOpen(!isCurrentlyOpen);

    if (!isCurrentlyOpen) {
      setOpenedRows([
        ...openedRows,
        lastLabels?.length ? lastLabels + "." + item?.label : item?.label,
      ]);
    } else {
      setOpenedRows(
        openedRows.filter(
          (row) =>
            row !==
            (lastLabels?.length ? lastLabels + "." + item?.label : item?.label)
        )
      );
    }
  };

  useEffect(() => {
    if (item?.group_by_type === "LOOKUP") {
      constructorObjectService
        .getById(item?.group_by_slug, item?.label)
        .then((res) => {
          if (res?.data?.response) {
            setLabel(res?.data?.response);
          }
        });
    }
  }, [item]);

  const computedValue = useMemo(() => {
    const slugs = viewFields?.map((item) => item) ?? [];

    return slugs
      .map((slug) =>
        get(item?.[`${item?.group_by_slug}_id_data`]?.[0], slug, "")
      )
      .join(" ");
  }, [viewFields]);

  return (
    <div>
      <div className={styles.group_by_column}>
        <div
          onClick={handleClick}
          className={styles.group_by_column_header}
          style={{
            // backgroundColor: sub ? "#FFF" : "#f2f4f7",
            // backgroundColor: sub ? `rgba(242, 244, 247, ${1 / (level + 1)})` : "#f2f4f7",
            backgroundColor: sub
              ? `rgba(192, 197, 206, ${1 - (level + 1) * 0.3})`
              : "#C0C5CE",
            cursor: item?.data?.[0]?.data?.length ? "pointer" : "",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            padding: "0 10px",
            borderRadius: "4px",
          }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              paddingLeft: sub ? `${level * 6}px` : "",
            }}>
            {item?.group_by_type === "LOOKUP" ? computedValue : item?.label}
            {item?.data?.[0]?.data && (
              <>{open ? <ExpandLess /> : <ExpandMore />}</>
            )}
          </div>
        </div>
        {item?.data &&
          item?.data?.map(
            (option, index) =>
              option?.data && (
                <Collapse in={open} timeout="auto" unmountOnExit>
                  <TimeLineRecursiveRow
                    openedRows={openedRows}
                    setOpenedRows={setOpenedRows}
                    sub={true}
                    level={
                      option?.data?.length ? level + 1 : index + 1 + (level + 1)
                    }
                    groupItem={option}
                    fieldsMap={fieldsMap}
                    view={view}
                    groupbyFields={groupbyFields}
                    selectedType={selectedType}
                    computedColumnsFor={computedColumnsFor}
                    setFocusedDays={setFocusedDays}
                    datesList={datesList}
                    zoomPosition={zoomPosition}
                    calendar_from_slug={calendar_from_slug}
                    calendar_to_slug={calendar_to_slug}
                    visible_field={visible_field}
                    lastLabels={
                      lastLabels?.length
                        ? lastLabels + "." + item?.label
                        : item?.label
                    }
                  />
                </Collapse>
              )
          )}
      </div>
    </div>
  );
}
