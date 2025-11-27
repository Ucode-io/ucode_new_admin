import { Box, Button, CircularProgress, Menu } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useQueryClient } from "react-query";
import constructorViewService from "../../../services/constructorViewService";
import { useForm } from "react-hook-form";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import CalendarScedule from "./CalendarScedule";
import RestoreIcon from "@mui/icons-material/Restore";
export default function CalendarSceduleVisible({
  selectedTabIndex,
  views,
  columns,
  isLoading,
  width = "",
  text = "",
  initialValues,
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const form = useForm();
  const open = Boolean(anchorEl);
  const { tableSlug } = useParams();
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const queryClient = useQueryClient();

  const onSubmit = (values) => {
    const computedValues = {
      ...values,
      ...views?.[selectedTabIndex],
      disable_dates: values.disable_dates,
      time_interval: values.time_interval,
      status_field_slug: values.status_field_slug,
      calendar_from_slug: values.calendar_from_slug,
      calendar_to_slug: values.calendar_to_slug,
    };
    constructorViewService.update(tableSlug, computedValues).then(() => {
      queryClient.refetchQueries(["GET_VIEWS_AND_FIELDS"]);
      handleClose();
    });
  };
  useEffect(() => {
    form.reset({
      ...getInitialValues(initialValues),
      filters: [],
    });
  }, [initialValues, tableSlug, form]);

  const getInitialValues = (initialValues) => {
    if (initialValues === "NEW")
      return {
        disable_dates: {
          day_slug: "",
          table_slug: "",
          time_from_slug: "",
          time_to_slug: "",
        },
      };
    return {
      disable_dates: {
        day_slug: initialValues?.disable_dates?.day_slug ?? "",
        table_slug: initialValues?.disable_dates?.table_slug ?? "",
        time_from_slug: initialValues?.disable_dates?.time_from_slug ?? "",
        time_to_slug: initialValues?.disable_dates?.time_to_slug ?? "",
      },
      calendar_from_slug: initialValues?.calendar_from_slug ?? "",
      calendar_to_slug: initialValues?.calendar_to_slug ?? "",
      status_field_slug: initialValues?.status_field_slug ?? "",
      time_interval: initialValues?.time_interval ?? 60,
    };
  };

  return (
    <div>
      <Button
        style={{
          display: "flex",
          alignItems: "center",
          gap: 5,
          color: "#A8A8A8",
          cursor: "pointer",
          fontSize: "13px",
          fontWeight: 500,
          lineHeight: "16px",
          letterSpacing: "0em",
          textAlign: "left",
          width: width,
        }}
        onClick={handleClick}
      >
        <RestoreIcon color={"#A8A8A8"} />
        {text}
      </Button>

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
        }}
      >
        {isLoading ? (
          <CircularProgress />
        ) : (
          <>
            <CalendarScedule
              form={form}
              columns={columns}
              children={
                <Box
                  style={{
                    padding: "7px 10px 0 10px",
                  }}
                >
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={form.handleSubmit(onSubmit)}
                  >
                    Save
                  </Button>
                </Box>
              }
            />
          </>
        )}
      </Menu>
    </div>
  );
}
