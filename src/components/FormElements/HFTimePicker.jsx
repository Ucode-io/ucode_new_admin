import {makeStyles} from "@mui/styles";
import {Controller} from "react-hook-form";
import CTimePicker from "../DatePickers/CTimePicker";

const useStyles = makeStyles((theme) => ({
  input: {
    "&::placeholder": {
      color: "#fff",
    },
  },
}));

const HFTimePicker = ({
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
          <CTimePicker
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

export default HFTimePicker;
