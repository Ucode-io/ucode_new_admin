import { Box } from "@mui/material";
import RectangleIconButton from "../../../components/Buttons/RectangleIconButton";
import { ArrowLeft, ArrowRight } from "@mui/icons-material";
import style from "./style.module.scss";
import CalendarDatePicker from "./CalendarDatePicker";

const CalendarDayRange = ({
  datesList,
  formatDate,
  date,
  currentDay,
  setCurrentDay,
}) => {
  const goToNext = () => {
    const nextDay = new Date(currentDay);
    nextDay.setDate(currentDay.getDate() + 1);
    currentDay.setDate(nextDay.getDate());
    setCurrentDay(nextDay);
  };

  const goToPrevious = () => {
    const previousDay = new Date(currentDay);
    previousDay.setDate(currentDay.getDate() - 1);
    currentDay.setDate(previousDay.getDate());
    setCurrentDay(previousDay);
  };

  return (
    <Box className={style.date}>
      <RectangleIconButton onClick={goToPrevious}>
        <ArrowLeft />
      </RectangleIconButton>
      <Box className={style.time}>Today</Box>
      <RectangleIconButton onClick={goToNext}>
        <ArrowRight />
      </RectangleIconButton>
      <Box>
        <CalendarDatePicker
          value={currentDay}
          currentDay={currentDay}
          // mask={"99.99.9999"}
          onChange={(val) => {
            setCurrentDay(val);
          }}
        />
      </Box>
    </Box>
  );
};

export default CalendarDayRange;
