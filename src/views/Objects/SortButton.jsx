import ClearIcon from "@mui/icons-material/Clear";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import SortIcon from "@mui/icons-material/Sort";
import { Button, Menu } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import SortMenuRow from "./SortMenuRow";
import style from "./style.module.scss";

export default function SortButton({ fieldsMap, setSortedDatas }) {
  const form = useForm({
    defaultValues: {
      sort: [
        {
          field: "",
          order: "ASC",
        },
      ],
    },
  });

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const typeSorts = [
    {
      label: "A -> Z",
      value: "ASC",
    },
    {
      label: "Z -> A",
      value: "DESC",
    },
  ];

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "sort",
  });

  const watchedSorts = useWatch({
    control: form.control,
    name: "sort",
  });

  useEffect(() => {
    setSortedDatas(watchedSorts);
  }, [watchedSorts, form, setSortedDatas]);

  return (
    <div>
      <Button
        variant={
          watchedSorts.filter((el) => el.field !== "")?.length > 0
            ? "outlined"
            : "text"
        }
        style={{
          gap: "5px",
          color:
            watchedSorts.filter((el) => el.field !== "")?.length > 0
              ? "rgb(0, 122, 255)"
              : "#A8A8A8",
          borderColor:
            watchedSorts.filter((el) => el.field !== "")?.length > 0
              ? "rgb(0, 122, 255)"
              : "#A8A8A8",
        }}
        onClick={handleClick}
      >
        <SortIcon color={"#A8A8A8"} />
        Sort
        {watchedSorts.filter((el) => el.field !== "")?.length > 0 && (
          <span>{watchedSorts.filter((el) => el.field !== "")?.length}</span>
        )}
        {watchedSorts.filter((el) => el.field !== "")?.length > 0 && (
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
                watchedSorts.filter((el) => el.field !== "")?.length > 0
                  ? "rgb(0, 122, 255)"
                  : "#A8A8A8",
            }}
            onClick={(e) => {
              e.stopPropagation();
              form.reset({
                sort: [
                  {
                    field: "",
                    order: "ASC",
                  },
                ],
              });
            }}
          >
            <CloseRoundedIcon
              style={{
                color:
                  watchedSorts.filter((el) => el.field !== "")?.length > 0
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
          style={{
            padding: "10px",
          }}
        >
          <div
            className={style.menuItems}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            {fields.map((field, index) => (
              <div
                key={field.id}
                className={style.menuItem}
                style={{
                  display: "flex",
                  gap: "10px",
                }}
              >
                <SortMenuRow
                  computedColumns={Object.values(fieldsMap)}
                  index={index}
                  form={form}
                  typeSorts={typeSorts}
                />

                <Button onClick={() => remove(index)}>
                  <ClearIcon />
                </Button>
              </div>
            ))}

            <Button
              onClick={() => {
                append({
                  field: "",
                  order: "ASC",
                });
              }}
            >
              + Add sort field
            </Button>
          </div>
        </div>
      </Menu>
    </div>
  );
}
