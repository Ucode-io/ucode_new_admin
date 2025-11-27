import {TextField} from "@mui/material";
import React, {useState} from "react";
import {useDispatch} from "react-redux";
import {useNavigate, useParams, useSearchParams} from "react-router-dom";
import useDebounce from "../../../../hooks/useDebounce";
import useFilters from "../../../../hooks/useFilters";
import CreateGroupModal from "./CreateGroupModal";
import DownloadMenu from "./DownloadMenu";
import NewFastFilter from "./FastFilter";
import GroupSwitchMenu from "./GroupSwitchMenu";
import styles from "./style.module.scss";
import useRelationTabRouter from "../../../../hooks/useRelationTabRouter";
import TableHeadTitle from "../TableUiHead/TableHeadTitle";

function TableFilterBlock({
  openFilter,
  setOpenFilter,
  fields,
  fieldsMap,
  view,
  menuItem,
  setSearchText,
  computedVisibleFields,
}) {
  const {tableSlug, appId} = useParams();
  const [anchorEl, setAnchorEl] = useState(null);
  const [groupOpen, setGroupOpen] = useState(false);
  const open = Boolean(anchorEl);
  const {navigateToRelationForm} = useRelationTabRouter();
  const [searchParams] = useSearchParams();
  const menuId = searchParams.get("menuId");

  const [columns, setColumns] = useState([]);
  const {filters, clearFilters} = useFilters(tableSlug, view.id);
  const navigate = useNavigate();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleGroup = () => setGroupOpen(true);
  const handleGroupClose = () => setGroupOpen(false);

  const toggleColumnVisibility = (index) => {
    setColumns((prevColumns) =>
      prevColumns.map((col, i) =>
        i === index ? {...col, visible: !col.visible} : col
      )
    );
  };

  const navigateToDetailPage = (row) => {
    if (view?.attributes?.navigate?.url) {
      const urlTemplate = view?.attributes?.navigate?.url;
      let query = urlTemplate;

      navigate(`${view?.attributes?.navigate?.url}/create`);
    } else {
      navigateToRelationForm(
        tableSlug,
        "CREATE",
        {},
        {folder_id: localStorage.getItem("folder_id")},
        menuId ?? appId
      );
    }
  };

  const inputChangeHandler = useDebounce((val) => {
    setSearchText(val.target.value);
  }, 300);

  return (
    <>
      <TableHeadTitle menuItem={menuItem} />
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

          <button
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
          </button>
          <button onClick={handleClick} className={styles.filterBtn}>
            <img src="/img/eye_off.svg" alt="" />
          </button>
        </div>

        <div className={styles.filterCreatBtns}>
          <button
            onClick={() => {
              navigateToDetailPage(tableSlug);
            }}
            className={styles.createBtn}>
            Создать
          </button>
          <button onClick={handleGroup} className={styles.createGroupBtn}>
            Создать группу
          </button>
          <DownloadMenu
            computedVisibleFields={computedVisibleFields}
            view={view}
            menuItem={menuItem}
          />
        </div>
      </div>

      <div
        style={{display: openFilter ? "flex" : "none"}}
        className={styles.filterList}>
        <div onClick={clearFilters} className={styles.filterListItem}>
          <p>Сбросить фильтры</p>
        </div>

        <NewFastFilter fields={fields} fieldsMap={fieldsMap} view={view} />
      </div>

      <GroupSwitchMenu
        columns={columns}
        toggleColumnVisibility={toggleColumnVisibility}
        setColumns={setColumns}
        anchorEl={anchorEl}
        handleClose={handleClose}
        open={open}
        view={view}
        fieldsMap={fieldsMap}
      />

      <CreateGroupModal
        handleGroupClose={handleGroupClose}
        groupOpen={groupOpen}
        menuItem={menuItem}
      />
    </>
  );
}

export default TableFilterBlock;
