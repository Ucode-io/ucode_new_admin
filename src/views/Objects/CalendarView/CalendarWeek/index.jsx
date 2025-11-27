import styles from "../day.module.scss";
import {useRef} from "react";
import {useVirtualizer} from "@tanstack/react-virtual";
import CalendarWeekColumn from "./CalendarWeekColumn";
import TimesColumn from "../TimesColumns";

const CalendarWeek = ({
  data,
  fieldsMap,
  datesList,
  view,
  tabs,
  workingDays,
}) => {
  const parentRef = useRef(null);

  const virtualizer = useVirtualizer({
    horizontal: true,
    count: datesList?.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 500,
  });

  return (
    <div className={styles.calendarday} ref={parentRef}>
      <TimesColumn view={view} data={data} />

      <div
        style={{
          // width: virtualizer.getTotalSize(),
          width: "100vw",
          height: "100%",
          position: "relative",
        }}>
        {virtualizer.getVirtualItems().map((virtualColumn) => (
          <div
            key={virtualColumn.key}
            data-index={virtualColumn.index}
            ref={virtualizer.measureElement}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              height: "100%",
              width: view?.group_fields?.length ? "100%" : "14.3%",
              transform: `translateX(${virtualColumn.start}px)`,
            }}>
            <CalendarWeekColumn
              date={datesList[virtualColumn.index]}
              data={data}
              fieldsMap={fieldsMap}
              view={view}
              tabs={tabs}
              workingDays={workingDays}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalendarWeek;
