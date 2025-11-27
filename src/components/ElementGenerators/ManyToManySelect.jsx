import Select from "react-select";
import useDebounce from "../../hooks/useDebounce";
import {Box, Button} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import {memo, useEffect} from "react";
import {useWatch} from "react-hook-form";

const customStyles = {
  control: (provided, state) => ({
    ...provided,
    width: "100%",
    display: "flex",
    alignItems: "center",
    outline: "none",
  }),
  input: (provided) => ({
    ...provided,
    width: "100%",
    width: "250px",
  }),
  option: (provided, state) => ({
    ...provided,
    color: state.isSelected ? "#fff" : provided.color,
    cursor: "pointer",
  }),
  menu: (provided) => ({
    ...provided,
    zIndex: 9999,
  }),
};

const ManyToManySelect = memo(
  ({
    computedOptions,
    computedOptionForValue,
    newForm,
    loadMoreItems,
    element,
    setValue,
    setDebouncedValue,
    index,
    remove,
    value,
    appendInput,
    append = () => {},
  }) => {
    const multiple_selects = useWatch({
      control: newForm.control,
      name: "multiple_select",
    });

    const changeHandler = (selectedOption) => {
      newForm.setValue(`multiple_select.${index}.value`, selectedOption?.value);
      const computedGuid = multiple_selects?.map((item) => item?.value);
      setValue(computedGuid);
    };

    const removeIds = (option, index) => {
      const filteredGuid = multiple_selects
        ?.filter((item, i) => i !== index)
        ?.map((element) => element?.value);

      setValue(filteredGuid);
      remove(index);

      if (filteredGuid?.length === 0) {
        console.log("entered 1");
        appendInput();
        append({});
      }
    };

    const inputChangeHandler = useDebounce((val) => {
      setDebouncedValue(val);
    }, 300);

    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "0px",
        }}
      >
        <Select
          options={computedOptionForValue ?? []}
          value={computedOptions?.find(
            (option) => option.value === element.value
          )}
          onChange={(value) => {
            changeHandler(value);
          }}
          onInputChange={(_, val) => {
            inputChangeHandler(val);
          }}
          // components={{
          //   DropdownIndicator: null,
          // }}
          onMenuScrollToBottom={loadMoreItems}
          styles={customStyles}
        />

        {value?.length ? (
          <Button
            onClick={() => removeIds(element, index)}
            sx={{width: "50px", padding: "5px 0px", marginLeft: "10px"}}
          >
            <DeleteIcon style={{color: "red"}} />
          </Button>
        ) : (
          ""
        )}
      </Box>
    );
  }
);

export default ManyToManySelect;
