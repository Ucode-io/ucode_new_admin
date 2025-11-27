import {Box} from "@mui/material";
import React, {useEffect} from "react";
import {useFieldArray} from "react-hook-form";
import FEditableRow from "../../../../components/FormElements/FEditableRow";
import styles from "./style.module.scss";
import NavigateFormElements from "./NavigateFormElements";

function NavigateGenerator({form}) {
  const {
    fields: values,
    append,
    remove,
  } = useFieldArray({
    control: form.control,
    name: "attributes.navigate.params",
  });

  const addField = () => {
    append({
      key: "",
      value: "",
    });
  };

  return (
    <Box mt={3}>
      <div>
        <FEditableRow label="Params" />
        {values?.map((elements, index) => (
          <NavigateFormElements
            form={form}
            index={index}
            elements={elements}
            remove={remove}
          />
        ))}
      </div>
      <button className={styles.addBtn} onClick={addField}>
        Add
      </button>
    </Box>
  );
}

export default NavigateGenerator;
