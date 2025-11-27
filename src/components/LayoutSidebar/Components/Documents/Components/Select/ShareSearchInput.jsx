import { Select } from "@mui/material";
import { Controller } from "react-hook-form";
import formatGroupLabel from "./formatGroupLabel";

const ShareSearchInput = ({
  control,
  name,
  options = [],
  disabled,
  defaultValue = "",
  customOnChange = () => {},
  ...props
}) => {
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <Select
          options={options}
          isReadOnly={disabled}
          // components={{ Option: IconOption, SingleValue: CustomSelectValue }}
          value={options.find((option) => option.value === value)}
          onChange={(val) => {
            onChange(val.value);
            customOnChange(val);
          }}
          fullWidth
          // menuPortalTarget={document.body}
          // styles={{
          //   menuPortal: (provided) => ({ ...provided, zIndex: 2 })
          // }}
          formatGroupLabel={formatGroupLabel}
          {...props}
        />
      )}
    />
  );
};

export default ShareSearchInput;
