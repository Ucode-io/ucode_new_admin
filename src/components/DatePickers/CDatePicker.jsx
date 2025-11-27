import DatePicker from "react-multi-date-picker";
import weekends from "react-multi-date-picker/plugins/highlight_weekends";
import {
  Box,
  FormHelperText,
  InputAdornment,
  TextField,
  Tooltip,
} from "@mui/material";
import {Lock, Today} from "@mui/icons-material";
import InputMask from "react-input-mask";
import {useRef} from "react";

import {locale} from "./Plugins/locale";
import CustomNavButton from "./Plugins/CustomNavButton";
import "react-multi-date-picker/styles/layouts/mobile.css";
import "./style2.scss";

const CDatePicker = ({
  value,
  onChange,
  disabled,
  isBlackBg,
  name,
  isFormEdit,
  mask,
  isTransparent = false,
  tabIndex,
  classes,
  placeholder,
  required,
  error,
  sectionModal,
  newColumn = false,
}) => {
  const datePickerRef = useRef();
  return (
    <Box
      style={
        isTransparent
          ? {
              background: "transparent",
              border: "none",
              display: "flex",
              alignItems: "center",
              position: "relative",
            }
          : disabled
            ? {
                background: "#DEDEDE",
                display: "flex",
                alignItems: "center",
                borderRadius: "4px",
                position: "relative",
              }
            : {
                background: isBlackBg ? "#2A2D34" : "",
                color: isBlackBg ? "#fff" : "",
                display: "flex",
                alignItems: "center",
                position: "relative",
              }
      }>
      <DatePicker
        id={`date_${name}`}
        disabled={disabled}
        required={required}
        ref={datePickerRef}
        portal={sectionModal ? false : document.body}
        render={(value, openCalendar, handleChange) => {
          document.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              datePickerRef.current.closeCalendar();
            }
          });
          return (
            <InputMask
              mask={mask}
              value={value ?? undefined}
              onChange={handleChange}
              disabled={disabled}
              required={required}>
              {(InputProps) => (
                <TextField
                  size="small"
                  id={`date_${name}`}
                  name={name}
                  placeholder={placeholder}
                  inputFormat="dd.MM.yyyy"
                  onClick={openCalendar}
                  fullWidth
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
                          border: error?.message ? "solid 1px red" : "",
                        }
                      : disabled
                        ? {
                            background: "#c0c0c039",
                            border: error?.message ? "solid 1px red" : "",
                          }
                        : {
                            background: isBlackBg ? "#2A2D34" : "",
                            color: isBlackBg ? "#fff" : "",
                            border: error?.message ? "solid 1px red" : "",
                          },
                    endAdornment: (
                      <InputAdornment position="end">
                        <Box sx={{display: "flex", alignItems: "center"}}>
                          <Today
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
                  className={isFormEdit ? "custom_textfield" : ""}
                />
              )}
            </InputMask>
          );
        }}
        renderButton={<CustomNavButton />}
        plugins={[weekends()]}
        weekStartDayIndex={1}
        locale={locale}
        className="datePicker"
        format="DD.MM.YYYY"
        inputFormat="dd.MM.yyyy"
        value={new Date(value) || ""}
        onChange={(val) => onChange(val ? new Date(val) : "")}
      />
      {error?.message && (
        <FormHelperText
          sx={{
            position: "absolute",
            bottom: newColumn ? "-10px" : "-20px",
            left: "10px",
          }}
          error>
          {error?.message}
        </FormHelperText>
      )}
    </Box>
  );
};

export default CDatePicker;
