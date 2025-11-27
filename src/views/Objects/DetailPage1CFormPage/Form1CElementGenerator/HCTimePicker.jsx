import {makeStyles} from "@mui/styles";
import {Controller} from "react-hook-form";
import OneCTimePicker from "../../../../components/DatePickers/OneCTimePicker";

const useStyles = makeStyles((theme) => ({
  input: {
    "&::placeholder": {
      color: "#fff",
    },
  },
}));

const HCTimePicker = ({
  control,
  className,
  updateObject,
  isNewTableView = false,
  isBlackBg,
  name,
  isTransparent = false,
  disabled,
  label,
  tabIndex,
  isFormEdit = false,
  width,
  inputProps,
  disabledHelperText,
  placeholder,
  defaultValue = "",
  sectionModal,
  ...props
}) => {
  const classes = useStyles();
  return (
    <Controller
      control={control}
      name={name}
      defaultValue=""
      render={({field: {onChange, value}, fieldState: {error}}) => (
        <div className={className}>
          <OneCTimePicker
            sectionModal={sectionModal}
            isFormEdit={isFormEdit}
            classes={classes}
            tabIndex={tabIndex}
            disabled={disabled}
            isBlackBg={isBlackBg}
            value={value}
            onChange={(val) => {
              onChange(val);
              isNewTableView && updateObject();
            }}
            isTransparent={isTransparent}
          />
        </div>
      )}></Controller>
  );
};

export default HCTimePicker;
