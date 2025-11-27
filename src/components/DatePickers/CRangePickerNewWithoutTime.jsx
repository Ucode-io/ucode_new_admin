import {Today, Clear} from "@mui/icons-material";
import {InputAdornment, TextField} from "@mui/material";
import DatePicker from "react-multi-date-picker";
import weekends from "react-multi-date-picker/plugins/highlight_weekends";
import {locale} from "./Plugins/locale";

const CRangePickerNewWithoutTime = ({
  onChange,
  value,
  placeholder,
  isClearable = true,
}) => {
  const formatDate = (date) => {
    const options = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    };
    return date.toLocaleString("ru-RU", options).replace(",", "");
  };

  const changeHandler = (val) => {
    if (!val?.length) {
      onChange([]);
      return;
    }

    const from = new Date(val[0]);
    const to = new Date(val[1]);

    // Adjust hours to match the required format
    from.setHours(0);
    from.setMinutes(0);
    from.setSeconds(0);

    // to.setHours(00);
    // to.setMinutes(00);
    // to.setSeconds(00);

    // Trigger the onChange with formatted dates
    if (val?.[0] && val?.[1]) {
      onChange({
        $gte: formatDate(from),
        $lt: formatDate(to),
      });
    }
  };

  const clearHandler = () => {
    onChange(undefined);
  };

  return (
    <DatePicker
      render={(value, openCalendar, handleChange) => (
        <TextField
          value={value}
          onClick={openCalendar}
          onChange={handleChange}
          size="small"
          fullWidth
          autoComplete="off"
          placeholder={placeholder}
          InputProps={{
            endAdornment: (
              <>
                <InputAdornment position="end">
                  <Today />
                </InputAdornment>
                {value?.length > 0 && isClearable ? (
                  <span
                    onClick={clearHandler}
                    style={{margin: "5px 0 0 5px", cursor: "pointer"}}>
                    <Clear />
                  </span>
                ) : null}
              </>
            ),
          }}
        />
      )}
      range
      plugins={[weekends()]}
      weekStartDayIndex={1}
      portal
      locale={locale}
      className="datePicker"
      format="DD.MM.YYYY"
      numberOfMonths={2}
      onChange={changeHandler}
      value={Object.values(value ?? {})}
    />
  );
};

export default CRangePickerNewWithoutTime;
