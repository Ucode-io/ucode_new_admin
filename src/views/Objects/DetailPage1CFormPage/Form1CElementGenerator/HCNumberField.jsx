import {Controller} from "react-hook-form";
import {NumericFormat} from "react-number-format";
import styles from "./style.module.scss";
import {Box, FormHelperText} from "@mui/material";
import {Lock} from "@mui/icons-material";

const HCNumberField = ({
  control,
  name = "",
  disabledHelperText = false,
  isBlackBg = false,
  isFormEdit = false,
  required = false,
  updateObject = () => {},
  fullWidth = false,
  withTrim = false,
  rules = {},
  defaultValue = "",
  tabIndex,
  disabled,
  newColumn,
  field,
  type = "text",
  ...props
}) => {
  const handleChange = (event, onChange) => {
    const inputValue = event.target.value.replace(/\s+/g, "");
    const parsedValue = inputValue ? parseFloat(inputValue) : "";

    if (parsedValue || parsedValue === 0) {
      onChange(parsedValue);
    } else {
      onChange("");
    }
  };

  const regexValidation = field?.attributes?.validation;

  return (
    <Controller
      control={control}
      name={name}
      defaultValue={defaultValue}
      rules={{
        required: required ? "This is a required field" : false,
        validate: (value) => {
          if (regexValidation && !new RegExp(regexValidation).test(value)) {
            return field?.attributes?.validation_message;
          }
          return true;
        },
      }}
      render={({field: {onChange, value}, fieldState: {error}}) => {
        return (
          <Box>
            <NumericFormat
              thousandsGroupStyle="thousand"
              thousandSeparator=" "
              decimalSeparator="."
              displayType="input"
              isNumericString={true}
              autoComplete="off"
              id={field?.slug ? `${field?.slug}_${name}` : `${name}`}
              allowNegative
              fullWidth={fullWidth}
              value={typeof value === "number" ? value : ""}
              onChange={(e) => handleChange(e, onChange)}
              className={styles.numberField}
              name={name}
              readOnly={disabled}
              {...props}
            />
            {!disabledHelperText && error?.message && (
              <FormHelperText
                sx={{
                  position: "absolute",
                  bottom: newColumn ? "-10px" : "-20px",
                  left: "10px",
                }}
                error>
                {error?.message}
              </FormHelperText>
            )}

            {disabled && (
              <Box
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "5px",
                }}>
                <Lock style={{fontSize: "20px"}} />
              </Box>
            )}
          </Box>
        );
      }}
    />
  );
};

export default HCNumberField;
