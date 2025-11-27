import DatePicker from "react-multi-date-picker";
import weekends from "react-multi-date-picker/plugins/highlight_weekends";
import { InputAdornment, TextField, Typography } from "@mui/material";
import InputMask from "react-input-mask";
import { useRef } from "react";

import "react-multi-date-picker/styles/layouts/mobile.css";
import "../../../components/DatePickers/style2.scss";
import CustomNavButton from "../../../components/DatePickers/Plugins/CustomNavButton";
import { locale } from "../../../components/DatePickers/Plugins/locale";
import { dateValidFormat } from "../../../utils/dateValidFormat";

const CalendarDatePicker = ({
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
  currentDay,
}) => {
  const datePickerRef = useRef();
  return (
    <DatePicker
      disabled={disabled}
      ref={datePickerRef}
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
          >
            {(InputProps) => (
              <TextField
                size="small"
                name={name}
                placeholder={placeholder}
                inputFormat="dd.MM.yyyy"
                onClick={openCalendar}
                fullWidth
                autoComplete="off"
                autoFocus={tabIndex === 1}
                InputProps={{
                  ...InputProps,
                  inputProps: { tabIndex },
                  readOnly: disabled,
                  classes: {
                    input: isBlackBg ? classes.input : "",
                  },
                  style: isTransparent
                    ? { background: "transparent" }
                    : disabled
                    ? {
                        background: "#c0c0c039",
                      }
                    : {
                        background: isBlackBg ? "#2A2D34" : "",
                        color: isBlackBg ? "#fff" : "",
                        cursor: "pointer",
                        paddingLeft: "0",
                      },
                  startAdornment: (
                    <InputAdornment>
                      <Typography variant="h5" mr={1} ml={1} color={"#000"}>
                        {value
                          ? dateValidFormat(currentDay, "d MMMM yyyy")
                          : ""}
                      </Typography>
                    </InputAdornment>
                  ),
                }}
                className={
                  isFormEdit ? "custom_textfield" : "calendar_textfield"
                }
              />
            )}
          </InputMask>
        );
      }}
      renderButton={<CustomNavButton />}
      plugins={[weekends()]}
      weekStartDayIndex={1}
      portal
      locale={locale}
      className="datePicker"
      format="DD.MM.YYYY"
      inputFormat="dd.MM.yyyy"
      value={new Date(value) || ""}
      onChange={(val) => onChange(val ? new Date(val) : "")}
    />
  );
};

export default CalendarDatePicker;
