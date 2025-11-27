import AppsIcon from "@mui/icons-material/Apps";
import {Button, CircularProgress, Menu} from "@mui/material";
import React, {useEffect, useMemo, useState} from "react";
import {useQueryClient} from "react-query";
import constructorViewService from "../../services/constructorViewService";
import GroupByTab from "./components/ViewSettings/GroupByTab";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { useParams } from "react-router-dom";

export default function GroupColumnVisible({
  selectedTabIndex,
  views,
  columns,
  relationColumns,
  isLoading,
  form,
}) {
  const queryClient = useQueryClient();
  const [anchorEl, setAnchorEl] = useState(null);
  const [checkedColumns, setCheckedColumns] = useState(null);
  const {tableSlug} = useParams();
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const watchedGroupColumns = form.watch("attributes.group_by_columns");
  const watchedColumns = form.watch("columns");
  const group_by = views?.[selectedTabIndex]?.attributes.group_by_columns;
  const type = views?.[selectedTabIndex]?.type;

  useEffect(() => {
    setCheckedColumns(
      watchedGroupColumns?.filter((item) => item?.is_checked === true)
    );
  }, [watchedGroupColumns]);

  const computedColumns = useMemo(() => {
    if (type !== "CALENDAR" && type !== "GANTT") {
      return columns;
    } else {
      return [...columns, ...relationColumns];
    }
  }, [columns, relationColumns, type]);

  useEffect(() => {
    form.reset({
      attributes: {
        group_by_columns: columns?.map((item) => {
          return {
            ...item,
            is_checked: group_by?.find((el) => el === item.id) ? true : false,
          };
        }),
      },
      columns:
        computedColumns?.map((el) => ({
          ...el,
          is_checked: views?.[selectedTabIndex]?.columns?.find(
            (column) => column === el.id
          ),
        })) ?? [],
    });
  }, [selectedTabIndex, views, form, group_by, columns]);

  const disableAll = () => {
    constructorViewService
      .update(tableSlug, {
        ...views?.[selectedTabIndex],
        attributes: {
          group_by_columns: [],
        },
        columns: watchedColumns
          ?.filter((el) => el?.is_checked)
          ?.map((el) => el.id),
      })
      .then(() => {
        queryClient.refetchQueries(["GET_VIEWS_AND_FIELDS"]);
        queryClient.refetchQueries(["GET_OBJECTS_LIST"]);
        setCheckedColumns(null);
        form.reset({
          attributes: {
            ...views?.[selectedTabIndex]?.attributes,
            group_by_columns: columns?.map((item) => {
              return {
                ...item,
                is_checked: false,
              };
            }),
          },
          columns:
            computedColumns?.map((el) => ({
              ...el,
              is_checked: views?.[selectedTabIndex]?.columns?.find(
                (column) => column === el.id
              ),
            })) ?? [],
        });
      });
  };

  const updateView = () => {
    constructorViewService
      .update(tableSlug, {
        ...views?.[selectedTabIndex],
        attributes: {
          ...views?.[selectedTabIndex]?.attributes,
          group_by_columns: watchedGroupColumns
            ?.filter((el) => el?.is_checked)
            ?.map((el) => el.id),
        },
        columns: watchedColumns
          ?.filter((el) => el?.is_checked)
          ?.map((el) => el.id),
      })
      .then(() => {
        queryClient.refetchQueries(["GET_VIEWS_AND_FIELDS"]);
        queryClient.refetchQueries(["GET_OBJECTS_LIST"]);
      });
  };

  return (
    <div>
      <Button
        variant={`${
          form
            .watch("attributes.group_by_columns")
            ?.filter((el) => el?.is_checked)?.length > 0
            ? "outlined"
            : "text"
        }`}
        style={{
          gap: "5px",
          color:
            form
              .watch("attributes.group_by_columns")
              ?.filter((el) => el?.is_checked)?.length > 0
              ? "rgb(0, 122, 255)"
              : "#A8A8A8",
          borderColor:
            form
              .watch("attributes.group_by_columns")
              ?.filter((el) => el?.is_checked)?.length > 0
              ? "rgb(0, 122, 255)"
              : "#A8A8A8",
        }}
        onClick={handleClick}
      >
        <AppsIcon
          style={{
            color:
              form
                .watch("attributes.group_by_columns")
                ?.filter((el) => el?.is_checked)?.length > 0
                ? "rgb(0, 122, 255)"
                : "#A8A8A8",
          }}
        />
        Group
        {checkedColumns?.length > 0 && <span>{checkedColumns?.length}</span>}
        {checkedColumns?.length > 0 && (
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
                checkedColumns?.length > 0 ? "rgb(0, 122, 255)" : "#A8A8A8",
            }}
            onClick={(e) => {
              e.stopPropagation();
              disableAll();
            }}
          >
            <CloseRoundedIcon
              style={{
                color:
                  checkedColumns?.length > 0 ? "rgb(0, 122, 255)" : "#A8A8A8",
              }}
            />
          </button>
        )}
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
        }}
      >
        {isLoading ? (
          <CircularProgress />
        ) : (
          <GroupByTab form={form} updateView={updateView} isMenu={true} />
        )}
      </Menu>
    </div>
  );
}
