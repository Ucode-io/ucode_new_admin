import { FormHelperText } from "@mui/material";
import { Controller } from "react-hook-form";
import NewFileUpload from "../Upload/NewFileUpload.jsx";

const HFFileUpload = ({
  control,
  name,
  required,
  tabIndex,
  updateObject,
  isNewTableView = false,
  rules,
  disabledHelperText = false,
  disabled,
  field,
  ...props
}) => {

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
        <>
          <NewFileUpload
            name={name}
            value={value}
            tabIndex={tabIndex}
            field={field}
            onChange={(val) => {
              onChange(val);
              isNewTableView && updateObject();
            }}
            disabled={disabled}
            {...props}
          />
          {!disabledHelperText && error?.message && (
            <FormHelperText error>{error?.message}</FormHelperText>
          )}
        </>
      )}
    ></Controller>
  );
};

export default HFFileUpload;
