import { format } from "date-fns";
import styles from "../style.module.scss";
import useTimeList from "../../../../hooks/useTimeList";

const TimesColumnMonth = ({ view, data }) => {
  const { timeList } = useTimeList(view.time_interval);
  return (
    <div className={styles.timesColumn}>
      <div className={styles.timeRow}></div>
      {/* {view?.group_fields?.map((el) => (
        <div className={styles.timeRow} />
      ))}

      {timeList.map((time) => (
        <div key={time} className={styles.timeRow}>
          {format(time, "HH:mm")}
        </div>
      ))} */}
    </div>
  );
};

export default TimesColumnMonth;
