import {FormHelperText} from "@mui/material";
import {Controller} from "react-hook-form";
import ImageUpload from "../Upload/ImageUpload";

const HFImageUpload = ({
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
          <ImageUpload
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
      )}
    ></Controller>
  );
};

export default HFImageUpload;
