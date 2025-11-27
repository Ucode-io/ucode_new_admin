import {Box, Menu, MenuItem, Typography, CircularProgress} from "@mui/material";
import React, {useMemo, useState} from "react";
import {useQueryClient} from "react-query";
import {useParams} from "react-router-dom";
import constructorViewService from "../../../../services/constructorViewService";
import {IOSSwitch} from "../../../../theme/overrides/IosSwitch";
import {Container, Draggable} from "react-smooth-dnd";
import {applyDrag} from "../../../../utils/applyDrag";
import styles from "./style.module.scss";
import {useTranslation} from "react-i18next";

function GroupSwitchMenu({anchorEl, handleClose, open, view, fieldsMap}) {
  const {tableSlug} = useParams();
  const {i18n} = useTranslation();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [switchLoading, setSwitchLoading] = useState({});

  const allFields = useMemo(() => {
    return Object.values(fieldsMap);
  }, [fieldsMap]);

  const updateView = (data, fieldId) => {
    setSwitchLoading((prev) => ({...prev, [fieldId]: true}));
    constructorViewService
      .update(tableSlug, {
        ...view,
        columns: data,
      })
      .then(() => {
        queryClient.refetchQueries(["GET_VIEWS_AND_FIELDS", tableSlug]);
      })
      .finally(() => {
        setLoading(false);
        setSwitchLoading((prev) => ({...prev, [fieldId]: false}));
      });
  };

  const onDrop = (dropResult) => {
    setLoading(true);
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

  const unVisibleFields = useMemo(() => {
    return allFields.filter((field) => {
      if (field?.type === "LOOKUP" || field?.type === "LOOKUPS") {
        return !view?.columns?.includes(field.relation_id);
      } else {
        return !view?.columns?.includes(field.id);
      }
    });
  }, [allFields, view?.columns]);

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

  return (
    <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
      <Box sx={{width: "360px", position: "relative", zIndex: 9}}>
        <Box>
          <MenuItem
            sx={{
              display: "flex",
              justifyContent: "space-between",
              padding: "10px 14px",
              borderBottom: "1px solid #d0d5dd",
            }}>
            <Typography
              sx={{
                fontSize: "14px",
                color: "#101828",
                fontWeight: 500,
              }}>
              Показать все
            </Typography>
            <IOSSwitch
              checked={visibleFields.length === allFields.length}
              onChange={(e) => {
                updateView(
                  e.target.checked
                    ? allFields.map((el) => {
                        if (el?.type === "LOOKUP" || el?.type === "LOOKUPS") {
                          return el.relation_id;
                        } else {
                          return el.id;
                        }
                      })
                    : []
                );
              }}
            />
          </MenuItem>
          <Box sx={{height: "235px", overflow: "auto"}}>
            <Container
              onDrop={onDrop}
              dropPlaceholder={{className: "drag-row-drop-preview"}}>
              {visibleFields.map((column, index) => (
                <Draggable key={column?.id}>
                  <MenuItem
                    key={index}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "10px 14px",
                    }}>
                    <Typography
                      sx={{
                        color: "#101828",
                        fontWeight: 500,
                        fontSize: "14px",
                      }}>
                      {column?.attributes?.[`label_${i18n?.language}`] ||
                        column?.label}
                    </Typography>
                    {column?.type === "LOOKUP" || column?.type === "LOOKUPS" ? (
                      switchLoading[column.relation_id] ? (
                        <CircularProgress sx={{color: "#449424"}} size={24} />
                      ) : (
                        <IOSSwitch
                          size="small"
                          checked={view?.columns?.includes(column?.relation_id)}
                          onChange={(e) => {
                            updateView(
                              e.target.checked
                                ? [...view?.columns, column?.relation_id]
                                : view?.columns?.filter(
                                    (el) => el !== column?.relation_id
                                  ),
                              column?.relation_id
                            );
                          }}
                        />
                      )
                    ) : switchLoading[column.id] ? (
                      <CircularProgress sx={{color: "#449424"}} size={24} />
                    ) : (
                      <IOSSwitch
                        size="small"
                        checked={view?.columns?.includes(column?.id)}
                        onChange={(e) => {
                          updateView(
                            e.target.checked
                              ? [...view?.columns, column?.id]
                              : view?.columns?.filter(
                                  (el) => el !== column?.id
                                ),
                            column?.id
                          );
                        }}
                      />
                    )}
                  </MenuItem>
                </Draggable>
              ))}
              {unVisibleFields.map((column, index) => (
                <MenuItem
                  key={index}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "10px 14px",
                  }}>
                  <Typography
                    sx={{
                      color: "#101828",
                      fontWeight: 500,
                      fontSize: "14px",
                    }}>
                    {column?.attributes?.[`label_${i18n?.language}`] ||
                      column?.label}
                  </Typography>
                  {column?.type === "LOOKUP" || column?.type === "LOOKUPS" ? (
                    switchLoading[column.relation_id] ? (
                      <CircularProgress sx={{color: "#449424"}} size={24} />
                    ) : (
                      <IOSSwitch
                        size="small"
                        checked={view?.columns?.includes(column?.relation_id)}
                        onChange={(e) => {
                          updateView(
                            e.target.checked
                              ? [...view?.columns, column?.relation_id]
                              : view?.columns?.filter(
                                  (el) => el !== column?.relation_id
                                ),
                            column?.relation_id
                          );
                        }}
                      />
                    )
                  ) : switchLoading[column.id] ? (
                    <CircularProgress sx={{color: "#449424"}} size={24} />
                  ) : (
                    <IOSSwitch
                      size="small"
                      checked={view?.columns?.includes(column?.id)}
                      onChange={(e) => {
                        updateView(
                          e.target.checked
                            ? [...view?.columns, column?.id]
                            : view?.columns?.filter((el) => el !== column?.id),
                          column?.id
                        );
                      }}
                    />
                  )}
                </MenuItem>
              ))}
            </Container>
          </Box>
        </Box>
        {loading && (
          <div className={styles.columnsLoading}>
            <CircularProgress sx={{color: "#449424", opacity: "1"}} />
          </div>
        )}
      </Box>
    </Menu>
  );
}

export default GroupSwitchMenu;
