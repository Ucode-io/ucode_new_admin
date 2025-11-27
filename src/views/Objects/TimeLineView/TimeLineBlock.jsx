import React, {useEffect, useMemo, useRef, useState} from "react";
import TimeLineDatesRow from "./TimeLineDatesRow";
import TimeLineDayDataBlock from "./TimeLineDayDataBlocks";
import TimeLineRecursiveRow from "./TimeLineRecursiveRow";
import styles from "./styles.module.scss";
import {useDispatch} from "react-redux";
import {showAlert} from "../../../store/alert/alert.thunk";

export default function TimeLineBlock({
  setDataFromQuery,
  dataFromQuery,
  data,
  fieldsMap,
  datesList,
  view,
  tabs,
  handleScrollClick,
  zoomPosition,
  setDateFilters,
  dateFilters,
  selectedType,
  calendar_from_slug,
  calendar_to_slug,
  visible_field,
  computedColumnsFor,
  isLoading,
}) {
  const scrollContainerRef = useRef(null);
  const [focusedDays, setFocusedDays] = useState([]);
  const [openedRows, setOpenedRows] = useState([]);
  const dispatch = useDispatch();
  const groupbyFields = useMemo(() => {
    return view?.group_fields?.map((field) => {
      return fieldsMap?.[field];
    });
  }, [view?.group_fields, fieldsMap]);

  useEffect(() => {
    handleScrollClick();
  }, []);

  useEffect(() => {
    if (calendar_from_slug === calendar_to_slug) {
      dispatch(
        showAlert(
          "Date from and date to are same. Please select different dates!",
          "error"
        )
      );
    }
  }, [calendar_from_slug, calendar_to_slug]);

  return (
    <div
      className={styles.main_container}
      style={{
        height: `${view?.group_fields?.length ? "100$" : "calc(100vh - 103px"}`,
      }}>
      {view?.attributes?.group_by_columns?.length !== 0 && (
        <div className={styles.group_by}>
          <div
            className={`${styles.fakeDiv} ${
              selectedType === "month" ? styles.month : ""
            }`}>
            Columns
          </div>

          {calendar_from_slug !== calendar_to_slug && (
            <div className={styles.group_by_columns}>
              {data?.map((item, index) => (
                <TimeLineRecursiveRow
                  openedRows={openedRows}
                  setOpenedRows={setOpenedRows}
                  level={0}
                  groupItem={item}
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
                />
              ))}
            </div>
          )}
        </div>
      )}
      <div
        className={styles.gantt}
        ref={scrollContainerRef}
        // onScroll={handleScroll}
      >
        <TimeLineDatesRow
          focusedDays={focusedDays}
          datesList={datesList}
          zoomPosition={zoomPosition}
          selectedType={selectedType}
        />

        {calendar_from_slug !== calendar_to_slug && (
          <TimeLineDayDataBlock
            openedRows={openedRows}
            setOpenedRows={setOpenedRows}
            computedColumnsFor={computedColumnsFor}
            groupbyFields={groupbyFields}
            setFocusedDays={setFocusedDays}
            selectedType={selectedType}
            zoomPosition={zoomPosition}
            data={data}
            fieldsMap={fieldsMap}
            view={view}
            tabs={tabs}
            datesList={datesList}
            calendar_from_slug={calendar_from_slug}
            calendar_to_slug={calendar_to_slug}
            visible_field={visible_field}
          />
        )}
      </div>
    </div>
  );
}
