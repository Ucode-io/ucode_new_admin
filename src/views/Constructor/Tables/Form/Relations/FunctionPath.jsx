import { Button } from "@mui/material";
import React from "react";
import HFSelect from "../../../../../components/FormElements/HFSelect";
import styles from "./style.module.scss";

function FunctionPath({ control, watch, functions, setValue }) {
  const clear = () => {
    setValue("function_path", "");
  };

  return (
    <>
      <div className={styles.input_control}>
        <HFSelect control={control} name="function_path" options={functions} />
        <Button
          style={{
            marginTop: "10px",
            width: "100%",
          }}
          variant="outlined"
          color="error"
          onClick={clear}
        >
          Clear Function
        </Button>
      </div>
    </>
  );
}

export default FunctionPath;
