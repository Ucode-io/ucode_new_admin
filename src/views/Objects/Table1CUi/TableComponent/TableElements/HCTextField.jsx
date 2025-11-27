import {TextField} from "@mui/material";
import {Controller} from "react-hook-form";

const HCTextField = ({
  control,
  name = "",
  field,
  placeholder,
  defaultValue,
  width,
  height,
  required = false,
  ...props
}) => {
  return (
    <Controller
      control={control}
      name={name}
      defaultValue={defaultValue}
      rules={{
        required: required ? "This is required field" : false,
      }}
      render={({field: {onChange, value}, fieldState: {error}}) => {
        return (
          <TextField
            size="small"
            value={value}
            variant="outlined"
            onChange={(e) => {
              onChange(e.target.value);
            }}
            sx={{
              width: width ? width : "100%",
              height: height ? height : "100%",
              padding: "0px",
              margin: "0px",
              "& .MuiInputBase-input": {
                padding: "12px 14px",
              },
            }}
            error={error}
            name={name}
            placeholder={placeholder}
            {...props}
          />
        );
      }}
    />

    // <TextField
    //           sx={{
    //             width: "120px",
    //             height: "46px",
    //             "& .MuiInputBase-input": {
    //               padding: "12px 14px",
    //             },
    //           }}
    //           placeholder="Код"
    //           variant="outlined"
    //           size="small"
    //         />
  );
};

export default HCTextField;
