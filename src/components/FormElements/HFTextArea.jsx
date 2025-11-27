import {
  InputAdornment,
  TextField,
  TextareaAutosize,
  Tooltip,
} from "@mui/material";
import {makeStyles} from "@mui/styles";
import {Controller} from "react-hook-form";

import {numberWithSpaces} from "@/utils/formatNumbers";
import {Lock} from "@mui/icons-material";

const useStyles = makeStyles((theme) => ({
  textarea: {
    "&::placeholder": {
      color: "#fff",
    },
    padding: "5px",
  },
}));

const HFTextArea = ({
  control,
  name = "",
  isFormEdit = false,
  isBlackBg,
  disabledHelperText = false,
  required = false,
  fullWidth = false,
  withTrim = false,
  rules = {},
  defaultValue = "",
  disabled,
  tabIndex,
  placeholder,
  minHeight = "120px",
  resize,
  ...props
}) => {
  const classes = useStyles();

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
        <TextareaAutosize
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
          }}
          name={name}
          error={error}
          fullWidth={fullWidth}
          placeholder={placeholder}
          autoFocus={tabIndex === 1}
          style={{
            padding: "8.5px 14px",
            width: "100%",
            border: "1px solid #d4d2d2",
            borderRadius: "4px",
            minHeight: minHeight,
            maxHeight: minHeight,
            resize: !resize ? "none" : "",
          }}
          InputProps={{
            readOnly: disabled,
            inputProps: {tabIndex},
            classes: {
              input: isBlackBg ? classes.textarea : classes.textarea,
            },
            style: disabled
              ? {
                  background: "#c0c0c039",
                  paddingRight: "0px",
                }
              : {
                  background: "inherit",
                  color: "inherit",
                },

            endAdornment: disabled && (
              <Tooltip title="This field is disabled for this role!">
                <InputAdornment position="start">
                  <Lock style={{fontSize: "20px"}} />
                </InputAdornment>
              </Tooltip>
            ),
          }}
          helperText={!disabledHelperText && error?.message}
          className={isFormEdit ? "custom_textfield" : ""}
          {...props}
        />
      )}
    />
  );
};

export default HFTextArea;
