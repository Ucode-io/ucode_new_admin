import AppsIcon from "@mui/icons-material/Apps";
import {Button, CircularProgress, Menu} from "@mui/material";
import React, {useEffect, useMemo, useState} from "react";
import constructorViewService from "../../services/constructorViewService";
import ColumnsTab from "./components/ViewSettings/ColumnsTab";
import {useQueryClient} from "react-query";
import {useParams} from "react-router-dom";

export default function ColumnVisible({
  selectedTabIndex,
  views,
  columns,
  relationColumns,
  isLoading,
  form,
  text = "Columns",
  width = "",
  refetch = () => {},
}) {
  const queryClient = useQueryClient();
  const [anchorEl, setAnchorEl] = useState(null);
  const {tableSlug} = useParams();
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const type = views?.[selectedTabIndex]?.type;
  const computedColumns = useMemo(() => {
    return columns;
  }, [columns, relationColumns, type]);

  const watchedColumns = form.watch("columns");
  const watchedGroupColumns = form.watch("attributes.group_by_columns");
  useEffect(() => {
    form.reset({
      columns:
        computedColumns?.map((el) => ({
          ...el,
          is_checked: views?.[selectedTabIndex]?.columns?.find(
            (column) => column === el.id
          ),
        })) ?? [],
    });
  }, [selectedTabIndex, views, form, computedColumns]);

  const updateView = async () => {
    await constructorViewService
      .update(tableSlug, {
        ...views?.[selectedTabIndex],
        attributes: {
          ...views?.[selectedTabIndex]?.attributes,
        },
        group_by_columns: form
          .getValues("attributes.group_by_columns")
          ?.filter((el) => el?.is_checked)
          ?.map((el) => el.id),
        columns: form
          .getValues("columns")
          ?.filter((el) => el.is_checked)
          ?.map((el) => el.id),
      })
      .then((res) => {
        queryClient.refetchQueries(["GET_VIEWS_AND_FIELDS"]);
        refetch();
      });
  };

  return (
    <div>
      {/* <Badge badgeContent={watchedColumns?.filter((el) => el.is_checked)?.length} color="primary"> */}
      <Button
        // style={{
        //   display: "flex",
        //   alignItems: "center",
        //   gap: 5,
        //   color: "#A8A8A8",
        //   cursor: "pointer",
        //   fontSize: "13px",
        //   fontWeight: 500,
        //   lineHeight: "16px",
        //   letterSpacing: "0em",
        //   textAlign: "left",
        //   padding: "0 10px",
        // }}
        variant={"text"}
        style={{
          gap: "5px",
          color: "#A8A8A8",
          borderColor: "#A8A8A8",
        }}
        // style={{
        //   gap: "5px",
        //   color: "#A8A8A8",
        //   cursor: "pointer",
        //   fontSize: "13px",
        //   fontWeight: 500,
        //   lineHeight: "16px",
        //   letterSpacing: "0em",
        //   textAlign: "left",
        //   padding: "0 10px",
        //   width: width,
        //   borderColor: "#A8A8A8",
        // }}
        onClick={handleClick}>
        <AppsIcon color={"#A8A8A8"} />
        {text}
      </Button>
      {/* </Badge> */}
      <Menu
        open={open}
        onClose={handleClose}
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
              left: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}>
        {isLoading ? (
          <CircularProgress />
        ) : (
          <ColumnsTab
            form={form}
            updateView={updateView}
            isMenu={true}
            views={views}
            selectedTabIndex={selectedTabIndex}
            computedColumns={computedColumns}
            columns={columns}
          />
        )}
      </Menu>
    </div>
  );
}
