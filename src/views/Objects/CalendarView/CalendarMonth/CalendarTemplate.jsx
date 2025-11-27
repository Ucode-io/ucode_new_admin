import React, {useMemo, useState} from "react";
import styles from "./month.module.scss";
import {Box} from "@mui/material";
import ModalDetailPage from "../../ModalDetailPage/ModalDetailPage";
import DataMonthCard from "./DataMonthCard";
import {dateValidFormat} from "../../../../utils/dateValidFormat";
import AddBoxIcon from "@mui/icons-material/AddBox";
const daysOfWeek = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const CalendarTemplate = ({month = [], data, view, fieldsMap}) => {
  const [open, setOpen] = useState();
  const [dateInfo, setDateInfo] = useState({});
  const [selectedRow, setSelectedRow] = useState({});
  const navigateToCreatePage = (time) => {
    setOpen(true);
    setDateInfo({});
  };

  const navigateToEditPage = (el) => {
    setOpen(true);
    setSelectedRow(el);
    setDateInfo({});
  };

  const viewFields = useMemo(() => {
    return view?.columns?.map((id) => fieldsMap[id])?.filter((el) => el);
  }, [fieldsMap, view]);

  return (
    <>
      <Box className={styles.calendarTemplate}>
        {daysOfWeek?.map((date, index) => (
          <Box
            key={index}
            className={styles.days}
            style={{
              borderColor: new Date().getDay() === index ? "#007AFF" : "",
            }}>
            {date}
          </Box>
        ))}
      </Box>
      <Box className={styles.calendarTemplate}>
        {Array.isArray(month) &&
          month?.map((date, index) => (
            <>
              <Box
                key={index}
                className={styles.calendar}
                style={{
                  borderColor:
                    dateValidFormat(new Date(), "dd.MM.yyyy") ===
                    dateValidFormat(date, "dd.MM.yyyy")
                      ? "#007AFF"
                      : "",
                  background:
                    date.getDay() === 0 || date.getDay() === 6 ? "#f5f4f4" : "",
                }}>
                {!data?.includes(date) && (
                  <Box
                    className={styles.desc}
                    onClick={() => navigateToCreatePage()}>
                    <Box className={`${styles.addButton}`}>
                      <AddBoxIcon />
                    </Box>
                  </Box>
                )}
                {new Date(date).toLocaleDateString(
                  "en-US",
                  dateValidFormat(date, "dd") === "01"
                    ? {
                        day: "numeric",
                        //   month: "short",
                      }
                    : {
                        day: "numeric",
                      }
                )}

                <Box className={styles.card}>
                  {data?.map((el, idx) =>
                    dateValidFormat(date, "dd.MM.yyyy") === el?.calendar.date ||
                    dateValidFormat(date, "dd.MM.yyyy") ===
                      dateValidFormat(el?.date_to, "dd.MM.yyyy") ? (
                      <DataMonthCard
                        key={el.id}
                        date={date}
                        view={view}
                        fieldsMap={fieldsMap}
                        data={el}
                        viewFields={viewFields}
                        navigateToEditPage={navigateToEditPage}
                      />
                    ) : null
                  )}
                </Box>
              </Box>
            </>
          ))}
      </Box>

      <ModalDetailPage
        open={open}
        setOpen={setOpen}
        dateInfo={dateInfo}
        selectedRow={selectedRow}
      />
    </>
  );
};

export default CalendarTemplate;
