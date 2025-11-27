import React, {useState} from "react";
import {Box, Button, Dialog, TextField, makeStyles} from "@mui/material";
import HFMapField from "./HFMapField";
import {useWatch} from "react-hook-form";
import styles from "./style.module.scss";
import {generateLink} from "../../utils/generateYandexLink";

function HFModalMap({
  control,
  field,
  defaultValue,
  updateObject,
  isNewTableView = false,
  isTransparent = false,
  isFormEdit,
  name,
  required,
}) {
  const [open, setOpen] = useState(false);
  const value = useWatch({
    control,
    name,
  });

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Box>
      <TextField
        id={`map_field`}
        value={
          value
            ? generateLink(value?.split(",")?.[0], value?.split(",")?.[1])
            : ""
        }
        defaultValue={defaultValue}
        variant="standard"
        width="small"
        onClick={() => handleOpen()}
        sx={{
          width: "100%",
        }}
        InputProps={{
          style: {
            background: isTransparent ? "transparent" : "",
            height: "100%x",
            height: "100%",
            padding: "0 0",
          },
          classes: {
            notchedoutline: {},
          },
          disableUnderline: true, // this removes the default underline
        }}
      />

      <Dialog open={open} onClose={handleClose}>
        <div className={styles.mapField}>
          <HFMapField
            updateObject={updateObject}
            isNewTableView={isNewTableView}
            field={field}
            width={"500px"}
            height={"400px"}
            control={control}
            name={name}
            defaultValue={defaultValue}
          />

          <Box>
            <Button onClick={handleClose} variant="outlined" color="error">
              Cancel
            </Button>
            <Button
              onClick={handleClose}
              sx={{marginLeft: "10px"}}
              variant="outlined">
              Confirm
            </Button>
          </Box>
        </div>
      </Dialog>
    </Box>
  );
}

export default HFModalMap;
