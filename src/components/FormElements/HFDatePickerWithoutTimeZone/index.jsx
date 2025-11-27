import {makeStyles} from "@mui/styles";
import {Controller, useWatch} from "react-hook-form";
import CDateDatePickerNoTimeZoneTable from "./HFDatePickerNoTimeZoneTable";

const useStyles = makeStyles((theme) => ({
  input: {
    "&::placeholder": {
      color: "#fff",
    },
  },
}));

const HFDateDatePickerWithoutTimeZoneTable = ({
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
  isNewTableView,
  isTransparent = false,
  field,
  updateObject,
  isTableView,
}) => {
  const classes = useStyles();
  const value = useWatch({
    control,
    name,
  });

  return (
    <Controller
      control={control}
      name={name}
      defaultValue={defaultValue}
      render={({field: {onChange, value}, fieldState: {error}}) => {
        console.log("valueeeeeeeeee=====>", value);
        return (
          <CDateDatePickerNoTimeZoneTable
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
            isTransparent={isTransparent}
            isNewTableView={isNewTableView}
            field={field}
            updateObject={updateObject}
            isTableView={isTableView}
          />
        );
      }}></Controller>
  );
};

export default HFDateDatePickerWithoutTimeZoneTable;
