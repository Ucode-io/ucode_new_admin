import DatePicker from "react-multi-date-picker";
import weekends from "react-multi-date-picker/plugins/highlight_weekends";
import TimePicker from "react-multi-date-picker/plugins/time_picker";
import {DateRange, Lock} from "@mui/icons-material";
import {Box, InputAdornment, TextField, Tooltip} from "@mui/material";
import InputMask from "react-input-mask";
import "react-multi-date-picker/styles/layouts/mobile.css";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import {format, parse} from "date-fns";
import {useMemo} from "react";
import "./style.scss";
import {locale} from "../../DatePickers/Plugins/locale";
import CopyToClipboard from "../../CopyToClipboard";

const CDateDatePickerNoTimeZoneTable = ({
  value,
  placeholder,
  isBlackBg,
  classes,
  onChange,
  isFormEdit,
  tabIndex,
  mask,
  isTransparent,
  isNewTableView,
  showCopyBtn = true,
  disabled = false,
  field,
  updateObject,
  isTableView,
}) => {
  const onChangeHandler = (val) => {
    onChange(val ? format(new Date(val), "dd.MM.yyyy HH:mm") : "");
    if (isTableView) updateObject();
  };

  const computedValue = useMemo(() => {
    if (!value) return "";

    if (value.includes("Z")) return new Date(value);

    return parse(value, "dd.MM.yyyy HH:mm", new Date());
  }, [value]);

  return (
    <div className="main_wrapper">
      <DatePicker
        render={(value, openCalendar, handleChange) => {
          return (
            <InputMask
              mask={mask}
              value={value ?? undefined}
              onChange={handleChange}
              disabled={disabled}>
              {(InputProps) => (
                <TextField
                  value={value}
                  onClick={() => (disabled ? null : openCalendar())}
                  onChange={handleChange}
                  size="medium"
                  placeholder={placeholder.split("#")[0]}
                  sx={{
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderRight: 0,
                    },
                    "& input": {
                      padding: "5px !important",
                    },
                    width: "150px",
                  }}
                  fullWidth
                  className={"custom_textfield"}
                  autoComplete="off"
                  autoFocus={tabIndex === 1}
                  InputProps={{
                    ...InputProps,
                    inputProps: {tabIndex},
                    readOnly: disabled,
                    classes: {
                      input: isBlackBg ? classes.input : "",
                    },
                    style: isTransparent
                      ? {
                          background: "transparent",
                          border: "none",
                        }
                      : disabled
                        ? {
                            background: "#c0c0c039",
                          }
                        : {
                            background: isBlackBg ? "#2A2D34" : "",
                            color: isBlackBg ? "#fff" : "",
                          },
                  }}
                />
              )}
            </InputMask>
          );
        }}
        plugins={[weekends()]}
        weekStartDayIndex={1}
        portal
        locale={locale}
        format="DD.MM.YYYY"
        value={computedValue || ""}
        onChange={onChangeHandler}
      />
      <DatePicker
        disableDayPicker
        render={(value, openCalendar, handleChange) => {
          return (
            <InputMask
              mask={"99:99"}
              value={value ?? undefined}
              onChange={handleChange}
              disabled={disabled}>
              {(InputProps) => (
                <TextField
                  value={value}
                  onClick={() => (disabled ? null : openCalendar())}
                  onChange={handleChange}
                  // size="small"
                  autoComplete="off"
                  placeholder={placeholder.split("#")[1]}
                  className={"custom_textfield"}
                  style={{border: "none"}}
                  fullWidth
                  sx={{
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderLeft: 0,
                    },
                    "& .MuiInputBase-input": {
                      paddingTop: isNewTableView ? 0 : "10px",
                      paddingBottom: isNewTableView ? 0 : "10px",
                    },
                    "& input": {
                      padding: "5px !important",
                    },
                    width: "150px",
                  }}
                  InputProps={{
                    readOnly: disabled,
                    classes: {
                      input: isBlackBg ? classes.input : "",
                    },
                    style: isTransparent
                      ? {
                          background: "transparent",
                        }
                      : disabled
                        ? {
                            background: "#c0c0c039",
                          }
                        : {
                            background: isBlackBg ? "#2A2D34" : "",
                            color: isBlackBg ? "#fff" : "",
                          },
                    endAdornment: (
                      <InputAdornment position="end">
                        <Box sx={{display: "flex", alignItems: "center"}}>
                          <DateRange
                            style={{
                              color: isBlackBg ? "#fff" : "",
                              fontSize: "20px",
                            }}
                          />
                          {disabled && (
                            <Tooltip title="This field is disabled for this role!">
                              <Lock style={{fontSize: "20px"}} />
                            </Tooltip>
                          )}
                        </Box>
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            </InputMask>
          );
        }}
        plugins={[<TimePicker hideSeconds />]}
        portal
        format="HH:mm"
        value={computedValue || ""}
        onChange={onChangeHandler}
      />
      {showCopyBtn && (
        <CopyToClipboard copyText={value} style={{marginLeft: 8}} />
      )}
    </div>
  );
};

export default CDateDatePickerNoTimeZoneTable;
