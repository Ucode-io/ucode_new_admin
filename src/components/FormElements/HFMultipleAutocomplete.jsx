import {Close, Lock} from "@mui/icons-material";
import {
  Autocomplete,
  FormControl,
  FormHelperText,
  InputLabel,
  TextField,
  Dialog,
  createFilterOptions,
  Tooltip,
  InputAdornment,
} from "@mui/material";
import {useEffect, useState} from "react";
import {useMemo} from "react";
import {Controller, useForm, useWatch} from "react-hook-form";
import IconGenerator from "../IconPicker/IconGenerator";
import HFColorPicker from "./HFColorPicker";
import HFIconPicker from "./HFIconPicker";
import styles from "./style.module.scss";
import HFTextField from "./HFTextField";
import PrimaryButton from "../Buttons/PrimaryButton";
import AddIcon from "@mui/icons-material/Add";
import constructorFieldService from "../../services/constructorFieldService";
import {generateGUID} from "../../utils/generateID";
import RippleLoader from "../Loaders/RippleLoader";
import FRow from "./FRow";
import {makeStyles} from "@mui/styles";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import {useParams} from "react-router-dom";

const filter = createFilterOptions();

const useStyles = makeStyles((theme) => ({
  input: {
    "&::placeholder": {
      color: "#fff",
    },
  },
}));

const HFMultipleAutocomplete = ({
  control,
  name,
  label,
  updateObject,
  isNewTableView = false,
  isFormEdit = false,
  isBlackBg = false,
  width = "100%",
  disabledHelperText,
  placeholder,
  tabIndex,
  required = false,
  onChange = () => {},
  field,
  rules = {},
  defaultValue = [],
  disabled,
  setFormValue,
}) => {
  const classes = useStyles();
  const options = field.attributes?.options ?? [];
  const hasColor = field.attributes?.has_color;
  const hasIcon = field.attributes?.has_icon;
  const isMultiSelect = field.attributes?.is_multiselect;

  return (
    <Controller
      control={control}
      name={name}
      defaultValue={defaultValue}
      rules={{
        required: required ? "This is required field" : false,
        ...rules,
      }}
      render={({
        field: {onChange: onFormChange, value},
        fieldState: {error},
      }) => {
        return (
          <AutoCompleteElement
            value={value}
            classes={classes}
            isBlackBg={isBlackBg}
            options={options}
            placeholder={placeholder}
            width={width}
            label={label}
            // tabIndex={tabIndex}
            required={required}
            hasColor={hasColor}
            isFormEdit={isFormEdit}
            hasIcon={hasIcon}
            onFormChange={(el) => {
              onFormChange(el);
              onChange(el);
              isNewTableView && updateObject();
            }}
            disabledHelperText={disabledHelperText}
            error={error}
            isMultiSelect={isMultiSelect}
            disabled={disabled}
            field={field}
            className="hf-select"
          />
        );
      }}></Controller>
  );
};

