import { Checkbox } from "@mui/material";
import { Controller } from "react-hook-form";

const PermissionCheckbox = ({
  control,
  required = false,
  name,
  inputProps = {},
  disabled = false,
  inputLeftElement,
  defaultValue = false,
  children,
  ...props
}) => {
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      rules={{ required }}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <Checkbox
          isInvalid={error}
          onChange={(e) => onChange(e.target.checked ? "Yes" : "No")}
          checked={value === "Yes"}
          {...props}
        >
          {children}
        </Checkbox>
      )}
    />
  );
};

export default PermissionCheckbox;
