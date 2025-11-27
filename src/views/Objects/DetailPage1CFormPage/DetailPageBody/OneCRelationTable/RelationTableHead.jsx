import React, {useEffect, useMemo, useState} from "react";
import styles from "./style.module.scss";
import {Box, CircularProgress, Menu, MenuItem, Typography} from "@mui/material";
import {IOSSwitch} from "../../../../../theme/overrides/IosSwitch";
import {useParams, useSearchParams} from "react-router-dom";
import layoutService from "../../../../../services/layoutService";
import menuService from "../../../../../services/menuService";

function RelationTableHead({
  column,
  view,
  fieldsMap,
  data,
  selectedTabIndex,
  getAllData = () => {},
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenu = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const {tableSlug} = useParams();

  const [isLoading, setIsLoading] = useState(false);
  const allFields = useMemo(() => {
    return Object.values(fieldsMap);
  }, [fieldsMap]);

  const [searchParams, setSearchParams] = useSearchParams();
  const [menuItem, setMenuItem] = useState(null);

  const updateView = async (datas) => {
    setIsLoading(true);

    const result = data?.tabs;

    if (!result) {
      setIsLoading(false);
      return;
    }

    const computeTabs = result.map((item, index) => {
      if (index === selectedTabIndex) {
        return {
          ...item,
          attributes: {
            ...item.attributes,
            columns: [...datas],
          },
        };
      } else {
        return {
          ...item,
          attributes: {
            ...item.attributes,
            columns: Array.isArray(item?.attributes?.columns)
              ? [...item?.attributes?.columns]
              : [],
          },
        };
      }
    });

    try {
      await layoutService.update(
        {
          ...data,
          tabs: computeTabs,
        },
        tableSlug
      );

      await getAllData();
    } catch (error) {
      console.error("Error updating layout:", error);
    } finally {
      setIsLoading(false);
      handleClose();
    }
  };

  const computedColumns = useMemo(() => {
    if (Array.isArray(data?.tabs?.[selectedTabIndex]?.attributes?.columns)) {
      return (
        data?.tabs?.[selectedTabIndex]?.attributes?.columns ??
        data?.tabs?.[selectedTabIndex]?.relation?.columns
      );
    } else {
      return [];
    }
  }, [data?.tabs, selectedTabIndex]);

  const visibleFields = useMemo(() => {
    return (
      computedColumns?.map((id) => fieldsMap[id])?.filter((el) => el?.type) ??
      []
    );
  }, [computedColumns, fieldsMap]);

  const unVisibleFields = useMemo(() => {
    return allFields.filter((field) => {
      if (field?.type === "LOOKUP" || field?.type === "LOOKUPS") {
        return !computedColumns?.includes(field.relation_id);
      } else {
        return !computedColumns?.includes(field.id);
      }
    });
  }, [allFields, computedColumns]);

  const onDrop = (dropResult) => {
    const result = applyDrag(visibleFields, dropResult);
    if (result) {
      updateView(
        result.map((el) => {
          if (el?.type === "LOOKUP" || el?.type === "LOOKUPS") {
            return el.relation_id;
          } else {
            return el.id;
          }
        })
      );
    }
  };

  useEffect(() => {
    if (searchParams.get("menuId")) {
      menuService
        .getByID({
          menuId: searchParams.get("menuId"),
        })
        .then((res) => {
          setMenuItem(res);
        });
    }
  }, []);
  return (
    <>
      <th
        id={column.id}
        // style={{
        //   minWidth: tableSize?.[pageName]?.[column.id]
        //     ? tableSize?.[pageName]?.[column.id]
        //     : "auto",
        //   width: !tableSize?.[pageName]?.[column.id]
        //     ? tableSize?.[pageName]?.[column.id]
        //     : "auto",
        //   position: `${
        //     tableSettings?.[pageName]?.find(
        //       (item) => item?.id === column?.id
        //     )?.isStiky ||
        //     (view?.attributes?.fixedColumns?.[column?.id] &&
        //       !folderIds?.length)
        //       ? "sticky"
        //       : "relative"
        //   }`,
        //   left:
        //     view?.attributes?.fixedColumns?.[column?.id] &&
        //     !folderIds?.length
        //       ? `${calculateWidthFixedColumn(column.id, columns) + 0}px`
        //       : "0",
        //   backgroundColor: `${
        //     tableSettings?.[pageName]?.find(
        //       (item) => item?.id === column?.id
        //     )?.isStiky ||
        //     (view?.attributes?.fixedColumns?.[column?.id] &&
        //       !folderIds?.length)
        //       ? "#F6F6F6"
        //       : "#fff"
        //   }`,
        //   zIndex: `${
        //     tableSettings?.[pageName]?.find(
        //       (item) => item?.id === column?.id
        //     )?.isStiky || view?.attributes?.fixedColumns?.[column?.id]
        //       ? "3"
        //       : "2"
        //   }`,
        //   top: 0,
        // }}
        key={column.accessor}>
        <div className={styles.tableHeaditem}>
          <p>{column?.label ?? column?.title}</p>
          <button onClick={handleMenu}>
            <img src="/img/dots_horizontal.svg" alt="" />
          </button>
        </div>
      </th>

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
            {/* {columnFix ? (
              <CircularProgress sx={{color: "#449424"}} size={24} />
            ) : ( */}
            <IOSSwitch
              checked={view?.attributes?.fixedColumns?.[selectedColumn?.id]}
              // onChange={(e) => {
              //   fixColumnChangeHandler(selectedColumn, e.target.checked);
              // }}
              color="primary"
            />
            {/* )} */}
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

            {column?.type === "LOOKUP" || column?.type === "LOOKUPS" ? (
              isLoading ? (
                <CircularProgress sx={{color: "#449424"}} size={24} />
              ) : (
                <IOSSwitch
                  size="small"
                  checked={!computedColumns?.includes(column?.relation_id)}
                  onChange={(e) => {
                    updateView(
                      !e.target.checked
                        ? data?.tabs?.[selectedTabIndex]?.attributes?.columns ??
                          data?.tabs?.[selectedTabIndex]?.relation?.columns
                          ? [
                              ...(data?.tabs?.[selectedTabIndex]?.attributes
                                ?.columns ??
                                data?.tabs?.[selectedTabIndex]?.relation
                                  ?.columns),
                              column?.relation_id,
                            ]
                          : [column?.relation_id]
                        : (
                            data?.tabs?.[selectedTabIndex]?.attributes
                              ?.columns ??
                            data?.tabs?.[selectedTabIndex]?.relation?.columns
                          )?.filter((el) => el !== column?.relation_id)
                    );
                  }}
                />
              )
            ) : isLoading ? (
              <CircularProgress sx={{color: "#449424"}} size={24} />
            ) : (
              <IOSSwitch
                size="small"
                checked={!computedColumns?.includes(column?.id)}
                onChange={(e) => {
                  updateView(
                    !e.target.checked
                      ? data?.tabs?.[selectedTabIndex]?.attributes?.columns ??
                        data?.tabs?.[selectedTabIndex]?.relation?.columns
                        ? [
                            ...(data?.tabs?.[selectedTabIndex]?.attributes
                              ?.columns ??
                              data?.tabs?.[selectedTabIndex]?.relation
                                ?.columns),
                            column?.id,
                          ]
                        : [column?.id]
                      : (
                          data?.tabs?.[selectedTabIndex]?.attributes?.columns ??
                          data?.tabs?.[selectedTabIndex]?.relation?.columns
                        )?.filter((el) => el !== column?.id)
                  );
                }}
              />
            )}
          </MenuItem>
        </Box>
      </Menu>
    </>
  );
}

export default RelationTableHead;
