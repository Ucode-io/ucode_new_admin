import React from "react";
import HFTextEditor from "../FormElements/HFTextEditor";
import {Box, Button, Modal, Popover} from "@mui/material";
import ZoomOutMapIcon from "@mui/icons-material/ZoomOutMap";
import {useWatch} from "react-hook-form";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "none",
  borderRadius: "8px",
  boxShadow: 24,
  p: 4,
};

export default function MultiLineCellFormElement({
  control,
  computedSlug,
  isWrapField,
  updateObject,
  isNewTableView = false,
  field,
  isDisabled,
  ...props
}) {
  // const [open, setOpen] = React.useState(false);
  // const handleOpen = () => setOpen(true);
  // const handleClose = () => setOpen(false);

  const value = useWatch({
    control,
    name: computedSlug,
  });

  const stripHtmlTags = (input) => {
    return input.replace(/<[^>]*>/g, "");
  };

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <>
      <Box
        style={{
          display: "flex",
        }}>
        <p
          onClick={handleClick}
          style={
            isWrapField
              ? {
                  height: "16px",
                  display: "flex",
                  alignItems: "center",
                  width: "100%",
                  marginRight: "8px",
                  cursor: "text",
                  minHeight: "16px",
                }
              : {
                  display: "flex",
                  alignItems: "center",
                  width: "100%",
                  marginRight: "8px",
                  cursor: "text",
                  minHeight: "16px",
                }
          }>
          {stripHtmlTags(
            value
              ? `${value?.slice(0, 200)}${value?.length > 200 ? "..." : ""}`
              : ""
          )}
        </p>

        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "left",
          }}>
          <HFTextEditor
            control={control}
            updateObject={updateObject}
            isNewTableView={isNewTableView}
            name={computedSlug}
            tabIndex={field?.tabIndex}
            fullWidth
            multiline
            rows={4}
            defaultValue={field.defaultValue}
            disabled={isDisabled}
            key={computedSlug}
            isTransparent={true}
            {...props}
          />
        </Popover>

        {/* <Button
          onClick={handleOpen}
          sx={{
            width: "30px",
            height: "30px",
            minWidth: "30px",
          }}
        >
          <ZoomOutMapIcon />
        </Button> */}
      </Box>

      {/* <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <Box sx={style}>
          <HFTextEditor
            control={control}
            updateObject={updateObject}
            isNewTableView={isNewTableView}
            name={computedSlug}
            tabIndex={field?.tabIndex}
            fullWidth
            multiline
            rows={4}
            defaultValue={field.defaultValue}
            disabled={isDisabled}
            key={computedSlug}
            isTransparent={true}
            {...props}
          />
          <Button
            variant="contained"
            style={{
              marginTop: "1rem",
              width: "100%",
            }}
            onClick={handleClose}
          >
            Close
          </Button>
        </Box>
      </Modal> */}
    </>
  );
}
