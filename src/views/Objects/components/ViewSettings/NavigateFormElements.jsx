import React from "react";
import HFTextField from "../../../../components/FormElements/HFTextField";
import RectangleIconButton from "../../../../components/Buttons/RectangleIconButton";
import {Delete} from "@mui/icons-material";
import styles from "./style.module.scss";

function NavigateFormElements({elements, index, form, remove}) {
  const deleteField = (index) => {
    remove(index);
  };

  return (
    <div key={elements?.key} className={styles.navigateWrap}>
      <HFTextField
        fullWidth
        control={form.control}
        name={`attributes.navigate.params[${index}].key`}
        placeholder={"key"}
      />
      <HFTextField
        fullWidth
        control={form.control}
        name={`attributes.navigate.params[${index}].value`}
        placeholder={"value"}
      />
      <RectangleIconButton onClick={() => deleteField(index)} color="error">
        <Delete color="error" />
      </RectangleIconButton>
    </div>
  );
}

export default NavigateFormElements;
