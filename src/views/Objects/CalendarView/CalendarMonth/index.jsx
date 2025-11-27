import styles from "../day.module.scss";
import {useRef} from "react";
import {useVirtualizer} from "@tanstack/react-virtual";
import CalendarTemplate from "./CalendarTemplate";

const CalendarMonth = ({
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
    <div className={styles.calendarmonth} ref={parentRef}>
      {/* <TimesColumnMonth view={view} data={data} /> */}

      <CalendarTemplate
        month={datesList}
        data={data}
        fieldsMap={fieldsMap}
        view={view}
      />
      <div
        style={{
          //   width: virtualizer.getTotalSize(),
          height: "100%",
          position: "relative",
        }}>
        {/* {datesList?.map((item, index) => (
          <div
            key={index}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              height: "100%",
              //   transform: `translateX(${virtualColumn.start}px)`,
            }}
          >
            <CalendarMonthColumn
              date={item}
              data={data}
              fieldsMap={fieldsMap}
              view={view}
              tabs={tabs}
              workingDays={workingDays}
              index={index}
            />
          </div>
        ))} */}
        {/* <DataMonthColumn
          date={datesList}
          data={data}
          fieldsMap={fieldsMap}
          view={view}
          tabs={tabs}
          workingDays={workingDays}
        /> */}
      </div>
    </div>
  );
};

export default CalendarMonth;
