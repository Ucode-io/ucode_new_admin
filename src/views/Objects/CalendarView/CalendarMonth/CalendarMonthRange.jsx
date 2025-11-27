import { Box, Typography } from "@mui/material";
import { ArrowLeft, ArrowRight } from "@mui/icons-material";
import style from "../style.module.scss";
import RectangleIconButton from "../../../../components/Buttons/RectangleIconButton";
import { format } from "date-fns";

const CalendarMonthRange = ({
  formatDate,
  date,
  setCurrentDay,
  currentDay,
}) => {
  //   const nextMonth = () => {
  //     if (currentMonthIndex < monthData.length - 1) {
  //       setCurrentMonthIndex(currentMonthIndex + 1);
  //     }
  //   };

  //   const previousMonth = () => {
  //     if (currentMonthIndex > 0) {
  //       setCurrentMonthIndex(currentMonthIndex - 1);
  //     }
  //   };

  const nextMonth = () => {
    const nextMonthStart = new Date(currentDay);
    nextMonthStart.setMonth(currentDay.getMonth() + 1);

    if (nextMonthStart.getDay() !== 0) {
      nextMonthStart.setDate(1 - nextMonthStart.getDay() + 7);
    }
    setCurrentDay(nextMonthStart);
  };

  const prevMonth = () => {
    const prevMonthStart = new Date(currentDay);
    prevMonthStart.setMonth(currentDay.getMonth() - 1);

    if (prevMonthStart.getDay() !== 0) {
      prevMonthStart.setDate(1 - prevMonthStart.getDay() + 7);
    }
    setCurrentDay(prevMonthStart);
  };

  return (
    <Box className={style.date}>
      <RectangleIconButton onClick={prevMonth}>
        <ArrowLeft />
      </RectangleIconButton>
      <Box className={style.time}>
        {formatDate.find((item) => item.value === date).label}
      </Box>
      <RectangleIconButton onClick={nextMonth}>
        <ArrowRight />
      </RectangleIconButton>

      <Typography variant="h5">{format(currentDay, "MMMM yyyy")}</Typography>
    </Box>
  );
};

export default CalendarMonthRange;
