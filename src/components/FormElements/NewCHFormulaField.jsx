import { numberWithSpaces } from "@/utils/formatNumbers";
import FunctionsIcon from "@mui/icons-material/Functions";
import { IconButton, InputAdornment, TextField, Tooltip } from "@mui/material";
import { Parser } from "hot-formula-parser";
import { useState } from "react";
import { Controller, useWatch } from "react-hook-form";
import useDebouncedWatch from "../../hooks/useDebouncedWatch";

const parser = new Parser();

const NewCHFFormulaField = ({
  control,
  name,
  updateObject,
  isNewTableView = false,
  rules = {},
  isTableView = false,
  setFormValue = () => {},
  required,
  disabledHelperText,
  fieldsList,
  disabled,
  isTransparent = false,
  field,
  index,
  ...props
}) => {
  const [formulaIsVisible, setFormulaIsVisible] = useState(false);
  let formula = field?.attributes?.formula ?? "";
  
  const currentValue = useWatch({
    control,
    name,
  });

  const values = useWatch({
    control,
    name: `multi.${index}`,
  });

  const updateValue = () => {
    let value;
    const fieldsListSorted = fieldsList
      ? [...fieldsList]?.sort((a, b) => b.slug?.length - a.slug?.length) : [];
    fieldsListSorted?.forEach((field) => {
       value = values?.[field?.slug] ?? 0;
      if (typeof value === "string") value = `${value}`;
      const regex = new RegExp(`\\b${field.slug}\\b`, 'g');
      formula = formula.replace(regex, value);
    });
    const {error, result} = parser?.parse(formula);

    let newValue = result;
    if (newValue !== currentValue) setFormValue(name, newValue);
};

  useDebouncedWatch(updateValue, [values], 300);


  return (
    <Controller
      control={control}
      name={name}
      defaultValue=""
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
              ? numberWithSpaces(value)
              : value
          }
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
              updateObject();
          }}
          name={name}
          error={error}
          fullWidth
          sx={
            isTableView
              ? {
                  "& .MuiOutlinedInput-notchedOutline": {
                    border: "0",
                  },
                }
              : ""
          }
          helperText={!disabledHelperText && error?.message}
          InputProps={{
            readOnly: disabled,
            style: {
              background: isTransparent ? "transparent" : "#fff",
              border: "0",
              borderWidth: "0px",
            },
            endAdornment: (
              <InputAdornment position="end">
                <Tooltip
                  title={formulaIsVisible ? "Hide formula" : "Show formula"}
                >
                  <IconButton
                    edge="end"
                    color={formulaIsVisible ? "primary" : "default"}
                    onClick={() => setFormulaIsVisible((prev) => !prev)}
                  >
                    <FunctionsIcon />
                  </IconButton>
                </Tooltip>
              </InputAdornment>
            ),
          }}
          {...props}
        />
      )}
    ></Controller>
  );
};

export default NewCHFFormulaField;
