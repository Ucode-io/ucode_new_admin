import React, {useEffect, useState} from "react";
import TimeLineDayDataBlockItem from "./TimeLineDayDataBlockItem";
import {Collapse} from "@mui/material";

export default function TimeLineDataRecursiveRow({
  item,
  index,
  groupbyFields,
  selectedType,
  computedColumnsFor,
  setFocusedDays,
  datesList,
  view,
  zoomPosition,
  calendar_from_slug,
  calendar_to_slug,
  visible_field,
  groupByList,
  openedRows,
  setOpenedRows,
  lastLabels = "",
}) {
  const [open, setOpen] = useState(false);

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

  return (
    <>
      <div
        style={{
          width: "100%",
          height: "32px",
          minHeight: "32px",
          position: "relative",
          zIndex: 1,
        }}>
        {item?.data?.map(
          (data, dataIndex) =>
            !data?.data && (
              <TimeLineDayDataBlockItem
                key={data?.guid}
                selectedType={selectedType}
                computedColumnsFor={computedColumnsFor}
                groupbyFields={groupbyFields}
                data={data}
                levelIndex={index}
                groupByList={groupByList}
                setFocusedDays={setFocusedDays}
                datesList={datesList}
                view={view}
                zoomPosition={zoomPosition}
                calendar_from_slug={calendar_from_slug}
                calendar_to_slug={calendar_to_slug}
                visible_field={visible_field}
              />
            )
        )}
      </div>

      {item?.data?.map(
        (option, subIndex) =>
          option?.data && (
            <Collapse in={open} timeout="auto" unmountOnExit>
              <TimeLineDataRecursiveRow
                lastLabels={
                  lastLabels?.length
                    ? lastLabels + "." + item?.label
                    : item?.label
                }
                openedRows={openedRows}
                setOpenedRows={setOpenedRows}
                key={option?.label}
                item={option}
                index={subIndex + index}
                groupbyFields={groupbyFields}
                selectedType={selectedType}
                computedColumnsFor={computedColumnsFor}
                setFocusedDays={setFocusedDays}
                datesList={datesList}
                view={view}
                zoomPosition={zoomPosition}
                calendar_from_slug={calendar_from_slug}
                calendar_to_slug={calendar_to_slug}
                visible_field={visible_field}
                groupByList={groupByList}
              />
            </Collapse>
          )
      )}
    </>
  );
}
