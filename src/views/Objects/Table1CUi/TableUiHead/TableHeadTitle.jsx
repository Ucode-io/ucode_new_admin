import React from "react";
import styles from "./style.module.scss";

function TableHeadTitle({menuItem}) {
  return (
    <div className={styles.tableHeadTitle}>
      <h2>{menuItem?.label ?? ""}</h2>
      <div className={styles.tableHeadLinks}>
        {/* <a href="#">
          Счета расходов с контрагентами <OpenInNewIcon />
        </a>
        <a href="#">
          Номенклатура поставщика <OpenInNewIcon />
        </a> */}
      </div>
    </div>
  );
}

export default TableHeadTitle;
