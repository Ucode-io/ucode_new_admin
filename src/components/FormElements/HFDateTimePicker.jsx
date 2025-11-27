import {makeStyles} from "@mui/styles";
import {Controller} from "react-hook-form";
import CDateTimePicker from "../DatePickers/CDateTimePicker";

const useStyles = makeStyles((theme) => ({
  input: {
    "&::placeholder": {
      color: "#fff",
    },
  },
}));

const HFDateTimePicker = ({
  control,
  isBlackBg = false,
  isFormEdit = false,
  name,
  mask,
  updateObject,
  isNewTableView = false,
  isTransparent = false,
  tabIndex,
  showCopyBtn,
  placeholder = "",
  disabled,
  sectionModal,
  defaultValue,
  field,
}) => {
  const classes = useStyles();
  return (
    <Controller
      control={control}
      name={name}
      defaultValue={defaultValue === "now()" ? new Date() : defaultValue}
      render={({field: {onChange, value}, fieldState: {error}}) => {
        return (
          <CDateTimePicker
            isFormEdit={isFormEdit}
            classes={classes}
            sectionModal={sectionModal}
            placeholder={placeholder}
            isBlackBg={isBlackBg}
            mask={mask}
            tabIndex={tabIndex}
            value={value}
            isNewTableView={isNewTableView}
            showCopyBtn={showCopyBtn}
            onChange={(val) => {
              onChange(val);
              isNewTableView && updateObject();
            }}
            disabled={disabled}
            isTransparent={isTransparent}
          />
        );
      }}></Controller>
  );
};

export default HFDateTimePicker;
