import {makeStyles} from "@mui/styles";
import {Controller} from "react-hook-form";
import OneCDateTimePickerWithout from "../../../../components/DatePickers/OneCDateTimePickerWithout";

const useStyles = makeStyles((theme) => ({
  input: {
    "&::placeholder": {
      color: "#fff",
    },
  },
}));

const HCDateTimePickerWithout = ({
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
          <OneCDateTimePickerWithout
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

export default HCDateTimePickerWithout;
