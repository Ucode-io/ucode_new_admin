import { format } from "date-fns";
import styles from "./month.module.scss";
import RecursiveMonthBlock from "./RecursiveMonthBlock";

const CalendarMonthColumn = ({
  date,
  data,
  fieldsMap,
  view,
  tabs,
  workingDays,
  index,
}) => {
  return (
    <div>
      {/* <div className={styles.dateBlock}>{format(date, "dd MMMM yyyy")}</div> */}

      <RecursiveMonthBlock
        date={date}
        data={data}
        fieldsMap={fieldsMap}
        view={view}
        tabs={tabs}
        workingDays={workingDays}
        index={index}
      />
    </div>
  );
};

export default CalendarMonthColumn;
