import {Box, TextField} from "@mui/material";
import React from "react";
import {Controller} from "react-hook-form";

function HCTextField({
  control,
  name,
  defaultValue,
  placeholder,
  isDisabled,
  required,
  withTrim = false,
  disabledHelperText = false,
  isFormEdit = false,
  type = "text",
  rules = {},
}) {
  return (
    <Controller
      control={control}
      name={name}
      defaultValue={defaultValue}
      rules={{
        required: required ? "This is required field" : false,
        ...rules,
      }}
      render={({field: {onChange, value}, fieldState: {error}}) => {
        return (
          <TextField
            size="small"
            type={type}
            variant="outlined"
            margin="normal"
            value={value}
            onChange={(e) => {
              onChange(e.target.value);
            }}
            sx={{
              width: "100%",
              padding: "0px",
              margin: "0px",
            }}
            name={name}
            placeholder={placeholder}
            InputProps={{
              readOnly: isDisabled,
            }}
            helperText={!disabledHelperText && error?.message}
            className={isFormEdit ? "custom_textfield" : ""}
          />
        );
      }}
    />
  );
}

export default HCTextField;
