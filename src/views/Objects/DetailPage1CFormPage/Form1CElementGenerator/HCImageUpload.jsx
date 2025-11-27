import {FormHelperText} from "@mui/material";
import {Controller} from "react-hook-form";
import OneCImageUpload from "../../../../components/Upload/OneCImageUpload";

const HCImageUpload = ({
  control,
  name,
  tabIndex,
  required,
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
          <OneCImageUpload
            name={name}
            value={value}
            tabIndex={tabIndex}
            onChange={onChange}
            disabled={disabled}
            field={field}
            // error={get(formik.touched, name) && Boolean(get(formik.errors, name))}
            {...props}
          />
          {!disabledHelperText && error?.message && (
            <FormHelperText error>{error?.message}</FormHelperText>
          )}
        </>
      )}></Controller>
  );
};

export default HCImageUpload;
