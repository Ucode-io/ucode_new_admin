import React from "react";
import styles from "./style.module.scss";
import ClearIcon from "@mui/icons-material/Clear";
import { obj } from "./data.js";
import { Switch } from "@mui/material";
import { FirstTeeth } from "../../assets/icons/icon.jsx";

function DentistView({ onClose }) {
  const fillTheSvg = () => {};
  return (
    <>
      <div className={styles.dentist}>
        <div className={styles.dentistHeader}>
          <h2 className={styles.dentistTitle}>Выберите зуб</h2>
          <button className={styles.clearBtn} onClick={onClose}>
            <ClearIcon />
          </button>
        </div>

        <div className={styles.dentistContent}>
          {obj?.map((item) => (
            <div className={styles.dentistContentItem}>
              <div className={styles.teethImg}>
                <item.img />
              </div>
              <div className={styles.teethNumber}>{item?.number}</div>
            </div>
          ))}
        </div>
        <div className={styles.switchBtn}>
          <span>Adults</span> <Switch /> <span>Kids</span>
        </div>
        <div className={styles.controlBtns}>
          <button className={styles.cancelBtn}>Cancel</button>
          <button className={styles.updateBtn}>Save</button>
        </div>
      </div>
    </>
  );
}

export default DentistView;
