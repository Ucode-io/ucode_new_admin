import {Controller, useWatch} from "react-hook-form";
import {NumericFormat} from "react-number-format";
import styles from "./style.module.scss";

const HCFloatNumberField = ({
  control,
  name = "",
  disabledHelperText = false,
  isBlackBg = false,
  isFormEdit = false,
  required = false,
  updateObject,
  isNewTableView = false,
  isTransparent = false,
  fullWidth = false,
  withTrim = false,
  rules = {},
  defaultValue = "",
  tabIndex,
  disabled,
  type = "text",
  isFloat = false,
  decimalScale = 50,
  ...props
}) => {
  return (
    <Controller
      control={control}
      name={name}
      defaultValue={defaultValue}
      rules={{
        required: required ? "This is required field" : false,
        ...rules,
      }}
      render={({field: {onChange, value}, fieldState: {error}}) => {
        const decimalSeparator = isFloat ? "." : undefined;
        return (
          <NumericFormat
            thousandsGroupStyle="thousand"
            thousandSeparator=" "
            decimalSeparator={decimalSeparator}
            decimalScale={decimalScale}
            displayType="input"
            isNumericString={true}
            autoComplete="off"
            allowNegative={true}
            fullWidth={fullWidth}
            value={value}
            onChange={(e) => {
              const val = e.target.value;
              const valueWithoutSpaces = val.replaceAll(" ", "");
              if (!valueWithoutSpaces) onChange("");
              else {
                if (valueWithoutSpaces.at(-1) === ".")
                  onChange(parseFloat(valueWithoutSpaces));
                else
                  onChange(
                    !isNaN(valueWithoutSpaces)
                      ? parseFloat(valueWithoutSpaces)
                      : valueWithoutSpaces
                  );
              }
              isNewTableView && updateObject();
            }}
            className={`${isFormEdit ? "custom_textfield" : ""} ${
              styles.numberField
            }`}
            name={name}
            readOnly={disabled}
            style={
              isTransparent
                ? {background: "transparent", border: "none"}
                : disabled
                  ? {background: "#c0c0c039"}
                  : {
                      background: isBlackBg ? "#2A2D34" : "",
                      color: isBlackBg ? "#fff" : "",
                    }
            }
            {...props}
          />
        );
      }}></Controller>
  );
};

export default HCFloatNumberField;
