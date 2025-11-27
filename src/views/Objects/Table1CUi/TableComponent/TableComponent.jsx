import React, {useEffect, useState} from "react";
import styles from "./style.module.scss";
import TableHead from "./TableHead";
import TableBody from "./TableBody";
import CPagination from "./NewCPagination";
import {useLocation} from "react-router-dom";
import {useDispatch} from "react-redux";
import {tableSizeAction} from "../../../../store/tableSize/tableSizeSlice";
import OneCAddDataColumn from "./AddDataColumn";

const TableComponent = ({
  openFilter,
  fields,
  folders,
  count,
  limit,
  setLimit,
  offset,
  setOffset,
  view,
  isResizeble = false,
  menuItem,
  searchText,
  control,
  refetch = () => {},
}) => {
  const [openGroups, setOpenGroups] = useState({});
  const [folderIds, setFolderIds] = useState([]);
  const [addNewRow, setAddNewRow] = useState(false);

  const location = useLocation();
  const dispatch = useDispatch();
  const pageName =
    location?.pathname.split("/")[location.pathname.split("/").length - 1];

  const toggleGroup = (groupId) => {
    setOpenGroups((prevOpenGroups) => ({
      ...prevOpenGroups,
      [groupId]: !prevOpenGroups[groupId],
    }));
  };

  useEffect(() => {
    if (!isResizeble) return;
    const createResizableTable = function (table) {
      if (!table) return;
      const cols = table.querySelectorAll("th");
      [].forEach.call(cols, function (col, idx) {
        const resizer = document.createElement("span");
        resizer.classList.add("resizer");

        resizer.style.height = `${table.offsetHeight}px`;

        col.appendChild(resizer);

        createResizableColumn(col, resizer, idx);
      });
    };

    const createResizableColumn = function (col, resizer, idx) {
      let x = 0;
      let w = 0;

      const mouseDownHandler = function (e) {
        x = e.clientX;

        const styles = window.getComputedStyle(col);
        w = parseInt(styles.width, 10);

        document.addEventListener("mousemove", mouseMoveHandler);
        document.addEventListener("mouseup", mouseUpHandler);

        resizer.classList.add("resizing");
      };

      const mouseMoveHandler = function (e) {
        const dx = e.clientX - x;
        const colID = col.getAttribute("id");
        const colWidth = w + dx;
        dispatch(tableSizeAction.setTableSize({pageName, colID, colWidth}));
        dispatch(
          tableSizeAction.setTableSettings({
            pageName,
            colID,
            colWidth,
            isStiky: "ineffective",
            colIdx: idx - 1,
          })
        );
        col.style.width = `${colWidth}px`;
      };

      const mouseUpHandler = function () {
        resizer.classList.remove("resizing");
        document.removeEventListener("mousemove", mouseMoveHandler);
        document.removeEventListener("mouseup", mouseUpHandler);
      };

      resizer.addEventListener("mousedown", mouseDownHandler);
    };

    createResizableTable(document.getElementById("resizeMe"));
  }, [dispatch]);

  return (
    <div className={styles.tableComponent}>
      <div
        className={
          openFilter ? styles.tableWrapperActive : styles.tableWrapper
        }>
        <table className={styles.expandable_table}>
          <TableHead
            folderIds={folderIds}
            columns={fields}
            menuItem={menuItem}
            view={view}
          />
          <TableBody
            setFolderIds={setFolderIds}
            folderIds={folderIds}
            columns={fields}
            folders={folders}
            toggleGroup={toggleGroup}
            openGroups={openGroups}
            view={view}
            menuItem={menuItem}
            searchText={searchText}
            offset={offset}
            control={control}
            refetch={refetch}
          />
        </table>
        {addNewRow && (
          <OneCAddDataColumn setAddNewRow={setAddNewRow} columns={fields} />
        )}
      </div>
      <CPagination
        folderIds={folderIds}
        offset={offset}
        setOffset={setOffset}
        limit={limit}
        setLimit={setLimit}
        count={count}
      />
    </div>
  );
};

export default TableComponent;
