import {Checkbox} from "@mui/material";
import {useId} from "react";
import {Controller} from "react-hook-form";

const HFCheckbox = ({
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
        <div
          className={className}
          style={{
            background: isBlackBg ? "#2A2D34" : "",
            color: isBlackBg ? "#fff" : "",
          }}>
          <Checkbox
            id={`checkbox-${id} checkbox_${name}`}
            style={{
              transform: "translatey(-1px)",
              marginRight: "8px",
              margin: "8px 8px 8px 0",
              padding: 0,
            }}
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

export default HFCheckbox;
