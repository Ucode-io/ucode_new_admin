import {Box, TextField} from "@mui/material";
import React from "react";
import {Controller} from "react-hook-form";
import {numberWithSpaces} from "../../../../utils/formatNumbers";

function HCPassword({
  control,
  name,
  defaultValue,
  placeholder,
  disabled,
  required,
  withTrim = false,
  disabledHelperText = false,
  isFormEdit = false,
}) {
  return (
    <Box id="hcTextfield">
      <Controller
        control={control}
        name={name}
        defaultValue={defaultValue}
        rules={{
          required: required ? "This is required field" : false,
        }}
        render={({field: {onChange, value}, fieldState: {error}}) => {
          return (
            <TextField
              type="password"
              size="small"
              variant="outlined"
              margin="normal"
              value={value}
              onChange={(e) => {
                onChange(
                  withTrim
                    ? e.target.value?.trim()
                    : typeof e.target.value === "number"
                      ? numberWithSpaces(e.target.value)
                      : e.target.value
                );
              }}
              sx={{
                width: "100%",
                padding: "0px",
                margin: "0px",
              }}
              name={name}
              placeholder={placeholder}
              InputProps={{
                readOnly: disabled,
              }}
              helperText={!disabledHelperText && error?.message}
              className={isFormEdit ? "custom_textfield" : ""}
            />
          );
        }}
      />
    </Box>
  );
}

export default HCPassword;