const AutoCompleteElement = ({
  value,
  options,
  width,
  label,
  hasColor,
  // tabIndex,
  hasIcon,
  required,
  classes,
  placeholder,
  onFormChange,
  disabledHelperText,
  isFormEdit,
  error,
  isMultiSelect,
  disabled,
  field,
  isBlackBg,
}) => {
  const [dialogState, setDialogState] = useState(null);
  const {appId} = useParams();

  const editPermission = field?.attributes?.field_permission?.edit_permission;
  const handleOpen = (inputValue) => {
    setDialogState(inputValue);
  };

  const handleClose = () => {
    setDialogState(null);
  };
  const [localOptions, setLocalOptions] = useState(options ?? []);

  const computedValue = useMemo(() => {
    if (!value?.length) return [];

    if (isMultiSelect)
      if (Array.isArray(value)) {
        return (
          value?.map((el) =>
            localOptions?.find((option) => option.value === el)
          ) ?? []
        );
      } else {
        return localOptions?.find((item) => {
          item?.value === value;
        });
      }
    else return [localOptions?.find((option) => option.value === value[0])];
  }, [value, localOptions, isMultiSelect]);

  const addNewOption = (newOption) => {
    setLocalOptions((prev) => [...prev, newOption]);
    changeHandler(null, [...computedValue, newOption]);
  };

  const changeHandler = (_, values) => {
    if (values[values?.length - 1]?.value === "NEW") {
      handleOpen(values[values?.length - 1]?.inputValue);
      return;
    }

    if (!values?.length) {
      onFormChange([]);
      return;
    }
    if (isMultiSelect) onFormChange(values?.map((el) => el.value));
    else onFormChange([values[values?.length - 1]?.value] ?? []);
  };

  // useEffect(() => {
  //   if (value) {
  //     onFormChange(value);
  //   }
  // }, []);

  return (
    <FormControl style={{width}}>
      <InputLabel size="small">{label}</InputLabel>
      <Autocomplete
        multiple
        id={`multiselect_${name}`}
        value={computedValue}
        options={localOptions}
        popupIcon={
          isBlackBg ? (
            <ArrowDropDownIcon style={{color: "#fff"}} />
          ) : (
            <ArrowDropDownIcon />
          )
        }
        disableCloseOnSelect
        getOptionLabel={(option) => option?.label ?? option?.value}
        isOptionEqualToValue={(option, value) => option?.value === value?.value}
        onChange={changeHandler}
        filterOptions={(options, params) => {
          const filtered = filter(options, params);
          if (params.inputValue !== "" && field?.attributes?.creatable) {
            filtered.push({
              value: "NEW",
              inputValue: params.inputValue,
              label: `Add "${params.inputValue}"`,
            });
          }

          return filtered;
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder={computedValue?.length ? "" : placeholder}
            // autoFocus={tabIndex === 1}
            sx={{
              "&.MuiInputAdornment-root": {
                position: "absolute",
                right: 0,
              },
            }}
            InputProps={{
              // inputProps: { tabIndex },
              ...params.InputProps,
              classes: {
                input: isBlackBg ? classes.input : "",
              },
              style: disabled
                ? {
                    background: "inherit",
                  }
                : {
                    background: "inherit",
                    color: isBlackBg ? "#fff" : "inherit",
                    border: error?.message ? "1px solid red" : "",
                  },

              endAdornment: Boolean(
                appId === "fadc103a-b411-4a1a-b47c-e794c33f85f6" || disabled
              ) && (
                <Tooltip
                  title="This field is disabled for this role!"
                  style={{
                    position: "absolute",
                    right: 0,
                  }}>
                  <InputAdornment position="start">
                    <Lock style={{fontSize: "20px"}} />
                  </InputAdornment>
                </Tooltip>
              ),
            }}
            className={`${
              isFormEdit ? "custom_textfield" : ""
            } multiSelectInput`}
            size="small"
          />
        )}
        noOptionsText={"No options"}
        disabled={
          appId === "fadc103a-b411-4a1a-b47c-e794c33f85f6" ? true : disabled
        }
        renderTags={(values, getTagProps) => (
          <div className={styles.valuesWrapper}>
            {values?.map((el, index) => (
              <div
                key={el?.value}
                className={styles.multipleAutocompleteTags}
                style={
                  hasColor
                    ? {color: el?.color, background: `${el?.color}30`}
                    : {}
                }>
                {hasIcon && <IconGenerator icon={el?.icon} />}
                <p className={styles.value}>{el?.label ?? el?.value}</p>
                {field?.attributes?.disabled === false && editPermission && (
                  <Close
                    fontSize="10"
                    style={{cursor: "pointer"}}
                    onClick={() => {
                      getTagProps({index})?.onDelete();
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        )}
      />
      {!disabledHelperText && error?.message && (
        <FormHelperText error>{error?.message}</FormHelperText>
      )}

      {/* {Boolean(!value?.length && required) && (
        <FormHelperText error>{"This field is required"}</FormHelperText>
      )} */}
      <Dialog open={!!dialogState} onClose={handleClose}>
        <AddOptionBlock
          dialogState={dialogState}
          addNewOption={addNewOption}
          handleClose={handleClose}
          field={field}
        />
      </Dialog>
    </FormControl>
  );
};

const AddOptionBlock = ({field, dialogState, handleClose, addNewOption}) => {
  const hasColor = field.attributes?.has_color;
  const hasIcon = field.attributes?.has_icon;
  const [loader, setLoader] = useState(false);
  const {control, handleSubmit} = useForm({
    defaultValues: {
      label: dialogState,
      value: dialogState,
      id: generateGUID(),
    },
  });
  const onSubmit = (newOption) => {
    setLoader(true);
    const data = {
      ...field,
      attributes: {
        ...field?.attributes,
        options: [...field.attributes.options, newOption],
      },
    };

    constructorFieldService
      .update({...data})
      .then((res) => {
        handleClose(false);
        addNewOption(newOption);
      })
      .catch((err) => {
        setLoader(false);
      });
  };
  return (
    <div className={`${styles.dialog}`}>
      <h2>Add option</h2>
      <div className={styles.dialog_content}>
        <div className={styles.color_picker}>
          {hasColor && (
            <HFColorPicker
              control={control}
              name="color"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
              }}
            />
          )}
          <h4>Color</h4>
        </div>
        <div className={styles.icon_picker}>
          {hasIcon && (
            <HFIconPicker shape="rectangle" control={control} name="icon" />
          )}
          <h4>Icon</h4>
        </div>
      </div>
      <form action="" className={styles.form_control}>
        <div className={styles.input_control}>
          <FRow label="Label">
            <HFTextField defaultValue="" control={control} name="label" />
          </FRow>
        </div>
        <div className={styles.input_control}>
          <FRow label="Value">
            <HFTextField defaultValue="" control={control} name="value" />
          </FRow>
        </div>
      </form>
      <div className={styles.submit_btn}>
        <PrimaryButton onClick={handleSubmit(onSubmit)}>
          Add
          {loader ? (
            <span className={styles.btn_loader}>
              <RippleLoader size="btn_size" height="20px" />
            </span>
          ) : (
            <AddIcon />
          )}
        </PrimaryButton>
      </div>
    </div>
  );
};

export default HFMultipleAutocomplete;
