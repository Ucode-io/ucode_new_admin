import { Input } from "@mui/material";
import { Controller } from "react-hook-form";

const NewColorInput = ({
  control,
  required = false,
  name,
  inputProps = {},
  disabled = false,
  inputLeftElement,
  inputRightElement,
  defaultValue = "",
  placeholder = "",
  customOnChange = () => {},
  ...props
}) => {
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      rules={{ required }}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <>
          <Input
            value={value}
            // onChange={onChange}
            onChange={(e) => {
              onChange(e);
              customOnChange(e);
            }}
            isInvalid={Boolean(error)}
            readOnly={disabled}
            placeholder={placeholder}
            {...inputProps}
            required={false}
            type="color"
          />
          {inputRightElement}
        </>
      )}
    />
  );
};

export default NewColorInput;
