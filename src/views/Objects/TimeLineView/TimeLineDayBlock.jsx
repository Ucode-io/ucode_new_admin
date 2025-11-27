import React, { useEffect, useState } from "react";
import styles from "./styles.module.scss";
import { Popover, Typography } from "@mui/material";
import { eachDayOfInterval, format } from "date-fns";

export default function TimeLineDayBlock({ day, zoomPosition, selectedType, focusedDays }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const splittedDay = day.split("/");

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  function generateDateRange(startDate, endDate) {
    if (!startDate || !endDate) return [];
    const start = new Date(startDate);
    const end = new Date(endDate);

    const dateRange = eachDayOfInterval({ start, end });
    return dateRange;
  }

  const [isFocusedDay, setIsFocusedDay] = useState(false);

  useEffect(() => {
    if (!focusedDays?.length) {
      setIsFocusedDay(false);
      return;
    }

    const dateRange = generateDateRange(focusedDays?.[0], focusedDays?.[1]);

    setIsFocusedDay(
      dateRange
        .map((date) => {
          if (!date) return null;
          return format(date, "dd/EEEE");
        })
        .includes(day)
    );
  }, [focusedDays, day]);

  // const isFocusedDay = () => {
  //   if (focusedDays?.length) return null;

  //   return generateDateRange(focusedDays?.[0], focusedDays?.[1])
  //     .map((date) => {
  //       if (!date) return null;
  //       return format(date, "dd/EEEE");
  //     })
  //     .includes(day);
  // };

  return (
    <>
      {/* <div
        style={{
          minWidth: `${zoomPosition * 30}px`,
          visibility: selectedType === "month" ? "hidden" : "",
          backgroundColor: isFocusedDay() ? "#007AFF !important" : "",
          color: isFocusedDay() ? "#fff !important" : "",
        }}
        aria-owns={open ? "mouse-over-popover" : undefined}
        aria-haspopup="true"
        onMouseEnter={handlePopoverOpen}
        onMouseLeave={handlePopoverClose}
        className={`${styles.dayBlock} ${(splittedDay[1] === "Saturday" || splittedDay[1] === "Sunday") && selectedType !== "month" ? styles.dayOff : ""}`}
      >
        {splittedDay[0]}
      </div> */}

      <div
        style={{
          minWidth: `${zoomPosition * 30}px`,
          visibility: selectedType === "month" ? "hidden" : "visible",
          backgroundColor: isFocusedDay ? "#7f77f1" : "transparent",
          color: isFocusedDay ? "#fff" : "inherit",
        }}
        aria-owns={open ? "mouse-over-popover" : undefined}
        aria-haspopup="true"
        onMouseEnter={handlePopoverOpen}
        onMouseLeave={handlePopoverClose}
        className={`${styles.dayBlock} ${(splittedDay[1] === "Saturday" || splittedDay[1] === "Sunday") && selectedType !== "month" ? styles.dayOff : ""}`}
      >
        {splittedDay[0]}
      </div>

      <Popover
        id="mouse-over-popover"
        sx={{
          pointerEvents: "none",
        }}
        open={open}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        onClose={handlePopoverClose}
        disableRestoreFocus
      >
        <Typography sx={{ p: 1, background: "#384147", color: "#fff" }}>{splittedDay[0] + " / " + splittedDay[1]}</Typography>
      </Popover>
    </>
  );
}
