import { format } from "date-fns";
import React, { useState } from "react";
import ModalDetailPage from "../ModalDetailPage/ModalDetailPage";
import styles from "./styles.module.scss";

export default function TimeLineDays({ date, zoomPosition, selectedType }) {
  const [open, setOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState("");
  const handleOpen = () => {
    setOpen(true);
    setSelectedRow("NEW");
  };
  const detectDayName = (date) => {
    const dayName = format(date, "EEEE");
    if (dayName === "Saturday" || dayName === "Sunday") return true;
    return false;
  };
  
  return (
    <>
      <div
        onClick={handleOpen}
        className={`${styles.rowItem} ${detectDayName(date) && selectedType !== "month" ? styles.dayOff : ""} ${selectedType === "month" ? styles.month : ""}`}
        style={{
          minWidth: `${zoomPosition * 30}px`,
          cursor: "cell",
          borderRight: selectedType === "month" && format(date, 'dd') === '31' ? "1px solid #e0e0e0" : "",
        }}
      >
        {format(new Date(), "dd.MM.yyyy") === format(date, "dd.MM.yyyy") && <div className={styles.today} id="todayDate" />}
      </div>

      <ModalDetailPage open={open} setOpen={setOpen} selectedRow={selectedRow} />
    </>
  );
}
