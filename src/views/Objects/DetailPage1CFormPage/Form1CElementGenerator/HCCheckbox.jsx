import {Checkbox} from "@mui/material";
import {useId} from "react";
import {Controller} from "react-hook-form";

const HCCheckbox = ({
  control,
  isBlackBg,
  name,
  label,
  updateObject,
  isNewTableView = false,
  tabIndex,
  className,
  labelClassName,
  defaultValue = false,
  isShowLable = true,
  ...props
}) => {
  const id = useId();

  return (
    <Controller
      control={control}
      name={name}
      defaultValue={defaultValue}
      render={({field: {onChange, value}, fieldState: {error}}) => (
        <div id="hcCheckboxfield" className={className}>
          <Checkbox
            // id={`checkbox-${id} checkbox_${name}`}
            checked={
              typeof value === "string"
                ? value === "true"
                  ? true
                  : false
                : value ?? false
            }
            autoFocus={tabIndex === 1}
            onChange={(_, val) => {
              onChange(val);
              isNewTableView && updateObject();
            }}
            {...props}
            inputProps={tabIndex}
          />
          {isShowLable && (
            <label
              htmlFor={`checkbox-${id}`}
              className={`label ${labelClassName}`}>
              {label}
            </label>
          )}
        </div>
      )}></Controller>
  );
};

export default HCCheckbox;
