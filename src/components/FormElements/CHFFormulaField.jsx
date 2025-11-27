import {IconButton, InputAdornment, TextField, Tooltip} from "@mui/material";
import {Controller, useWatch} from "react-hook-form";
import useDebouncedWatch from "../../hooks/useDebouncedWatch";
import {Parser} from "hot-formula-parser";
import {useEffect} from "react";
import IconGenerator from "../IconPicker/IconGenerator";
import {useState} from "react";
import {numberWithSpaces} from "@/utils/formatNumbers";
import {fi} from "date-fns/locale";
import FunctionsIcon from "@mui/icons-material/Functions";

const parser = new Parser();

const CHFFormulaField = ({
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
  const formula = field?.attributes?.formula ?? "";

  const currentValue = useWatch({
    control,
    name,
  });

  const values = useWatch({
    control,
    name: `multi.${index}`,
  });

  const updateValue = () => {
    let computedFormula = formula;
    const fieldsListSorted = fieldsList
      ? [...fieldsList]?.sort((a, b) => b.slug?.length - a.slug?.length)
      : [];
    fieldsListSorted?.forEach((field) => {
      let value = values?.[field?.slug] ?? 0;
      if (typeof value === "string") value = `${value}`;
      computedFormula = computedFormula.replaceAll(`${field.slug}`, value);
    });
    const {error, result} = parser?.parse(computedFormula);
    let newValue = result ?? error;
    // const prevValue = values[name]
    if (newValue !== currentValue) setFormValue(name, newValue);
  };

  useDebouncedWatch(updateValue, [values], 300);

  useEffect(() => {
    updateValue();
  }, []);

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
                : ""
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
            isNewTableView && updateObject();
          }}
          name={name}
          id={field?.slug ? `${field?.slug}_${name}` : `${name}`}
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
                  title={formulaIsVisible ? "Hide formula" : "Show formula"}>
                  <IconButton
                    edge="end"
                    color={formulaIsVisible ? "primary" : "default"}
                    onClick={() => setFormulaIsVisible((prev) => !prev)}>
                    {/* <IconGenerator icon="square-root-variable.svg" size={15} /> */}
                    <FunctionsIcon />
                  </IconButton>
                </Tooltip>
              </InputAdornment>
            ),
          }}
          {...props}
        />
      )}></Controller>
  );
};

export default CHFFormulaField;
