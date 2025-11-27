import {Box, Popover} from "@mui/material";
import React, {useState} from "react";
import {useWatch} from "react-hook-form";
import HFCodeField from "../FormElements/HFCodeField";
import HFProgrammingField from "../FormElements/HFProgrammingField";

function JsonCellElement({
  field,
  control,
  updateObject = () => {},
  computedSlug,
  isDisabled,
  isNewTableView,
  row,
  newColumn,
  isWrapField,
}) {
  const value = useWatch({
    control,
    name: computedSlug,
  });

  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  return (
    <>
      <Box>
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
          {value?.length > 50
            ? `${value?.slice(0, 30)}...`
            : value?.includes("#")
              ? value?.split("#")?.[1] || value
              : value}
        </p>

        <Popover
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
          <HFCodeField
            control={control}
            updateObject={updateObject}
            field={field}
            name={computedSlug}
            isDisabled={isDisabled}
            row={row}
            isNewTableView={isNewTableView}
            newColumn={newColumn}
          />
        </Popover>
      </Box>
    </>
  );
}

export default JsonCellElement;
