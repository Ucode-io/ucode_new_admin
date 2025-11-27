import DatePicker from "react-multi-date-picker";
import weekends from "react-multi-date-picker/plugins/highlight_weekends";
import TimePicker from "react-multi-date-picker/plugins/time_picker";
import {DateRange, Lock} from "@mui/icons-material";
import {Box, InputAdornment, TextField, Tooltip} from "@mui/material";
import InputMask from "react-input-mask";
import "./style2.scss";
import {locale} from "./Plugins/locale";
import "react-multi-date-picker/styles/layouts/mobile.css";
import CopyToClipboard from "../CopyToClipboard";

const CDateTimePicker = ({
  value,
  placeholder,
  isBlackBg,
  isNewTableView,
  classes,
  onChange,
  isFormEdit,
  isTransparent = false,
  tabIndex,
  mask,
  showCopyBtn = true,
  disabled = false,
  sectionModal,
}) => {
  return (
    <div className="main_wrapper">
      <DatePicker
        id={`date_time_${name}`}
        portal={sectionModal ? false : document.body}
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
                  id={`date_time_${name}`}
                  onClick={() => (disabled ? null : openCalendar())}
                  onChange={handleChange}
                  size="medium"
                  placeholder={placeholder.split("#")[0]}
                  sx={{
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderRight: 0,
                      borderTopRightRadius: 0,
                      borderBottomRightRadius: 0,
                    },
                    "& .MuiInputBase-input": {
                      paddingTop: isNewTableView ? 0 : "10px",
                      paddingBottom: isNewTableView ? 0 : "10px",
                      padding: "8.5px 8px",
                    },
                    width: "100%",
                  }}
                  fullWidth
                  className={`${isFormEdit ? "custom_textfield" : ""}`}
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
                        }
                      : disabled
                        ? {
                            background: "#c0c0c039",
                            borderTopRightRadius: 0,
                            borderBottomRightRadius: 0,
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
        locale={locale}
        portalTarget={sectionModal ? false : document.body}
        format="DD.MM.YYYY"
        value={new Date(value) || ""}
        onChange={(val) => onChange(val ? new Date(val) : "")}
      />
      <DatePicker
        id={`date_time_${name}`}
        disableDayPicker
        portal={sectionModal ? false : document.body}
        render={(value, openCalendar, handleChange) => {
          return (
            <InputMask
              mask={"99:99"}
              value={value ?? undefined}
              onChange={handleChange}
              disabled={disabled}>
              {(InputProps) => (
                <TextField
                  id={`date_time_${name}`}
                  value={value}
                  portalTarget={document.body}
                  portal={document.body}
                  onClick={() => (disabled ? null : openCalendar())}
                  onChange={handleChange}
                  // size="small"
                  autoComplete="off"
                  placeholder={placeholder.split("#")[1]}
                  className={`${isFormEdit ? "custom_textfield" : ""}`}
                  style={{border: "none"}}
                  fullWidth
                  sx={{
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderLeft: 0,
                      borderTopLeftRadius: 0,
                      borderBottomLeftRadius: 0,
                    },
                    "& .MuiInputBase-input": {
                      paddingTop: isNewTableView ? 0 : "10px",
                      paddingBottom: isNewTableView ? 0 : "10px",
                      padding: "8.5px 4px",
                    },
                    width: "100%",
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
                            borderTopLeftRadius: 0,
                            borderBottomLeftRadius: 0,
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
        format="HH:mm"
        value={new Date(value) || ""}
        onChange={(val) => onChange(val ? new Date(val) : "")}
      />
      {showCopyBtn && (
        <CopyToClipboard copyText={value} style={{marginLeft: 8}} />
      )}
    </div>
  );
};

export default CDateTimePicker;
