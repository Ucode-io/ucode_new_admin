import { Lock } from "@mui/icons-material";
import {
  Autocomplete,
  InputAdornment,
  TextField,
  Tooltip,
} from "@mui/material";
import { useMemo } from "react";

const CAutoCompleteSelect = ({
  options,
  value,
  onChange,
  onFieldChange,
  tabIndex,
  disabled,
  multiple = false,
}) => {
  const computedValue = useMemo(() => {
    return options?.find((option) => option?.value === value) ?? null;
  }, [options, value]);

  return (
    <div>
      <Autocomplete
        multiple={multiple}
        // disablePortal
        options={options}
        value={computedValue}
        onChange={(e, value) => onChange(value)}
        getOptionLabel={(option) => option.label}
        // onSelect={(e, val) => console.log("VAL ==>", e.target.value)}
        isOptionEqualToValue={(option, value) => option.value === value.value}
        // sx={{ width: 300 }}
        renderInput={(params) => (
          <TextField
            {...params}
            size="small"
            onChange={(e) => onFieldChange(e)}
          />
        )}
      />
    </div>
  );
};

export default CAutoCompleteSelect;
