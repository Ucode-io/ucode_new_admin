import {Add} from "@mui/icons-material";
import {differenceInMinutes, format, setHours, setMinutes} from "date-fns";
import {useMemo, useState} from "react";
import {useSearchParams} from "react-router-dom";
import styles from "./week.module.scss";
import DataWeekCard from "./DataWeekCard.jsx";
import useTimeList from "../../../../hooks/useTimeList";
import ModalDetailPage from "../../ModalDetailPage/ModalDetailPage";

const WeekColumn = ({
  date,
  data,
  categoriesTab,
  fieldsMap,
  view,
  workingDays,
}) => {
  const [searchParams] = useSearchParams();
  const queryGuid = searchParams.get("guid");
  const [open, setOpen] = useState();
  const [dateInfo, setDateInfo] = useState({});
  const [selectedRow, setSelectedRow] = useState({});

  const {timeList, timeInterval} = useTimeList(view.time_interval);

  const elements = useMemo(() => {
    return data?.filter(
      (el) => el.calendar?.date === format(date, "dd.MM.yyyy")
    );
  }, [data, date]);

  const elementsWithPosition = useMemo(() => {
    const calendarStartedTime = setMinutes(setHours(date, 6), 0);

    return elements?.map((el) => {
      const startPosition =
        Math.floor(
          differenceInMinutes(
            el.calendar?.elementFromTime,
            calendarStartedTime
          ) / timeInterval
        ) * 40;

      const height =
        Math.ceil(
          differenceInMinutes(
            el.calendar?.elementToTime,
            el.calendar?.elementFromTime
          ) / timeInterval
        ) * 40;

      return {
        ...el,
        calendar: {
          ...el.calendar,
          startPosition,
          height,
        },
      };
    });
  }, [date, elements, timeInterval]);

  const viewFields = useMemo(() => {
    return view?.columns?.map((id) => fieldsMap[id])?.filter((el) => el);
  }, [fieldsMap, view]);

  const navigateToCreatePage = async (time) => {
    const hour = Number(format(time, "H"));
    const minute = Number(format(time, "m"));
    const computedDate = await setHours(setMinutes(date, minute), hour);
    const startTimeStampSlug = view?.calendar_from_slug;

    setOpen(true);
    setDateInfo({
      [startTimeStampSlug]: computedDate,
      specialities_id: categoriesTab?.value,
    });
  };

  const navigateToEditPage = (el) => {
    setOpen(true);
    setSelectedRow(el);
    setDateInfo();
  };

  return (
    <div className={styles.objectColumn}>
      {timeList.map((time, index) => (
        <div
          key={time}
          className={styles.timeBlock}
          style={{
            overflow: "auto",
          }}>
          <div className={styles.timePlaceholder}>{format(time, "HH:mm")}</div>

          <div
            className={`${styles.addButton}`}
            onClick={() => navigateToCreatePage(time)}>
            <Add color="" />
            {queryGuid ? "Choose" : "Create"}
          </div>
        </div>
      ))}

      {elementsWithPosition?.map((el) => {
        return (
          <DataWeekCard
            key={el.id}
            date={date}
            view={view}
            fieldsMap={fieldsMap}
            data={el}
            viewFields={viewFields}
            navigateToEditPage={navigateToEditPage}
          />
        );
      })}
      <ModalDetailPage
        open={open}
        setOpen={setOpen}
        dateInfo={dateInfo}
        selectedRow={selectedRow}
      />
    </div>
  );
};

export default WeekColumn;
