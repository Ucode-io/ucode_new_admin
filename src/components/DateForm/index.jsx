import { DatePicker } from "@mui/x-date-pickers"
import { TextField } from "@mui/material"
import { endOfMonth, startOfMonth } from "date-fns"
import { useState } from "react"
import "./style.scss"

const DateForm = ({ date, onChange = () => { }, views }) => {
  const [month, setMonth] = useState(new Date(date))
  const [value, setValue] = useState(new Date())

  const handleDateChange = (newValue) => {
    const firstDayOfMonth = startOfMonth(newValue);
    const lastDayOfMonth = endOfMonth(newValue);
    setMonth({ $gte: firstDayOfMonth, $lt: lastDayOfMonth });
    setValue(newValue)
    onChange(month)
  };

  return (
    <div className="DateForm">
      <DatePicker
        inputFormat="MMM yyyy"
        value={value}
        views={views}
        onChange={handleDateChange}
        renderInput={(params) => <TextField {...params} size="small" />}
      />
    </div>
  )


}

export default DateForm
