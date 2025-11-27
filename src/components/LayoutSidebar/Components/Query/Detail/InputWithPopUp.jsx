import styles from "../style.module.scss";
import {MdContentCopy} from "react-icons/md";
import {useState} from "react";
import OutsideClickHandler from "react-outside-click-handler";
import {useDispatch} from "react-redux";
import {showAlert} from "../../../../../store/alert/alert.thunk";
import {Box, Button} from "@mui/material";
import HFTextField from "../../../../FormElements/HFTextField";
import getElementBetween from "../../../../../utils/getElementBetween";

const InputWithPopUp = ({
  name,
  form,
  props,
  placeholder,
  size,
  defaultValue,
  disabled,
  height = "32px !important",
  enableGetElement = true,
  customOnChange = () => {},
  onBlur = () => {},
  className,
  width = "100% !important",
}) => {
  const [value, setValue] = useState("");
  const [focused, setFocused] = useState(false);
  const dispatch = useDispatch();
  const containsOnlyNumbers = (str) => {
    return /^[0-9]+$/.test(str);
  };

  let typeOfElement = containsOnlyNumbers(form.watch(name));

  const copyToClipboard = () => {
    dispatch(showAlert("Copied to clipboard", "success"));
    navigator.clipboard.writeText(form.watch(name));
  };

  const detectVariables = (newValue) => {
    setValue(newValue);
  };

  return (
    <div
      className={className || styles.container}
      onBlur={() => {
        setFocused(false);
      }}
    >
      <Box
        width={width}
        height={height}
        display="flex"
        alignItems="center"
        position="relative"
        className={styles.inputWithPopUp}
      >
        <HFTextField
          control={form.control}
          size={size}
          name={name}
          defaultValue={defaultValue}
          disabled={disabled}
          fullWidth
          onFocus={() => {
            setFocused(true);
          }}
          placeholder={placeholder}
          customOnChange={(value) => {
            detectVariables(value.target.value);
            enableGetElement && getElementBetween(form);
            customOnChange();
          }}
          onBlur={onBlur}
        />

        {focused ? (
          <div className={styles.prompt}>
            <div className={styles.wrapper}>
              <div>
                <p>{typeOfElement ? "Number" : "String"}</p>
                <p className={styles.paragraph}>"{form.watch(name)}"</p>
              </div>

              <div>
                <Button
                  variant="contained"
                  color="success"
                  size="xs"
                  onClick={() => copyToClipboard()}
                >
                  <MdContentCopy />
                </Button>
              </div>
            </div>
          </div>
        ) : (
          ""
        )}
      </Box>
    </div>
  );
};

export default InputWithPopUp;
