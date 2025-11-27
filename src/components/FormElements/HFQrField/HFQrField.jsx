import {Box, IconButton, TextField} from "@mui/material";
import React from "react";
import {Controller} from "react-hook-form";
import QrCode2Icon from "@mui/icons-material/QrCode2";

function HFQrField({
  control,
  name,
  defaultValue,
  field,
  required,
  isTableView,
  handClick = () => {},
}) {
  return (
    <Controller
      control={control}
      name={name}
      defaultValue={defaultValue}
      rules={{
        required: required ? "This is required field" : false,
      }}
      render={({field: {onChange, value}, fieldState: {error}}) => (
        <TextField
          size="small"
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
          id={field?.slug ? `${field?.slug}_${name}` : `${name}`}
          error={error}
          InputProps={{
            endAdornment: (
              <IconButton onClick={handClick}>
                <QrCode2Icon />
              </IconButton>
            ),
          }}
        />
      )}
    />
  );
}

export default HFQrField;
