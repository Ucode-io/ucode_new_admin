import {makeStyles} from "@mui/styles";
import {Controller} from "react-hook-form";
import OneCDatePicker from "../../../../components/DatePickers/OneCDatePicker";

const useStyles = makeStyles((theme) => ({
  input: {
    "&::placeholder": {
      color: "#fff",
      paddingLeft: "0px",
    },
  },
}));

const HCDatePicker = ({
  control,
  isBlackBg = false,
  className,
  name,
  updateObject,
  isNewTableView = false,
  label,
  width,
  mask,
  tabIndex,
  inputProps,
  disabledHelperText,
  placeholder = "",
  isFormEdit = false,
  defaultValue = "",
  isTransparent = false,
  disabled,
  required,
  sectionModal,
  ...props
}) => {
  const classes = useStyles();
  return (
    <Controller
      control={control}
      name={name}
      disabled
      rules={{
        required: required ? "This field is required" : false,
      }}
      defaultValue={defaultValue === "now()" ? new Date() : defaultValue}
      render={({field: {onChange, value}, fieldState: {error}}) => (
        <div className={className}>
          <OneCDatePicker
            isFormEdit={isFormEdit}
            sectionModal={sectionModal}
            name={name}
            required={required}
            classes={classes}
            placeholder={placeholder}
            isBlackBg={isBlackBg}
            mask={mask}
            tabIndex={tabIndex}
            value={value}
            onChange={(val) => {
              onChange(val);
              isNewTableView && updateObject();
            }}
            disabled={disabled}
            error={error}
            isTransparent={isTransparent}
          />
        </div>
      )}
    />
  );
};

export default HCDatePicker;
