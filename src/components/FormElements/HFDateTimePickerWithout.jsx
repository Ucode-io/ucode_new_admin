import {makeStyles} from "@mui/styles";
import {Controller} from "react-hook-form";
import CDateTimePickerWithout from "../DatePickers/CDateTimePickerWithout";

const useStyles = makeStyles((theme) => ({
  input: {
    "&::placeholder": {
      color: "#fff",
    },
  },
}));

const HFDateTimePickerWithout = ({
  control,
  isBlackBg = false,
  isFormEdit = false,
  name,
  mask,
  tabIndex,
  showCopyBtn,
  placeholder = "",
  disabled,
  defaultValue,
  sectionModal,
}) => {
  const classes = useStyles();
  return (
    <Controller
      control={control}
      name={name}
      defaultValue={defaultValue}
      render={({field: {onChange, value}, fieldState: {error}}) => {
        return (
          <CDateTimePickerWithout
            sectionModal={sectionModal}
            isFormEdit={isFormEdit}
            classes={classes}
            placeholder={placeholder}
            isBlackBg={isBlackBg}
            mask={mask}
            tabIndex={tabIndex}
            value={value}
            showCopyBtn={showCopyBtn}
            onChange={onChange}
            disabled={disabled}
          />
        );
      }}></Controller>
  );
};

export default HFDateTimePickerWithout;
