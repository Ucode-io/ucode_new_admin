import LinkIcon from "@mui/icons-material/Link";
import ViewColumnOutlinedIcon from "@mui/icons-material/ViewColumnOutlined";
import {Box, Button, CircularProgress, Menu, Switch} from "@mui/material";
import React, {useMemo, useState} from "react";
import {useTranslation} from "react-i18next";
import {useQueryClient} from "react-query";
import {useParams} from "react-router-dom";
import {Container, Draggable} from "react-smooth-dnd";
import constructorViewService from "../../services/constructorViewService";
import {applyDrag} from "../../utils/applyDrag";
import {columnIcons} from "../../utils/constants/columnIcons";

export default function VisibleColumnsButton({currentView, fieldsMap}) {
  const queryClient = useQueryClient();
  const [anchorEl, setAnchorEl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const open = Boolean(anchorEl);
  const {tableSlug} = useParams();
  const {i18n} = useTranslation();

  const allFields = useMemo(() => {
    return Object.values(fieldsMap);
  }, [fieldsMap]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const updateView = (data) => {
    setIsLoading(true);
    constructorViewService
      .update(tableSlug, {
        ...currentView,
        columns: data,
      })
      .then(() => {
        queryClient.refetchQueries(["GET_VIEWS_AND_FIELDS"]);
      })
      .finally(() => {
        setIsLoading(false);
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
    return allFields.filter((field) => {
      if (field?.type === "LOOKUP" || field?.type === "LOOKUPS") {
        return !currentView?.columns?.includes(field.relation_id);
      } else {
        return !currentView?.columns?.includes(field.id);
      }
    });
  }, [allFields, currentView?.columns]);

  const onDrop = (dropResult) => {
    const result = applyDrag(visibleFields, dropResult);
    const computedResult = result?.filter((item) => {
      if (item?.type === "LOOKUP" || item?.type === "LOOKUPS") {
        return item?.relation_id;
      } else {
        return item?.id;
      }
    });

    if (computedResult) {
      updateView(
        computedResult?.map((el) => {
          if (el?.type === "LOOKUP" || el?.type === "LOOKUPS") {
            return el?.relation_id;
          } else {
            return el?.id;
          }
        })
      );
    }
  };

  return (
    <div>
      <Button
        variant={"text"}
        style={{
          gap: "5px",
          color: "#A8A8A8",
          borderColor: "#A8A8A8",
        }}
        onClick={handleClick}>
        {isLoading ? (
          <Box sx={{display: "flex", width: "22px", height: "22px"}}>
            <CircularProgress
              style={{
                width: "22px",
                height: "22px",
              }}
            />
          </Box>
        ) : (
          <ViewColumnOutlinedIcon
            style={{
              color: "#A8A8A8",
              width: "22px",
              height: "22px",
            }}
          />
        )}
        Columns
      </Button>
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
            minWidth: 200,
            maxHeight: 300,
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
                <Switch
                  size="small"
                  checked={visibleFields.length === allFields.length}
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
              {visibleFields.map((column, index) => (
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
                        minWidth: "200px",
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
                      {column?.attributes?.[`label_${i18n.language}`] ||
                        column?.attributes?.[`label_${i18n.language}`] ||
                        column?.label}
                    </div>
                    <div
                      style={{
                        flex: 1,
                        alignItems: "center",
                        padding: "8px 0px",
                        margin: "-1px -1px 0 0",
                        width: 70,
                        border: 0,
                        paddingLeft: 0,
                        paddingRight: 0,
                        display: "flex",
                        justifyContent: "flex-end",
                        width: "70px",
                      }}>
                      {column?.type === "LOOKUP" ||
                      column?.type === "LOOKUPS" ? (
                        <Switch
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
                      ) : (
                        <Switch
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
                    {column?.attributes?.[`label_${i18n.language}`] ||
                      column?.attributes?.[`label_${i18n.language}`] ||
                      column.label}
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
                      <Switch
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
                    ) : (
                      <Switch
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
    </div>
  );
}
