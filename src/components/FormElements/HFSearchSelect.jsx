import React, {useState, useEffect} from "react";
import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  IconButton,
  Box,
  TextField,
  InputAdornment,
  MenuList,
  Paper,
} from "@mui/material";
import {Controller} from "react-hook-form";
import ClearIcon from "@mui/icons-material/Clear";
import SearchIcon from "@mui/icons-material/Search";
import {columnIcons} from "../../utils/constants/columnIcons";

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

const HFSearchSelect = ({
  control,
  name,
  label,
  width = "100%",
  options = [],
  disabledHelperText,
  placeholder,
  required = false,
  onChange = () => {},
  onOpen = () => {},
  getOnchangeField = () => {},
  optionType,
  defaultValue = "",
  rules = {},
  isClearable = true,
  height = "46px",
  fetchOptions = null,
  searchPlaceholder = "Search...",
  debounceDelay = 500,
  ...props
}) => {
  const [selectedValue, setSelectedValue] = useState(defaultValue || "");
  const [searchText, setSearchText] = useState("");
  const [open, setOpen] = useState(false);
  const debouncedSearchText = useDebounce(searchText, debounceDelay);

  const handleClear = () => {
    setSelectedValue("");
    onChange("");
  };

  useEffect(() => {
    if (fetchOptions && debouncedSearchText !== undefined) {
      fetchOptions({
        search: debouncedSearchText || undefined,
        searchText: debouncedSearchText || undefined,
      });
    }
  }, [debouncedSearchText, fetchOptions]);

  const handleOpen = () => {
    setOpen(true);
    onOpen();
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Controller
      control={control}
      name={name}
      defaultValue={defaultValue}
      rules={{
        required: required ? "This is required field" : false,
        ...rules,
      }}
      render={({
        field: {onChange: onFormChange, value},
        fieldState: {error},
      }) => {
        return (
          <FormControl style={{width}}>
            <InputLabel size="small">{label}</InputLabel>
            <Select
              value={value || selectedValue}
              label={label}
              defaultValue={selectedValue}
              sx={{
                height: height,
                "& .MuiSelect-select": {
                  padding: "12px 14px",
                  boxSizing: "border-box",
                },
                "&.Mui-focused": {
                  backgroundColor: "transparent",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#1976d2",
                },
              }}
              className="hf-select"
              error={error}
              inputProps={{placeholder}}
              fullWidth
              id={`select_${name}`}
              displayEmpty
              renderValue={
                value !== ""
                  ? undefined
                  : () => <span style={{color: "#909EAB"}}>{placeholder}</span>
              }
              onChange={(e) => {
                onFormChange(e.target.value);
                onChange(e.target.value);
                setSelectedValue(e.target.value);
              }}
              onOpen={handleOpen}
              onClose={handleClose}
              open={open}
              MenuProps={{
                PaperProps: {
                  sx: {
                    maxHeight: 300,
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    "& .MuiMenu-list": {
                      padding: 0,
                      maxHeight: 300,
                      overflow: "hidden",
                      display: "flex",
                      flexDirection: "column",
                    },
                  },
                },
                MenuListProps: {
                  sx: {
                    padding: 0,
                    maxHeight: 300,
                    overflowY: "auto",
                    overflowX: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    "& > li:first-of-type": {
                      position: "sticky",
                      top: 0,
                      zIndex: 10,
                      backgroundColor: "#ffffff",
                    },
                  },
                },
                anchorOrigin: {
                  vertical: "bottom",
                  horizontal: "left",
                },
                transformOrigin: {
                  vertical: "top",
                  horizontal: "left",
                },
              }}
              {...props}>
              <MenuItem
                disabled
                sx={{
                  padding: "8px 12px",
                  height: "auto",
                  opacity: 1,
                  pointerEvents: "none",
                  position: "sticky",
                  top: 0,
                  zIndex: 10,
                  backgroundColor: "#ffffff",
                  borderBottom: "1px solid #e2e8f0",
                  margin: 0,
                  flexShrink: 0,
                  "&.Mui-disabled": {
                    opacity: 1,
                  },
                }}>
                <Box
                  sx={{
                    width: "100%",
                    pointerEvents: "auto",
                  }}>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder={searchPlaceholder}
                    value={searchText}
                    autoFocus
                    onChange={(e) => {
                      setSearchText(e.target.value);
                    }}
                    onKeyDown={(e) => {
                      e.stopPropagation();
                      if (e.key === "Enter") {
                        e.preventDefault();
                      }
                    }}
                    onMouseDown={(e) => {
                      e.stopPropagation();
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon
                            sx={{color: "#64748b", fontSize: "18px"}}
                          />
                        </InputAdornment>
                      ),
                      sx: {
                        height: "40px",
                        "& .MuiInputBase-input": {
                          padding: "8px 12px",
                          fontSize: "14px",
                        },
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#e2e8f0",
                        },
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#cbd5e1",
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#1976d2",
                        },
                      },
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                          borderColor: "#e2e8f0",
                        },
                        "&:hover fieldset": {
                          borderColor: "#cbd5e1",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "#1976d2",
                        },
                      },
                    }}
                  />
                </Box>
              </MenuItem>
              {optionType === "GROUP"
                ? options?.map((group, groupIndex) => [
                    <MenuItem
                      onClick={(e) => getOnchangeField(group)}
                      style={{fontWeight: 600, color: "#000", fontSize: 15}}>
                      {group.label}
                    </MenuItem>,
                    group.options?.map((option) => (
                      <MenuItem
                        onClick={(e) => getOnchangeField(option)}
                        key={option.value}
                        value={option.value}
                        style={{paddingLeft: 30}}>
                        <div className="flex align-center gap-2">
                          {option.label}
                        </div>
                      </MenuItem>
                    )),
                  ])
                : options?.map((option) => (
                    <MenuItem
                      onClick={(e) => getOnchangeField(option)}
                      key={option?.value}
                      value={option?.value}>
                      <div className="flex align-center gap-2">
                        {option?.icon && columnIcons(option?.value)}
                        {option?.label}
                      </div>
                    </MenuItem>
                  ))}
            </Select>
            {!disabledHelperText && error?.message && (
              <FormHelperText error>{error?.message}</FormHelperText>
            )}
            {(selectedValue || value || defaultValue) && (
              <Box sx={{position: "absolute", right: "20px", top: "3px"}}>
                {isClearable && (
                  <IconButton
                    onClick={() => {
                      onFormChange("");
                      handleClear();
                    }}
                    size="small">
                    <ClearIcon />
                  </IconButton>
                )}
              </Box>
            )}
          </FormControl>
        );
      }}></Controller>
  );
};

export default HFSearchSelect;
