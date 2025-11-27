import styles from "../style.module.scss";
import { MdContentCopy } from "react-icons/md";
import { useMemo, useState } from "react";
import OutsideClickHandler from "react-outside-click-handler";
import { useDispatch } from "react-redux";
import { showAlert } from "../../../../../store/alert/alert.thunk";
import { Box, Button } from "@mui/material";
import HFTextField from "../../../../FormElements/HFTextField";
import getElementBetween from "../../../../../utils/getElementBetween";
import { useVariableResourceListQuery } from "../../../../../services/resourceService";
import { useWatch } from "react-hook-form";

const InputWithValueOffer = ({
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
  const inputValue = useWatch({
    control: form.control,
    name,
  });
  const dispatch = useDispatch();
  const containsOnlyNumbers = (str) => {
    return /^[0-9]+$/.test(str);
  };

  const queryVairables = form.watch("project_resource_id");

  const { data: { variables } = {} } = useVariableResourceListQuery({
    id: queryVairables,
    params: {},
    queryParams: {
      enabled: inputValue.trim() === "{{}}" && Boolean(queryVairables),
      onSuccess: (res) => {
        console.log("res", res);
      },
    },
  });

  let typeOfElement = containsOnlyNumbers(form.watch(name));

  const copyToClipboard = () => {
    dispatch(showAlert("Copied to clipboard", "success"));
    navigator.clipboard.writeText(form.watch(name));
  };

  const detectVariables = (newValue) => {
    setValue(newValue);
  };

  // const getValueMatch = useMemo(() => {
  //   if (!inputValue || !variables) return false;

  //   const variableNames = inputValue
  //     ?.match(/{{\$\$(.*?)}}/g)
  //     ?.map((match) => match?.slice(4, -2));

  //   return variableNames?.every((variableName) =>
  //     variables?.some((item) => item?.key === variableName)
  //   );
  // }, [inputValue, variables]);

  const getVariableValue = (element) => {
    form.setValue(name, `{{${element?.key}}}`);
    getElementBetween(form);
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
        // sx={{border: `1px solid  ${!inputValue || getValueMatch ? 'none' : 'red'}`, paddingLeft: '5px'}}
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

        {focused &&
        inputValue.trim() !== "{{" &&
        inputValue.trim() !== "{{}}" ? (
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

        {(variables?.length > 0 && inputValue.trim() === "{{") ||
        (inputValue.trim() === "{{}}" && Boolean(queryVairables)) ? (
          <div className={styles.prompt}>
            <div className={styles.variable_wrapper}>
              {variables?.map((element) => (
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    detectVariables(element);
                    getVariableValue(element);
                  }}
                  className={styles.wrapper_item}
                >
                  {element?.key}
                </div>
              ))}
            </div>
          </div>
        ) : (
          ""
        )}
      </Box>
    </div>
  );
};

export default InputWithValueOffer;
