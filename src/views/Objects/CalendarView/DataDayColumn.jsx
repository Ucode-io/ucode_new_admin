import { Add } from "@mui/icons-material";
import {
  addMinutes,
  differenceInMinutes,
  format,
  setHours,
  setMinutes,
} from "date-fns";
import { useMemo, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import constructorObjectService from "../../../services/constructorObjectService.js";
import useTimeList from "../../../hooks/useTimeList";
import styles from "./day.module.scss";
import { useQueryClient } from "react-query";
import DataDayCard from "./DataDayCard.jsx";
import ModalDetailPage from "../ModalDetailPage/ModalDetailPage.jsx";

const DataDayColumn = ({
  date,
  data,
  categoriesTab,
  parentTab,
  fieldsMap,
  view,
  workingDays,
}) => {
  const [searchParams] = useSearchParams();
  const queryGuid = searchParams.get("guid");
  const queryTableSlug = searchParams.get("tableSlug");
  const querServiceTime = searchParams.get("serviceTime");
  const [open, setOpen] = useState();
  const [dateInfo, setDateInfo] = useState({});
  const [selectedRow, setSelectedRow] = useState({});
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { timeList, timeInterval } = useTimeList(view.time_interval);

  const elements = useMemo(() => {
    if (!parentTab) return [];
    return data?.filter(
      (el) =>
        el[parentTab.slug] === parentTab.value &&
        el.calendar?.date === format(date, "dd.MM.yyyy")
    );
  }, [parentTab, data, date]);

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
    if (queryTableSlug) {
      await constructorObjectService.update(queryTableSlug, {
        data: {
          guid: queryGuid,
          doctors_id: parentTab?.guid,
          date_start: computedDate,
          time_end: addMinutes(new Date(computedDate), querServiceTime),
        },
      });

      queryClient.refetchQueries(["GET_OBJECT_LIST", queryTableSlug]);
      navigate(-1);
    } else {
      const startTimeStampSlug = view?.calendar_from_slug;
      setOpen(true);
      setDateInfo({
        [startTimeStampSlug]: computedDate,
        [parentTab?.slug]: parentTab?.value,
        specialities_id: categoriesTab?.value,
      });
    }
  };

  const navigateToEditPage = (el) => {
    setOpen(true);
    setSelectedRow(el);
    setDateInfo({
      [parentTab?.slug]: parentTab?.value,
    });
  };

  return (
    <div className={styles.objectColumn}>
      {timeList.map((time, index) => (
        <div
          key={time}
          className={styles.timesBlock}
          style={{
            overflow: "auto",
          }}
        >
          <div className={styles.timePlaceholder}>{format(time, "HH:mm")}</div>

          <div
            className={`${styles.addButton}`}
            onClick={() => navigateToCreatePage(time)}
          >
            <Add color="" />
            {queryGuid ? "Choose" : "Create"}
          </div>
        </div>
      ))}

      {elementsWithPosition?.map((el) => {
        return (
          <DataDayCard
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

export default DataDayColumn;
