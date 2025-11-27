import React, { forwardRef } from "react";

import BackupTableIcon from "@mui/icons-material/BackupTable";
import { Close } from "@mui/icons-material";

import styles from "./styles.module.scss";

const ClickActionPages = forwardRef((props, ref) => {
  const {
    pivotTemplatesHistory,
    activeClickActionTabId,
    setComputedData,
    onDeleteTemplate,
    setExpandedRows,
    setActiveClickActionTabId,
  } = props;

  const deleteHandler = (e, id) => {
    e.stopPropagation();
    setComputedData([]);
    onDeleteTemplate(id);
    setActiveClickActionTabId(undefined);
  };

  return (
    <div className={styles.clickActions}>
      {pivotTemplatesHistory.data.map((item) => (
        <div
          onClick={() => {
            setComputedData([]);
            setActiveClickActionTabId(item.value);
            setExpandedRows((p) => ({ ...p, [item.value]: [] }));
            setTimeout(() => {
              ref.current.click();
            }, 0);
          }}
          key={item.value}
          className={`${styles.item} ${activeClickActionTabId === item.value ? styles.active : ""}`}
        >
          <BackupTableIcon />
          <span>{item.label}</span>
          {!item.main && <Close onClick={(e) => deleteHandler(e, item.value)} />}
        </div>
      ))}
    </div>
  );
});

export default ClickActionPages;
