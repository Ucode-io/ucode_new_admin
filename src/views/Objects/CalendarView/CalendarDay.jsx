import styles from "./day.module.scss";
import TimesColumn from "./TimesColumns";
import {useRef} from "react";
import {useVirtualizer} from "@tanstack/react-virtual";
import CalendarDayColumn from "./CalendarDayColumn";

const CalendarDay = ({data, fieldsMap, datesList, view, tabs, workingDays}) => {
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
              width: "100%",
              top: 0,
              left: 0,
              height: "100%",
              transform: `translateX(${virtualColumn.start}px)`,
            }}>
            <CalendarDayColumn
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

export default CalendarDay;
