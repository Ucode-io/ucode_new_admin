import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import ViewListIcon from "@mui/icons-material/ViewList";
import { Box, Button, CircularProgress, Menu, Switch } from "@mui/material";
import React, { useMemo, useState } from "react";
import { useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import constructorViewService from "../../../../services/constructorViewService";
import { columnIcons } from "../../../../utils/constants/columnIcons";
import style from "./style.module.scss";

export default function FixColumnsTableView({ view, fieldsMap }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const queryClient = useQueryClient();
  const open = Boolean(anchorEl);
  const { tableSlug } = useParams();
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const updateView = (data) => {
    setIsLoading(true);
    constructorViewService
      .update(tableSlug, data)
      .then((res) => {
        queryClient.refetchQueries(["GET_VIEWS_AND_FIELDS"]);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const convertArrayToObject = (arr) => {
    const result = {};
    arr.forEach((str) => {
      result[str] = true;
    });
    return result;
  };

  const changeHandler = (column, e) => {
    let a = [...Object.keys(view?.attributes?.fixedColumns ?? {})];
    if (e) {
      a.push(column.id);
    } else {
      a = a.filter((el) => el !== column.id);
    }

    updateView({
      ...view,
      attributes: {
        ...view.attributes,
        fixedColumns: convertArrayToObject(a),
      },
    });
  };

  const removeFixedColumns = () => {
    updateView({
      ...view,
      attributes: {
        ...view.attributes,
        fixedColumns: {},
      },
    });
  };

  const allColumns = useMemo(() => {
    const checkedElements = Object.values(fieldsMap)
      .filter((column) => {
        return view?.columns?.find((el) => el === column?.id);
      })
      ?.filter((column) =>
        Object.keys(view?.attributes?.fixedColumns ?? {}).includes(column?.id)
      );

    const uncheckedElements = Object.values(fieldsMap)
      .filter((column) => {
        return view?.columns?.find((el) => el === column?.id);
      })
      ?.filter(
        (column) =>
          !Object.keys(view?.attributes?.fixedColumns ?? {}).includes(
            column?.id
          )
      );

    return [...checkedElements, ...uncheckedElements];
  }, [fieldsMap, view?.columns, view?.attributes?.fixedColumns]);

  const badgeCount = useMemo(() => {
    return Object.values(view?.attributes?.fixedColumns || {}).length;
  }, [view]);

  return (
    <>
      <Button
        onClick={handleClick}
        variant={badgeCount > 0 ? "outlined" : "text"}
        style={{
          gap: "5px",
          color: badgeCount > 0 ? "rgb(0, 122, 255)" : "#A8A8A8",
          borderColor: badgeCount > 0 ? "rgb(0, 122, 255)" : "#A8A8A8",
        }}
      >
        {isLoading ? (
          <Box sx={{ display: "flex", width: "22px", height: "22px" }}>
            <CircularProgress
              style={{
                width: "22px",
                height: "22px",
              }}
            />
          </Box>
        ) : (
          <ViewListIcon
            style={{
              color: badgeCount > 0 ? "rgb(0, 122, 255)" : "#A8A8A8",
              width: "22px",
              height: "22px",
            }}
          />
        )}
        Fix col's
        {badgeCount > 0 && <span>{badgeCount}</span>}
        {badgeCount > 0 && (
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
              color: badgeCount > 0 ? "rgb(0, 122, 255)" : "#A8A8A8",
            }}
            onClick={(e) => {
              e.stopPropagation();
              removeFixedColumns();
            }}
          >
            <CloseRoundedIcon />
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
        }}
      >
        <div
          className={style.menuItems}
          style={{
            maxHeight: 300,
            overflowY: "auto",
          }}
        >
          {allColumns?.map((column) => (
            <div className={style.menuItem}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {column?.type && columnIcons(column?.type)}
                </div>

                <span>{column?.label}</span>
              </div>

              <Switch
                size="small"
                onChange={(e) => {
                  changeHandler(column, e.target.checked);
                }}
                checked={
                  Object.keys(view?.attributes?.fixedColumns ?? {})?.find(
                    (el) => el === column.id
                  )
                    ? true
                    : false
                }
              />
            </div>
          ))}
        </div>
      </Menu>
    </>
  );
}
