import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import DnsIcon from "@mui/icons-material/Dns";
import {
  Box,
  Button,
  CircularProgress,
  Menu,
  Switch,
  Typography,
} from "@mui/material";
import React, {useEffect, useMemo, useState} from "react";
import {useForm, useWatch} from "react-hook-form";
import {useTranslation} from "react-i18next";
import {useQueryClient} from "react-query";
import {useParams} from "react-router-dom";
import constructorViewService from "../../services/constructorViewService";
import {columnIcons} from "../../utils/constants/columnIcons";

export default function GroupByButton({
  selectedTabIndex,
  view,
  fieldsMap,
  relationColumns,
  text = "Tab group",
}) {
  const form = useForm();
  const {tableSlug} = useParams();
  const queryClient = useQueryClient();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const computedColumns = useMemo(() => {
    if (view?.type !== "CALENDAR" && view?.type !== "GANTT") {
      return Object.values(fieldsMap);
    } else {
      return [...Object.values(fieldsMap), ...relationColumns];
    }
  }, [fieldsMap, relationColumns, view?.type]);

  useEffect(() => {
    form.reset({
      group_fields: view?.group_fields ?? [],
    });
  }, [selectedTabIndex, view, form]);

  const [updateLoading, setUpdateLoading] = useState(false);

  const updateView = () => {
    setUpdateLoading(true);
    constructorViewService
      .update(tableSlug, {
        ...view,
        group_fields: form.watch("group_fields"),
      })
      .then(() => {
        queryClient.refetchQueries(["GET_VIEWS_AND_FIELDS"]);
      })
      .finally(() => {
        setUpdateLoading(false);
      });
  };

  const selectedColumns = useWatch({
    control: form.control,
    name: "group_fields",
  });

  const disableAll = () => {
    setUpdateLoading(true);
    constructorViewService
      .update(tableSlug, {
        ...view,
        group_fields: [],
      })
      .then(() => {
        queryClient.refetchQueries(["GET_VIEWS_AND_FIELDS"]);
      })
      .finally(() => {
        setUpdateLoading(false);
        form.setValue("group_fields", []);
      });
  };

  const {i18n} = useTranslation();

  const [updatedColumns, setUpdatedColumns] = useState();
  useEffect(() => {
    setUpdatedColumns(
      computedColumns?.filter(
        (column) =>
          column.type === "LOOKUP" ||
          column.type === "PICK_LIST" ||
          column.type === "LOOKUPS" ||
          column.type === "MULTISELECT"
      )
    );
  }, [computedColumns]);

  const onCheckboxChange = async (val, id, column) => {
    const type = form.getValues("type");

    if (type !== "CALENDAR" && type !== "GANTT") {
      return form.setValue("group_fields", val ? [id] : []);
    }

    if (!val) {
      return form.setValue(
        "group_fields",
        selectedColumns.filter((el) => el !== id)
      );
    }

    if (selectedColumns?.length >= 2) return;

    return form.setValue("group_fields", [...selectedColumns, id]);
  };

  const changeHandler = async (val, id, column) => {
    await onCheckboxChange(val, id, column);
    updateView();
  };

  return (
    <div>
      <Button
        variant={`${
          selectedColumns?.length > 0 || view?.group_fields?.length > 0
            ? "outlined"
            : "text"
        }`}
        style={{
          gap: "5px",
          color:
            selectedColumns?.length > 0 || view?.group_fields?.length > 0
              ? "rgb(0, 122, 255)"
              : "#A8A8A8",
          borderColor:
            selectedColumns?.length > 0 || view?.group_fields?.length > 0
              ? "rgb(0, 122, 255)"
              : "#A8A8A8",
        }}
        onClick={handleClick}>
        {updateLoading ? (
          <Box sx={{display: "flex", width: "22px", height: "22px"}}>
            <CircularProgress
              style={{
                width: "22px",
                height: "22px",
              }}
            />
          </Box>
        ) : (
          <DnsIcon
            color={"#A8A8A8"}
            style={{
              width: "22px",
              height: "22px",
            }}
          />
        )}

        {text}
        {(selectedColumns?.length > 0 || view?.group_fields?.length > 0) && (
          <span>{selectedColumns?.length ?? view?.group_fields?.length}</span>
        )}
        {(selectedColumns?.length > 0 || view?.group_fields?.length > 0) && (
          <button
            style={{
              border: "none",
              background: "none",
              outline: "none",
              cursor: "pointer",
              padding: "0",
              margin: "0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color:
                selectedColumns?.length > 0 || view?.group_fields?.length > 0
                  ? "rgb(0, 122, 255)"
                  : "#A8A8A8",
            }}
            onClick={(e) => {
              e.stopPropagation();
              disableAll();
            }}>
            <CloseRoundedIcon
              style={{
                color:
                  selectedColumns?.length > 0 || view?.group_fields?.length > 0
                    ? "rgb(0, 122, 255)"
                    : "#A8A8A8",
              }}
            />
          </button>
        )}
      </Button>
      <Menu
        open={open}
        onClose={handleClose}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
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
            maxHeight: 300,
            overflowY: "auto",
            padding: "10px 14px",
            minWidth: "200px",
          }}>
          {updatedColumns?.length ? (
            updatedColumns?.map((column) => (
              <div
                style={{
                  padding: "6px 0",
                  // borderBottom: "1px solid #eee",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                  }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}>
                    {column?.type && columnIcons(column?.type)}
                  </div>

                  <span>
                    {column?.attributes?.[`label_${i18n.language}`] ??
                      column.label}
                  </span>
                </div>

                {column?.type === "LOOKUP" || column?.type === "LOOKUPS" ? (
                  <Switch
                    size="small"
                    checked={selectedColumns?.includes(column?.relation_id)}
                    onChange={(e, val) =>
                      changeHandler(val, column.relation_id, column)
                    }
                  />
                ) : (
                  <Switch
                    size="small"
                    checked={selectedColumns?.includes(column?.id)}
                    onChange={(e, val) => changeHandler(val, column.id, column)}
                  />
                )}
              </div>
            ))
          ) : (
            <Box style={{padding: "10px"}}>
              <Typography>No columns to set group!</Typography>
            </Box>
          )}
        </div>
      </Menu>
    </div>
  );
}
