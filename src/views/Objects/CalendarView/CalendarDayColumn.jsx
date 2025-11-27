import {format} from "date-fns";
import styles from "./day.module.scss";
import RecursiveDayBlock from "./RecursiveDayBlock";

const CalendarDayColumn = ({
  date,
  data,
  fieldsMap,
  view,
  tabs,
  workingDays,
}) => {
  return (
    <div>
      <div className={styles.dateBlock}>{format(date, "dd MMMM yyyy")}</div>

      <RecursiveDayBlock
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

export default CalendarDayColumn;
