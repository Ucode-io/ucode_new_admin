import { Box, Typography } from "@mui/material";
import { ArrowLeft, ArrowRight } from "@mui/icons-material";
import style from "../style.module.scss";
import RectangleIconButton from "../../../../components/Buttons/RectangleIconButton";
import { format } from "date-fns";
import { useEffect } from "react";
import CalendarDatePicker from "../CalendarDatePicker";

const CalendarWeekRange = ({
  formatDate,
  date,
  setCurrentDay,
  currentDay,
  weekDates,
  setFirstDate,
  firstDate,
  setLastDate,
  lastDate,
  setWeekDates,
}) => {
  useEffect(() => {
    const currentDate = new Date(currentDay);
    const dayOfWeek = currentDate.getDay();
    const daysOfWeek = [];

    for (let i = 0; i < 7; i++) {
      const day = new Date(currentDate);
      day.setDate(currentDate.getDate() - dayOfWeek + i);
      daysOfWeek.push(day);
    }
    setWeekDates(daysOfWeek);
  }, [currentDay]);

  useEffect(() => {
    setFirstDate(weekDates[0]);
    setLastDate(weekDates[weekDates.length - 1]);
  }, [weekDates, currentDay]);

  const nextWeek = () => {
    const nextMonday = new Date(currentDay);
    nextMonday.setDate(currentDay.getDate() + 7);
    setCurrentDay(nextMonday);
  };

  const prevWeek = () => {
    const prevMonday = new Date(currentDay);
    prevMonday.setDate(currentDay.getDate() - 7);
    setCurrentDay(prevMonday);
  };
  const formattedDifference =
    firstDate && format(firstDate, "dd") + " - " + format(lastDate, "dd");

  return (
    <Box className={style.date}>
      <RectangleIconButton onClick={prevWeek}>
        <ArrowLeft />
      </RectangleIconButton>
      <Box className={style.time}>
        {formatDate.find((item) => item.value === date).label}
      </Box>
      <RectangleIconButton onClick={nextWeek}>
        <ArrowRight />
      </RectangleIconButton>
      <Box>
        <CalendarDatePicker
          value={currentDay}
          currentDay={currentDay}
          onChange={(val) => {
            setCurrentDay(val);
          }}
        />
      </Box>
    </Box>
  );
};

export default CalendarWeekRange;
