import {Box} from "@mui/material";
import {useFieldArray} from "react-hook-form";
import styles from "./styles.module.scss";
import VariableRow from "./VariableRow";

const headerStyle = {
  width: "100",
  height: "50px",
  // borderBottom: "1px solid #e5e9eb",
  display: "flex",
  padding: "15px",
  marginTop: "10px",
};

const VariableResources = ({control}) => {
  const {fields, append, remove, update} = useFieldArray({
    control: control,
    name: "variables",
  });

  const appendVariable = () => {
    append({
      key: "",
      value: "",
    });
  };

  return (
    <>
      <Box sx={headerStyle}>
        <h2 variant="h6">Variable Resource</h2>
      </Box>
      <Box style={{height: "calc(100vh - 400px)", overflow: "scroll"}}>
        <div className="">
          <div className={styles.actionSettingBlock}>
            {fields?.map((summary, index) => (
              <VariableRow
                summary={summary}
                control={control}
                index={index}
                update={update}
                remove={remove}
                variables={fields}
              />
            ))}
          </div>
        </div>

        <div className={styles.summaryButton} onClick={appendVariable}>
          <button type="button">+ Create new</button>
        </div>
      </Box>
    </>
  );
};

export default VariableResources;
