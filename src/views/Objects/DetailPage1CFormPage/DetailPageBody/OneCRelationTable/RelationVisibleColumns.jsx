import React, {useEffect, useMemo, useState} from "react";
import {useTranslation} from "react-i18next";
import {CircularProgress, Menu, Switch} from "@mui/material";
import {Container, Draggable} from "react-smooth-dnd";
import LinkIcon from "@mui/icons-material/Link";
import {useParams, useSearchParams} from "react-router-dom";
import menuService from "../../../../../services/menuService";
import layoutService from "../../../../../services/layoutService";
import {applyDrag} from "../../../../../utils/applyDrag";
import {IOSSwitch} from "../../../../../theme/overrides/IosSwitch";
import {columnIcons} from "../../../../../utils/constants/columnIcons";

export default function RelationVisibleColumns({
  currentView,
  fieldsMap,
  getAllData = () => {},
  selectedTabIndex,
  data,
  anchorEl,
  handleClose,
}) {
  const {tableSlug} = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const open = Boolean(anchorEl);
  const {i18n} = useTranslation();
  const {id} = useParams();
  const allFields = useMemo(() => {
    return Object.values(fieldsMap);
  }, [fieldsMap]);
  const [switchLoading, setSwitchLoading] = useState({});

  const [searchParams, setSearchParams] = useSearchParams();
  const [menuItem, setMenuItem] = useState(null);

  const updateView = async (datas, id) => {
    setSwitchLoading((prev) => ({...prev, [id]: true}));

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
      setSwitchLoading((prev) => ({...prev, [id]: false}));
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
    <div>
      <Menu
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        anchorEl={anchorEl}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            mt: 1.5,
            "& .MuiAvatar-root": {
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}>
        <div
          style={{
            minWidth: "320px",
            minHeight: "100px",
            overflowY: "auto",
            padding: "10px 14px",
          }}>
          <div>
            <div
              style={{
                borderBottom: "1px solid #eee",
                display: "flex",
                backgroundColor: "#fff",
              }}>
              <div
                style={{
                  flex: 1,
                  border: 0,
                  display: "flex",
                  alignItems: "center",
                  padding: "8px 0px",
                  margin: "-1px -1px 0 0",
                }}>
                <b>All</b>
              </div>
              <div
                style={{
                  flex: 1,
                  alignItems: "center",
                  padding: "8px 16px",
                  margin: "-1px -1px 0 0",
                  width: 70,
                  border: 0,
                  paddingLeft: 0,
                  paddingRight: 0,
                  display: "flex",
                  justifyContent: "flex-end",
                }}>
                <IOSSwitch
                  size="small"
                  checked={visibleFields?.length === allFields?.length}
                  onChange={(e) => {
                    updateView(
                      e.target.checked
                        ? allFields.map((el) => {
                            if (
                              el?.type === "LOOKUP" ||
                              el?.type === "LOOKUPS"
                            ) {
                              return el.relation_id;
                            } else {
                              return el.id;
                            }
                          })
                        : []
                    );
                  }}
                />
              </div>
            </div>
            <Container
              onDrop={onDrop}
              dropPlaceholder={{className: "drag-row-drop-preview"}}>
              {visibleFields?.map((column, index) => (
                <Draggable key={column?.id}>
                  <div
                    key={column?.id}
                    style={{
                      display: "flex",
                      backgroundColor: "#fff",
                    }}>
                    <div
                      style={{
                        flex: 1,
                        border: 0,
                        display: "flex",
                        alignItems: "center",
                        padding: "8px 0px",
                        margin: "-1px -1px 0 0",
                      }}>
                      <div
                        style={{
                          width: 20,
                          height: 20,
                          marginRight: 5,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}>
                        {column?.type ? (
                          columnIcons(column?.type)
                        ) : (
                          <LinkIcon />
                        )}
                      </div>
                      <p
                        style={{
                          textWrap: "nowrap",
                        }}>
                        {column?.attributes?.[`label_${i18n.language}`] ??
                          column?.label}
                      </p>
                    </div>
                    <div
                      style={{
                        flex: 1,
                        alignItems: "center",
                        padding: "8px 16px",
                        width: 70,
                        border: 0,
                        paddingLeft: 0,
                        paddingRight: 0,
                        display: "flex",
                        justifyContent: "flex-end",
                      }}>
                      {column.type === "LOOKUP" ||
                      column?.type === "LOOKUPS" ? (
                        switchLoading[column.relation_id] ? (
                          <CircularProgress sx={{color: "#449424"}} size={24} />
                        ) : (
                          <IOSSwitch
                            size="small"
                            checked={computedColumns?.includes(
                              column?.relation_id
                            )}
                            onChange={(e) => {
                              updateView(
                                e.target.checked
                                  ? data?.tabs?.[selectedTabIndex]?.attributes
                                      ?.columns ??
                                    data?.tabs?.[selectedTabIndex]?.relation
                                      ?.columns
                                    ? [
                                        ...(data?.tabs[selectedTabIndex]
                                          ?.attributes?.columns ??
                                          data?.tabs?.[selectedTabIndex]
                                            ?.relation?.columns),
                                        column?.relation_id,
                                      ]
                                    : [column?.relation_id]
                                  : (
                                      data?.tabs?.[selectedTabIndex]?.attributes
                                        ?.columns ??
                                      data?.tabs?.[selectedTabIndex]?.relation
                                        ?.columns
                                    )?.filter(
                                      (el) => el !== column?.relation_id
                                    ),
                                column?.relation_id
                              );
                            }}
                          />
                        )
                      ) : switchLoading?.[column?.id] ? (
                        <CircularProgress sx={{color: "#449424"}} size={24} />
                      ) : (
                        <IOSSwitch
                          size="small"
                          checked={computedColumns?.includes(column?.id)}
                          onChange={(e) => {
                            updateView(
                              e.target.checked
                                ? data?.tabs?.[selectedTabIndex]?.attributes
                                    ?.columns ??
                                  data?.tabs?.[selectedTabIndex]?.relation
                                    ?.columns
                                  ? [
                                      ...(data?.tabs[selectedTabIndex]
                                        ?.attributes?.columns ??
                                        data?.tabs?.[selectedTabIndex]?.relation
                                          ?.columns),
                                      column?.id,
                                    ]
                                  : [column?.id]
                                : (
                                    data?.tabs?.[selectedTabIndex]?.attributes
                                      ?.columns ??
                                    data?.tabs?.[selectedTabIndex]?.relation
                                      ?.columns
                                  )?.filter((el) => el !== column?.id),
                              column?.id
                            );
                          }}
                        />
                      )}
                    </div>
                  </div>
                </Draggable>
              ))}

              {unVisibleFields?.map((column, index) => (
                <div
                  key={column.id}
                  style={{
                    display: "flex",
                    backgroundColor: "#fff",
                  }}>
                  <div
                    style={{
                      flex: 1,
                      border: 0,
                      display: "flex",
                      alignItems: "center",
                      padding: "8px 0px",
                      margin: "-1px -1px 0 0",
                    }}>
                    <div
                      style={{
                        width: 20,
                        height: 20,
                        marginRight: 5,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}>
                      {column.type ? columnIcons(column.type) : <LinkIcon />}
                    </div>
                    <p
                      style={{
                        textWrap: "nowrap",
                      }}>
                      {column?.attributes?.[`label_${i18n.language}`] ??
                        column?.label}
                    </p>
                  </div>
                  <div
                    style={{
                      flex: 1,
                      alignItems: "center",
                      padding: "8px 16px",
                      margin: "-1px -1px 0 0",
                      width: 70,
                      border: 0,
                      paddingLeft: 0,
                      paddingRight: 0,
                      display: "flex",
                      justifyContent: "flex-end",
                    }}>
                    {column?.type === "LOOKUP" || column?.type === "LOOKUPS" ? (
                      switchLoading?.[column?.relation_id] ? (
                        <CircularProgress sx={{color: "#449424"}} size={24} />
                      ) : (
                        <IOSSwitch
                          size="small"
                          checked={computedColumns?.includes(
                            column?.relation_id
                          )}
                          onChange={(e) => {
                            updateView(
                              e.target.checked
                                ? data?.tabs?.[selectedTabIndex]?.attributes
                                    ?.columns ??
                                  data?.tabs?.[selectedTabIndex]?.relation
                                    ?.columns
                                  ? [
                                      ...(data?.tabs?.[selectedTabIndex]
                                        ?.attributes?.columns ??
                                        data?.tabs?.[selectedTabIndex]?.relation
                                          ?.columns),
                                      column?.relation_id,
                                    ]
                                  : [column?.relation_id]
                                : (
                                    data?.tabs?.[selectedTabIndex]?.attributes
                                      ?.columns ??
                                    data?.tabs?.[selectedTabIndex]?.relation
                                      ?.columns
                                  )?.filter((el) => el !== column?.relation_id)
                            );
                          }}
                        />
                      )
                    ) : switchLoading?.[column?.id] ? (
                      <CircularProgress sx={{color: "#449424"}} size={24} />
                    ) : (
                      <IOSSwitch
                        size="small"
                        checked={computedColumns?.includes(column?.id)}
                        onChange={(e) => {
                          updateView(
                            e.target.checked
                              ? data?.tabs?.[selectedTabIndex]?.attributes
                                  ?.columns ??
                                data?.tabs?.[selectedTabIndex]?.relation
                                  ?.columns
                                ? [
                                    ...(data?.tabs?.[selectedTabIndex]
                                      ?.attributes?.columns ??
                                      data?.tabs?.[selectedTabIndex]?.relation
                                        ?.columns),
                                    column?.id,
                                  ]
                                : [column?.id]
                              : (
                                  data?.tabs?.[selectedTabIndex]?.attributes
                                    ?.columns ??
                                  data?.tabs?.[selectedTabIndex]?.relation
                                    ?.columns
                                )?.filter((el) => el !== column?.id)
                          );
                        }}
                      />
                    )}
                  </div>
                </div>
              ))}
            </Container>
          </div>
        </div>
      </Menu>
    </div>
  );
}
