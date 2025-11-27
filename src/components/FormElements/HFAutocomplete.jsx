import {FormControl, FormHelperText, InputLabel} from "@mui/material";
import {useMemo} from "react";
import {Controller, useWatch} from "react-hook-form";
import CAutoCompleteSelect from "../CAutoCompleteSelect";

const HFAutocomplete = ({
  control,
  name,
  isBlackBg,
  label,
  tabIndex,
  updateObject,
  isNewTableView = false,
  disabled,
  width = "100%",
  options = [],
  disabledHelperText,
  placeholder,
  required = false,
  onChange = () => {},
  onFieldChange = () => {},
  rules = {},
  defaultValue = null,
  customChange = () => {},
  ...props
}) => {
  const computedOptions = useMemo(() => {
    if (Object.keys(options[0] ?? {}).includes("label")) {
      return options;
    }
    return options?.map((option) => ({
      label: option,
      value: option,
    }));
  }, [options]);

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
        field: {onChange: onFormChange, value, name},
        fieldState: {error},
      }) => {
        console.log("errorrrrrr", error);
        return (
          <FormControl style={{width}}>
            <InputLabel size="small">{label}</InputLabel>
            <CAutoCompleteSelect
              value={value}
              tabIndex={tabIndex}
              disabled={disabled}
              isBlackBg={isBlackBg}
              onChange={(val) => {
                onChange(val?.value);
                onFormChange(val?.value);
                customChange(val);
                isNewTableView && updateObject();
              }}
              onFieldChange={onFieldChange}
              options={computedOptions}
            />
            {error?.message && (
              <FormHelperText error>{error?.message}</FormHelperText>
            )}
          </FormControl>
        );
      }}></Controller>
  );
};

export default HFAutocomplete;
