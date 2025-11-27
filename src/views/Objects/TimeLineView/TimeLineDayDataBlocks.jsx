import React from "react";
import TimeLineDayDataBlockItem from "./TimeLineDayDataBlockItem";
import TimeLineDays from "./TimeLineDays";
import styles from "./styles.module.scss";
import TimeLineDataRecursiveRow from "./TimeLineDataRecursiveRow";

export default function TimeLineDayDataBlock({
  data,
  fieldsMap,
  setFocusedDays,
  view,
  tabs,
  computedColumnsFor,
  datesList,
  zoomPosition,
  calendar_from_slug,
  calendar_to_slug,
  groupbyFields,
  visible_field,
  selectedType,
  groupByList,
  openedRows,
  setOpenedRows,
}) {
  return (
    <>
      <div
        className={styles.container}
        style={{
          position: "relative",
        }}>
        <div className={styles.days}>
          {datesList.map((date) => (
            <TimeLineDays
              date={date}
              zoomPosition={zoomPosition}
              selectedType={selectedType}
            />
          ))}
        </div>

        {view?.attributes?.group_by_columns?.length !== 0 && (
          <div
            className={styles.dataContainer}
            style={{
              width: "100%",
              height: "100%",
              position: "absolute",
              display: "flex",
              flexDirection: "column",
              top: 0,
            }}>
            {data?.map((item, index) => (
              <TimeLineDataRecursiveRow
                openedRows={openedRows}
                setOpenedRows={setOpenedRows}
                key={item?.label}
                item={item}
                index={index}
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
            ))}
          </div>
        )}

        {view?.attributes?.group_by_columns?.length === 0 &&
          calendar_from_slug &&
          calendar_to_slug && (
            <div className={styles.datas}>
              {data.map((item, index) => (
                <TimeLineDayDataBlockItem
                  selectedType={selectedType}
                  computedColumnsFor={computedColumnsFor}
                  groupbyFields={groupbyFields}
                  data={item}
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
              ))}
            </div>
          )}
      </div>
    </>
  );
}
