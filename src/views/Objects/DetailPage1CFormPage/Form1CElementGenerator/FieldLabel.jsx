import React from "react";
import styles from "./style.module.scss";

function FieldLabel({children, label}) {
  return (
    <div className={styles.fieldLabel}>
      <p className={styles.fieldTitle}>{label}</p>
      <div>{children}</div>
    </div>
  );
}

export default FieldLabel;
