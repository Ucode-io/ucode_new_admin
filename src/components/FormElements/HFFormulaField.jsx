import {
  Box,
  IconButton,
  InputAdornment,
  TextField,
  Tooltip,
} from "@mui/material";
import {Controller, useWatch} from "react-hook-form";
import useDebouncedWatch from "../../hooks/useDebouncedWatch";
import {Parser} from "hot-formula-parser";
import {useEffect} from "react";
import IconGenerator from "../IconPicker/IconGenerator";
import {useState} from "react";
import {numberWithSpaces} from "@/utils/formatNumbers";
import {Lock} from "@mui/icons-material";
import FunctionsIcon from "@mui/icons-material/Functions";

const parser = new Parser();

const HFFormulaField = ({
  control,
  name,
  isTableView = false,
  tabIndex,
  rules = {},
  setFormValue = () => {},
  required,
  disabledHelperText,
  fieldsList,
  updateObject,
  isNewTableView = false,
  disabled,
  defaultValue,
  field,
  ...props
}) => {
  const [formulaIsVisible, setFormulaIsVisible] = useState(false);
  const formula = field?.attributes?.formula ?? "";
  const values = useWatch({
    control,
  });

  const updateValue = () => {
    let computedFormula = formula;
    const fieldsListSorted = fieldsList
      ? [...fieldsList]?.sort((a, b) => b.slug?.length - a.slug?.length)
      : [];
    fieldsListSorted?.forEach((field) => {
      let value = values[field.slug] ?? 0;

      if (typeof value === "string") value = `'${value}'`;
      if (typeof value === "object") value = `"${value}"`;
      if (typeof value === "boolean")
        value = JSON.stringify(value).toUpperCase();
      computedFormula = computedFormula.replaceAll(`${field.slug}`, value);
    });

    const {error, result} = parser.parse(computedFormula);

    let newValue = error ?? result;
    const prevValue = values[name];
    if (newValue !== prevValue) setFormValue(name, newValue);
  };

  useDebouncedWatch(updateValue, [values], 300);

  useEffect(() => {
    updateValue();
  }, []);
  return (
    <Controller
      control={control}
      name={name}
      disabled={disabled}
      defaultValue={defaultValue}
      rules={{
        required: required ? "This is required field" : false,
        ...rules,
      }}
      render={({field: {onChange, value}, fieldState: {error}}) => (
        <TextField
          size="small"
          value={
            formulaIsVisible
              ? formula
              : typeof value === "number"
              ? numberWithSpaces(parseFloat(value).toFixed(2))
              : value
          }
          name={name}
          onChange={(e) => {
            const val = e.target.value;
            const valueWithoutSpaces = val.replaceAll(" ", "");

            if (!valueWithoutSpaces) onChange("");
            else
              onChange(
                !isNaN(Number(valueWithoutSpaces))
                  ? Number(valueWithoutSpaces)
                  : ""
              );
            isNewTableView && updateObject();
          }}
          error={error}
          sx={
            isTableView
              ? {
                  "& .MuiOutlinedInput-notchedOutline": {
                    border: "0",
                  },
                }
              : ""
          }
          fullWidth
          disabled={disabled}
          autoFocus={tabIndex === 1}
          helperText={!disabledHelperText && error?.message}
          InputProps={{
            inputProps: {tabIndex},
            readOnly: disabled,
            style: disabled
              ? {
                  background: "inherit",
                  paddingRight: "0",
                }
              : {
                  background: "inherit",
                  color: "inherit",
                },
            endAdornment: (
              <InputAdornment position="end">
                <Box
                  style={{display: "flex", alignItems: "center", gap: "10px"}}
                >
                  <Tooltip
                    title={formulaIsVisible ? "Hide formula" : "Show formula"}
                  >
                    <IconButton
                      edge="end"
                      color={formulaIsVisible ? "primary" : "default"}
                      onClick={() => setFormulaIsVisible((prev) => !prev)}
                    >
                      {/* <IconGenerator
                        icon="square-root-variable.svg"
                        size={15}
                      /> */}
                      <FunctionsIcon />
                    </IconButton>
                  </Tooltip>
                  {disabled && (
                    <Tooltip title="This field is disabled for this role!">
                      <InputAdornment position="start">
                        <Lock style={{fontSize: "20px"}} />
                      </InputAdornment>
                    </Tooltip>
                  )}
                </Box>
              </InputAdornment>
            ),
          }}
          {...props}
        />
      )}
    ></Controller>
  );
};

export default HFFormulaField;
