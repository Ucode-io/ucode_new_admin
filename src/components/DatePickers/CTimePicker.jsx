import DatePicker from "react-multi-date-picker";
import TimePickerPlugin from "./Plugins/TimePickerPlugin";
import "react-multi-date-picker/styles/layouts/mobile.css";
import "./style2.scss";
import {Box, InputAdornment, TextField, Tooltip} from "@mui/material";
import {DateRange, Lock, Today} from "@mui/icons-material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

const CTimePicker = ({
  value,
  onChange,
  classes,
  isBlackBg,
  isTransparent = false,
  isFormEdit,
  tabIndex,
  disabled,
  sectionModal,
}) => {
  const getValue = () => {
    if (!value) return "";

    const result = new Date();
    if (typeof value === "string") {
      result.setHours(value?.split(":")?.[0]);
      result.setMinutes(value?.split(":")?.[1]);
    } else {
      return "";
    }

    return result;
  };
  return (
    <DatePicker
      portal={sectionModal ? false : document.body}
      render={(value, openCalendar, handleChange) => {
        return (
          <TextField
            value={value}
            onClick={openCalendar}
            onChange={handleChange}
            size="small"
            fullWidth
            autoFocus={tabIndex === 1}
            autoComplete="off"
            InputProps={{
              inputProps: {tabIndex},
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
                    <AccessTimeIcon
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
            className={`${isFormEdit ? "custom_textfield" : ""}`}
          />
        );
      }}
      disableDayPicker
      plugins={[<TimePickerPlugin disablePreview />]}
      format="HH:mm"
      value={getValue()}
      onChange={(date) => {
        onChange(date?.isValid ? date.format("HH:mm") : "");
      }}
    />
  );
};

export default CTimePicker;
