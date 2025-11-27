import {TextField} from "@mui/material";
import React, {useMemo, useState} from "react";
import {useDispatch} from "react-redux";
import {useParams, useSearchParams} from "react-router-dom";
import styles from "./style.module.scss";
import useTabRouter from "../../../../../hooks/useTabRouter";
import useFilters from "../../../../../hooks/useFilters";
import useDebounce from "../../../../../hooks/useDebounce";
import RelationVisibleColumns from "./RelationVisibleColumns";
import AddIcon from "@mui/icons-material/Add";

function TableFilterBlock({
  fields,
  fieldsMap,
  view,
  menuItem,
  setSearchText,
  computedVisibleFields,
  getAllData = () => {},
  data,
  selectedTabIndex,
  addNewRow,
}) {
  const {tableSlug, appId} = useParams();
  const [anchorEl, setAnchorEl] = useState(null);
  const [groupOpen, setGroupOpen] = useState(false);
  const open = Boolean(anchorEl);
  const {navigateToForm} = useTabRouter();
  const [searchParams] = useSearchParams();
  const menuId = searchParams.get("menuId");
  const dispatch = useDispatch();
  const [columns, setColumns] = useState([]);
  const {filters, clearFilters, clearOrders} = useFilters(tableSlug, view?.id);
  const [openFilter, setOpenFilter] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState(null);

  const handleClick = (event, column) => {
    setAnchorEl(event.currentTarget);
    setSelectedColumn(column);
  };
  const handleClose = () => {
    setAnchorEl(null);
    setSelectedColumn(null);
  };
  const visibleFields = useMemo(() => {
    return (
      view?.columns
        ?.map((id) => fieldsMap[id])
        .filter((el) => {
          if (el?.type === "LOOKUP" || el?.type === "LOOKUPS") {
            return el?.relation_id;
          } else {
            return el?.id;
          }
        }) ?? []
    );
  }, [view?.columns, fieldsMap]);

  // const handleGroup = () => setGroupOpen(true);
  // const handleGroupClose = () => setGroupOpen(false);

  // const toggleColumnVisibility = (index) => {
  //   setColumns((prevColumns) =>
  //     prevColumns.map((col, i) =>
  //       i === index ? {...col, visible: !col.visible} : col
  //     )
  //   );
  // };

  const navigateCreatePage = (row) => {
    navigateToForm(
      tableSlug,
      "CREATE",
      {},
      {folder_id: localStorage.getItem("folder_id")},
      menuId ?? appId
    );
  };

  const inputChangeHandler = useDebounce((val) => {
    setSearchText(val.target.value);
  }, 300);

  return (
    <>
      <div className={styles.tableFilterBlock}>
        <div className={styles.searchFilter}>
          <TextField
            sx={{
              width: "300px",
              height: "36px",
              "& .MuiInputBase-input": {
                padding: "10px 12px",
              },
            }}
            onChange={inputChangeHandler}
            placeholder="Search"
            variant="outlined"
            size="small"
          />

          {/* <button
            className={styles.filterBtn}
            onClick={() => {
              setOpenFilter(!openFilter);
            }}>
            <img src="/img/filter_funnel.svg" alt="" />
            {Object.values(filters)?.length > 0 && (
              <div className={styles.filterBadge}>
                {Object.values(filters)?.length}
              </div>
            )}
          </button> */}
          <button onClick={handleClick} className={styles.filterBtn}>
            <img src="/img/eye_off.svg" alt="" />
          </button>

          {/* <button onClick={addNewRow} className={styles.filterBtn}>
            <AddIcon sx={{fontSize: "24px", color: "#000"}} />
          </button> */}
        </div>
      </div>
      {/* <div
        style={{display: openFilter ? "flex" : "none"}}
        className={styles.filterList}>
        <div onClick={clearFilters} className={styles.filterListItem}>
          <p>Сбросить фильтры</p>
        </div>

        <NewFastFilter fields={fields} fieldsMap={fieldsMap} view={view} />
      </div> */}

      <RelationVisibleColumns
        fieldsMap={fieldsMap}
        view={view}
        getAllData={getAllData}
        data={data}
        selectedTabIndex={selectedTabIndex}
        anchorEl={anchorEl}
        handleClose={handleClose}
      />
    </>
  );
}

export default TableFilterBlock;
