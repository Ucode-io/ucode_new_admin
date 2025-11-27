import {format} from "date-fns";
import styles from "./week.module.scss";
import RecursiveWeekBlock from "./RecursiveWeekBlock";

const CalendarWeekColumn = ({
  date,
  data,
  fieldsMap,
  view,
  tabs,
  workingDays,
}) => {
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const dayOfWeekNumber = date.getDay();
  const dayOfWeekName = daysOfWeek[dayOfWeekNumber];

  return (
    <div>
      <div
        className={styles.dateBlock}
        style={{
          color:
            format(date, "dd MMMM yyyy") === format(new Date(), "dd MMMM yyyy")
              ? "#007AFF"
              : "",
        }}>
        {dayOfWeekName} {format(date, "dd")}
      </div>

      <RecursiveWeekBlock
        date={date}
        data={data}
        fieldsMap={fieldsMap}
        view={view}
        tabs={tabs}
        workingDays={workingDays}
      />
    </div>
  );
};

export default CalendarWeekColumn;
