import React, {useState} from "react";
import styles from "./style.module.scss";
import {Box, CircularProgress, Menu, MenuItem, Typography} from "@mui/material";
import {IOSSwitch} from "../../../../theme/overrides/IosSwitch";
import constructorViewService from "../../../../services/constructorViewService";
import {useQueryClient} from "react-query";
import {useLocation, useParams} from "react-router-dom";
import {useSelector} from "react-redux";
import calculateWidthFixedColumn from "../../../../utils/calculateWidthFixedColumn";
import TableFieldButton from "../TableFieldButton";
import {useTranslation} from "react-i18next";

function TableHead({columns, view, folderIds, menuItem}) {
  const {tableSlug} = useParams();
  const {i18n} = useTranslation();
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedColumn, setSelectedColumn] = useState(null);
  const [columnFix, setColumnFix] = useState(false);
  const open = Boolean(anchorEl);
  const queryClient = useQueryClient();

  const [switchLoading, setSwitchLoading] = useState(false);
  const tableSettings = useSelector((state) => state.tableSize.tableSettings);
  const location = useLocation();
  const tableSize = useSelector((state) => state.tableSize.tableSize);
  const pageName =
    location?.pathname.split("/")[location.pathname.split("/").length - 1];

  const handleClose = () => {
    setAnchorEl(null);
    setSelectedColumn(null);
  };
  const handleClick = (e, column) => {
    setAnchorEl(e.currentTarget);
    setSelectedColumn(column);
  };

  const updateView = (data, fieldId) => {
    setSwitchLoading((prev) => ({...prev, [fieldId]: true}));
    constructorViewService
      .update(tableSlug, {
        ...view,
        columns: data,
      })
      .then(() => {
        queryClient.refetchQueries(["GET_VIEWS_AND_FIELDS"]);
      })
      .finally(() => {
        handleClose();
        setSwitchLoading((prev) => ({...prev, [fieldId]: false}));
      });
  };

  const fixColumnChangeHandler = (column, isChecked) => {
    setColumnFix(true);
    const computedData = {
      ...view,
      attributes: {
        ...view?.attributes,
        fixedColumns: {
          ...view?.attributes?.fixedColumns,
          [column.id]: isChecked,
        },
      },
    };

    constructorViewService
      .update(tableSlug, computedData)
      .then((res) => {
        queryClient.refetchQueries(["GET_VIEWS_AND_FIELDS"]);
      })
      .finally(() => {
        setColumnFix(false);
      });
  };

  return (
    <>
      <thead>
        <tr
          style={{
            position: "sticky",
            width: "100%",
            overflow: "auto",
            left: 0,
            top: 0,
            zIndex: 3,
          }}>
          <th
            style={{
              width: "70px",
              textAlign: "center",
              position: "sticky",
              left: "0",
              zIndex: 9999,
              outline: "#EAECF0 1px solid",
              border: "none",
              background: "#F9FAFB",
            }}>
            №
          </th>
          {columns?.map((column) => (
            <th
              id={column.id}
              style={{
                minWidth: tableSize?.[pageName]?.[column.id]
                  ? tableSize?.[pageName]?.[column.id]
                  : "auto",
                width: !tableSize?.[pageName]?.[column.id]
                  ? tableSize?.[pageName]?.[column.id]
                  : "auto",
                background: "#F9FAFB",
                position: `${
                  tableSettings?.[pageName]?.find(
                    (item) => item?.id === column?.id
                  )?.isStiky ||
                  (view?.attributes?.fixedColumns?.[column?.id] &&
                    !folderIds?.length)
                    ? "sticky"
                    : "relative"
                }`,
                left:
                  view?.attributes?.fixedColumns?.[column?.id] &&
                  !folderIds?.length
                    ? `${calculateWidthFixedColumn(column.id, columns) + 50}px`
                    : "0",
                backgroundColor: `${
                  tableSettings?.[pageName]?.find(
                    (item) => item?.id === column?.id
                  )?.isStiky ||
                  (view?.attributes?.fixedColumns?.[column?.id] &&
                    !folderIds?.length)
                    ? "#F9FAFB"
                    : "#F9FAFB"
                }`,
                zIndex: `${
                  tableSettings?.[pageName]?.find(
                    (item) => item?.id === column?.id
                  )?.isStiky || view?.attributes?.fixedColumns?.[column?.id]
                    ? "3"
                    : "2"
                }`,
                top: 0,
              }}
              key={column.accessor}>
              <div className={styles.tableHeaditem}>
                <p>{column?.attributes?.[`label_${i18n?.language}`]}</p>
                <button onClick={(e) => handleClick(e, column)}>
                  <img src="/img/dots_horizontal.svg" alt="" />
                </button>
              </div>

              <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
                <Box sx={{width: "244px"}}>
                  <MenuItem
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "11px 14px",
                    }}>
                    <Typography
                      sx={{
                        color: "#101828",
                        fontWeight: 500,
                        fontSize: "14px",
                      }}>
                      Fix
                    </Typography>
                    {columnFix ? (
                      <CircularProgress sx={{color: "#449424"}} size={24} />
                    ) : (
                      <IOSSwitch
                        checked={
                          view?.attributes?.fixedColumns?.[selectedColumn?.id]
                        }
                        onChange={(e) => {
                          fixColumnChangeHandler(
                            selectedColumn,
                            e.target.checked
                          );
                        }}
                        color="primary"
                      />
                    )}
                  </MenuItem>
                  <MenuItem
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "11px 14px",
                    }}>
                    <Typography
                      sx={{
                        color: "#101828",
                        fontWeight: 500,
                        fontSize: "14px",
                      }}>
                      Hide
                    </Typography>
                    {selectedColumn?.type === "LOOKUP" ||
                    selectedColumn?.type === "LOOKUPS" ? (
                      switchLoading[selectedColumn.relation_id] ? (
                        <CircularProgress sx={{color: "#449424"}} size={24} />
                      ) : (
                        <IOSSwitch
                          size="small"
                          checked={
                            !view?.columns?.includes(
                              selectedColumn?.relation_id
                            )
                          }
                          onChange={(e) => {
                            updateView(
                              !e.target.checked
                                ? [
                                    ...view?.columns,
                                    selectedColumn?.relation_id,
                                  ]
                                : view?.columns?.filter(
                                    (el) => el !== selectedColumn?.relation_id
                                  ),
                              selectedColumn?.relation_id
                            );
                          }}
                        />
                      )
                    ) : switchLoading[selectedColumn?.id] ? (
                      <CircularProgress sx={{color: "#449424"}} size={24} />
                    ) : (
                      <IOSSwitch
                        size="small"
                        checked={!view?.columns?.includes(selectedColumn?.id)}
                        onChange={(e) => {
                          updateView(
                            !e.target.checked
                              ? [...view?.columns, selectedColumn?.id]
                              : view?.columns?.filter(
                                  (el) => el !== selectedColumn?.id
                                ),
                            selectedColumn?.id
                          );
                        }}
                      />
                    )}
                  </MenuItem>
                </Box>
              </Menu>
            </th>
          ))}

          <th
            style={{
              width: "100px",
              background: "#fff",
              textAlign: "center",
              borderRight: "none",
              position: "sticky",
              right: 0,
              outline: "#EAECF0 1px solid",
              border: "none",
              zIndex: 5,
              background: "#F9FAFB",
              padding: "0px",
            }}>
            <TableFieldButton menuItem={menuItem} view={view} />
          </th>
        </tr>
      </thead>
    </>
  );
}

export default TableHead;
