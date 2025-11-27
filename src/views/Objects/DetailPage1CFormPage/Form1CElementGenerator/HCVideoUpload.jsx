import {FormHelperText} from "@mui/material";
import {Controller} from "react-hook-form";
import OneCVideoUpload from "../../../../components/Upload/OneCVideoUpload";

const HCVideoUpload = ({
  control,
  name,
  required,
  updateObject,
  isNewTableView = false,
  tabIndex,
  rules,
  disabledHelperText = false,
  disabled,
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
          <OneCVideoUpload
            name={name}
            value={value}
            onChange={(val) => {
              onChange(val);
              isNewTableView && updateObject();
            }}
            tabIndex={tabIndex}
            disabled={disabled}
            {...props}
          />
          {!disabledHelperText && error?.message && (
            <FormHelperText error>{error?.message}</FormHelperText>
          )}
        </>
      )}></Controller>
  );
};

export default HCVideoUpload;
