import {InputAdornment, TextField, Tooltip} from "@mui/material";
import {Controller} from "react-hook-form";
import {numberWithSpaces} from "@/utils/formatNumbers";
import {useEffect} from "react";
import {useLocation} from "react-router-dom";

const HFTextFieldLogin = ({
  control,
  name = "",
  isFormEdit = false,
  isBlackBg,
  updateObject,
  isNewTableView = false,
  disabledHelperText = false,
  required = false,
  fullWidth = false,
  withTrim = false,
  rules = {},
  defaultValue = "",
  disabled = false,
  tabIndex,
  checkRequiredField,
  placeholder,
  endAdornment,
  field,
  type = "text",
  inputHeight = "46px",
  watch,
  disabled_text = "This field is disabled for this role!",
  setFormValue,
  customOnChange = () => {},
  ...props
}) => {
  const location = useLocation();
  useEffect(() => {
    if (
      location.pathname?.includes("create") &&
      location?.state?.isTreeView === true
    ) {
      setFormValue(name, "");
    }
  }, []);

  return (
    <Controller
      control={control}
      name={name}
      defaultValue={defaultValue}
      rules={{
        required: true ? "This is required field" : false,
        ...rules,
      }}
      render={({field: {onChange, value}, fieldState: {error}}) => {
        return (
          <TextField
            size="small"
            value={value}
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
            name={name}
            id={field?.slug ? `${field?.slug}_${name}` : `${name}`}
            error={!!error}
            type={type}
            fullWidth={fullWidth}
            placeholder={placeholder}
            // helperText={error?.message}
            autoFocus={tabIndex === 1}
            InputProps={{
              endAdornment: error && (
                <Tooltip title="This field is required">
                  <InputAdornment position="start">
                    <img src="/img/alert-circle.svg" height={"23px"} alt="" />
                  </InputAdornment>
                </Tooltip>
              ),
              ...props?.InputProps,
              readOnly: disabled,
              inputProps: {
                tabIndex,
              },
              sx: {
                height: "46px",
                "& .MuiInputBase-input": {
                  padding: "12px 14px",
                  height: "46px",
                  boxSizing: "border-box",
                  "&::placeholder": {
                    color: "#667085",
                  },
                },
                "&.Mui-focused": {
                  backgroundColor: "transparent",
                },
              },
              style: disabled
                ? {
                    background: "#c0c0c039",
                    padding: "0px !important",
                  }
                : isNewTableView
                  ? {
                      background: "inherit",
                      color: "inherit",
                      padding: "0px !important",
                      margin: "0px !important",
                    }
                  : {},
            }}
            className="loginField"
          />
        );
      }}
    />
  );
};

export default HFTextFieldLogin;
