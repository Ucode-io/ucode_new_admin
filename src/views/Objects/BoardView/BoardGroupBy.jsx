import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import LayersOutlinedIcon from "@mui/icons-material/LayersOutlined";
import { Button, CircularProgress, Menu } from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useQuery, useQueryClient } from "react-query";
import constructorViewService from "../../../services/constructorViewService";
import BoardGroupsTab from "./BoardGroupsTab";
import { useParams } from "react-router-dom";
import constructorTableService from "../../../services/constructorTableService";

export default function BoardGroupButton({
  selectedTabIndex,
  text = "Tab group",
  queryGenerator,
  groupField,
  filters,
}) {
  const form = useForm();
  const { tableSlug } = useParams();
  const queryClient = useQueryClient();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const {
    data: { views, columns, relationColumns } = {
      views: [],
      columns: [],
      relationColumns: [],
    },
    isLoading,
  } = useQuery({
    queryKey: [
      "GET_TABLE_INFO",
      {
        tableSlug,
      },
    ],
    queryFn: () => {
      return constructorTableService.getTableInfo(tableSlug, {
        data: {},
      });
    },
    select: (res) => {
      return {
        views: res?.data?.views ?? [],
        columns: res?.data?.fields ?? [],
        relationColumns:
          res?.data?.relation_fields?.map((el) => ({
            ...el,
            label: `${el.label} (${el.table_label})`,
          })) ?? [],
      };
    },
  });

  const type = views?.[selectedTabIndex]?.type;

  const computedColumns = useMemo(() => {
    if (type !== "CALENDAR" && type !== "GANTT") {
      return columns;
    } else {
      return [...columns, ...relationColumns];
    }
  }, [columns, relationColumns, type]);

  useEffect(() => {
    form.setValue("group_fields", views?.[selectedTabIndex]?.group_fields);
  }, [selectedTabIndex, views, form]);

  const [updateLoading, setUpdateLoading] = useState(false);

  const { data: tabs, isLoading: tabsLoader } = useQuery(
    queryGenerator(groupField, filters)
  );

  useEffect(() => {
    if (tabs && anchorEl) {
      updateView(tabs);
    }
  }, [tabs]);

  const updateView = (updatedTabs) => {
    delete views?.[selectedTabIndex].attributes.tabs;
    setUpdateLoading(true);
    constructorViewService
      .update(tableSlug, {
        ...views?.[selectedTabIndex],
        group_fields: form.watch("group_fields"),
        attributes: {
          tabs: updatedTabs,
          ...views?.[selectedTabIndex].attributes,
        },
      })
      .then(() => {
        queryClient.refetchQueries(["GET_VIEWS_AND_FIELDS"]);
        queryClient.refetchQueries(["GET_OBJECT_LIST_ALL"]);
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
        ...views?.[selectedTabIndex],
        attributes: {
          tabs: [],
          ...views?.[selectedTabIndex].attributes,
        },
        group_fields: [],
      })
      .then(() => {
        queryClient.refetchQueries(["GET_VIEWS_AND_FIELDS"]);
        queryClient.refetchQueries(["GET_OBJECT_LIST_ALL"]);
      })
      .finally(() => {
        setUpdateLoading(false);
        form.setValue("group_fields", []);
      });
  };

  return (
    <div>
      <Button
        variant={`${selectedColumns?.length > 0 ? "outlined" : "text"}`}
        style={{
          gap: "5px",
          color: selectedColumns?.length > 0 ? "rgb(0, 122, 255)" : "#A8A8A8",
          borderColor:
            selectedColumns?.length > 0 ? "rgb(0, 122, 255)" : "#A8A8A8",
        }}
        onClick={handleClick}
      >
        <LayersOutlinedIcon color={"#A8A8A8"} />
        {text}
        {selectedColumns?.length > 0 && <span>{selectedColumns?.length}</span>}
        {selectedColumns?.length > 0 && (
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
                selectedColumns?.length > 0 ? "rgb(0, 122, 255)" : "#A8A8A8",
            }}
            onClick={(e) => {
              e.stopPropagation();
              disableAll();
            }}
          >
            <CloseRoundedIcon
              style={{
                color:
                  selectedColumns?.length > 0 ? "rgb(0, 122, 255)" : "#A8A8A8",
              }}
            />
          </button>
        )}
      </Button>
      <Menu
        open={open}
        onClose={handleClose}
        anchorEl={anchorEl}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            "& .MuiAvatar-root": {
              // width: 100,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              left: 14,
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
          <BoardGroupsTab
            columns={computedColumns}
            isLoading={isLoading}
            updateLoading={updateLoading}
            updateView={updateView}
            selectedView={views?.[selectedTabIndex]}
            form={form}
          />
        )}
      </Menu>
    </div>
  );
}
