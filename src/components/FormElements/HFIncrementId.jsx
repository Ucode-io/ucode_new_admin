import { Lock } from '@mui/icons-material';
import { InputAdornment, TextField, Tooltip } from '@mui/material';
import React from 'react'
import { Controller, useWatch } from 'react-hook-form';

function HFIncrementId({
    disabled,
    isFormEdit,
    updateObject,
    isNewTableView,
    isBlackBg,
    control,
    name,
    fullWidth,
    field,
    required,
    placeholder,
    defaultValue,
    rules
}) {
    const data = useWatch({
        control,
        name
    })

    return (
    <Controller
      control={control}
      name={name}
      defaultValue={defaultValue}
      rules={{
        required: required ? "This is required field" : false,
        ...rules,
      }}
      render={({field: {onChange, value}, fieldState: {error}}) => (
        <TextField
          size="small"
          value={typeof value === "number" ? numberWithSpaces(value) : value}
          onChange={(e) => {
            onChange(
              withTrim
                ? e.target.value?.trim()
                : typeof e.target.value === "number"
                ? numberWithSpaces(e.target.value)
                : e.target.value
            );
            customOnChange(e);
            isNewTableView && updateObject();
          }}
          sx={{
            width: "100%",
            padding: "0px",
            margin: "0px",
          }}
          name={name}
          error={error}
          fullWidth={fullWidth}
          placeholder={placeholder}
        //   autoFocus={tabIndex === 1}
          InputProps={{
            readOnly: disabled,
            // inputProps: {tabIndex},
            classes: {
              input: isBlackBg ? classes.input : "",
            },
            style: disabled
              ? {
                  background: "#c0c0c039",
                  padding: "0px",
                }
              : isNewTableView
              ? {
                  background: "inherit",
                  color: "inherit",
                  padding: "0px !important",
                  margin: "0px !important",
                  height: "25px",
                }
              : {},

            // endAdornment: disabled ? (
            //   <Tooltip title={disabled_text}>
            //     <InputAdornment position="start">
            //       <Lock style={{fontSize: "20px"}} />
            //     </InputAdornment>
            //   </Tooltip>
            // ) : (
            //   endAdornment
            // ),
          }}
        //   helperText={!disabledHelperText && error?.message}
          className={isFormEdit ? "custom_textfield" : ""}
        //   {...props}
        />
      )}
    />
  );
}

export default HFIncrementId