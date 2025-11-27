import {CircularProgress, Menu} from "@mui/material";
import React, {useMemo, useState} from "react";
import {IOSSwitch} from "../../../../theme/overrides/IosSwitch";
import {Container, Draggable} from "react-smooth-dnd";
import {columnIcons} from "../../../../utils/constants/columnIcons";
import {useTranslation} from "react-i18next";
import constructorViewService from "../../../../services/constructorViewService";
import {useQueryClient} from "react-query";

function DetailRelationVisibleColumns({
  fieldsMap,
  currentView,
  handleColumnClose,
  anchorEl,
  open,
  fields,
  relatedTableSlug,
}) {
  const [switchLoading, setSwitchLoading] = useState({});
  const {i18n} = useTranslation();
  const queryClient = useQueryClient();

  const allFields = useMemo(() => {
    return Object.values(fieldsMap);
  }, [fieldsMap]);

  const updateView = async (datas) => {
    await constructorViewService
      .update(relatedTableSlug, {
        ...currentView,
        attributes: {
          ...currentView?.attributes,
        },
        columns: datas,
      })
      .then((res) => {
        queryClient.refetchQueries(["GET_VIEWS_AND_FIELDS_LIST"]);
      });
  };

  const visibleFields = useMemo(() => {
    return (
      currentView?.columns
        ?.map((id) => fieldsMap[id])
        .filter((el) => {
          if (el?.type === "LOOKUP" || el?.type === "LOOKUPS") {
            return el?.relation_id;
          } else {
            return el?.id;
          }
        }) ?? []
    );
  }, [currentView?.columns, fieldsMap]);

  const unVisibleFields = useMemo(() => {
    return fields.filter((field) => {
      if (field?.type === "LOOKUP" || field?.type === "LOOKUPS") {
        return !currentView?.columns?.includes(field.relation_id);
      } else {
        return !currentView?.columns?.includes(field.id);
      }
    });
  }, [fields, currentView?.columns]);

  const onDrop = (dropResult) => {};

  return (
    <>
      <Menu
        open={open}
        onClose={handleColumnClose}
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
                }}>
                <b>All</b>
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
                <IOSSwitch
                  size="small"
                  checked={visibleFields?.length === allFields?.length}
                  onChange={(e) => {
                    updateView(
                      e.target.checked
                        ? fields.map((el) => {
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
                            checked={currentView?.columns?.includes(
                              column?.relation_id
                            )}
                            onChange={(e) => {
                              updateView(
                                e.target.checked
                                  ? [
                                      ...currentView?.columns,
                                      column?.relation_id,
                                    ]
                                  : currentView?.columns?.filter(
                                      (el) => el !== column?.relation_id
                                    )
                              );
                            }}
                          />
                        )
                      ) : switchLoading?.[column?.id] ? (
                        <CircularProgress sx={{color: "#449424"}} size={24} />
                      ) : (
                        <IOSSwitch
                          size="small"
                          checked={currentView?.columns?.includes(column?.id)}
                          onChange={(e) => {
                            updateView(
                              e.target.checked
                                ? [...currentView?.columns, column?.id]
                                : currentView?.columns?.filter(
                                    (el) => el !== column?.id
                                  )
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
                          checked={currentView?.columns?.includes(
                            column?.relation_id
                          )}
                          onChange={(e) => {
                            updateView(
                              e.target.checked
                                ? [...currentView?.columns, column?.relation_id]
                                : currentView?.columns?.filter(
                                    (el) => el !== column?.relation_id
                                  )
                            );
                          }}
                        />
                      )
                    ) : switchLoading?.[column?.id] ? (
                      <CircularProgress sx={{color: "#449424"}} size={24} />
                    ) : (
                      <IOSSwitch
                        size="small"
                        checked={currentView?.columns?.includes(column?.id)}
                        onChange={(e) => {
                          updateView(
                            e.target.checked
                              ? [...currentView?.columns, column?.id]
                              : currentView?.columns?.filter(
                                  (el) => el !== column?.id
                                )
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
    </>
  );
}

export default DetailRelationVisibleColumns;
