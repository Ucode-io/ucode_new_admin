import { Box, Button } from "@mui/material";
import { RxCross2 } from "react-icons/rx";
import HFSelect from "../../../../../FormElements/HFSelect";
import HFTextField from "../../../../../FormElements/HFTextField";
import "../../scenarioOverrides.scss";
import { conditions } from "../Mock";

const center = {
  display: "flex",
  alighItems: "center",
  justifyContent: "center",
};
const column = {
  flexDirection: "column",
};

const FunctionNodeBlock = ({ fields, append, remove, control, setValue }) => {
  const containsOnlyNumbers = (str) => {
    return /^[0-9]+$/.test(str);
  };

  return (
    <>
      <Box
        style={{ ...center, ...column }}
        border="1px solid #E2E8F0"
        borderRadius="0.375rem"
        mb={2}
        mt={1}
      >
        {fields?.map((item, index) => (
          <Box
            style={center}
            key={item.id}
            borderBottom="1px solid #E2E8F0"
            alignItems={"center"}
          >
            <Box style={center} alignItems="center" w={"100%"}>
              <HFTextField
                control={control}
                name={`request_info.blocks.${index}.conditions.${index}.key`}
                placeholder={"Key"}
                className="function_node-form"
              />
              <HFSelect
                className="condition_select"
                options={conditions}
                control={control}
                useBasicStyles
                selectedOptionStyle="check"
                closeMenuOnSelect={false}
                name={`request_info.blocks.${index}.conditions.${index}.operator`}
                placeholder="Condition"
              />
              <HFTextField
                name={`request_info.blocks.${index}.conditions.${index}.value`}
                control={control}
                placeholder={"Value"}
                // setAllText={setText}
                onChange={(e) => {
                  setValue(
                    `blocks.${index}.conditions.${index}.type`,
                    containsOnlyNumbers(e.target.value) ? "Number" : "String"
                  );
                }}
                className={"condition_input"}
              />
            </Box>
            <RxCross2
              fill="white"
              size={"24px"}
              style={{
                borderLeft: "1px solid #E2E8F0",
                padding: "0 3px",
                cursor: "pointer",
              }}
              onClick={() => remove(fields.length - 1)}
            />
          </Box>
        ))}
        <Box>
          <Button
            variant="text"
            p="5px"
            onClick={() => append({ key: "", value: "", type: "" })}
          >
            + Add new
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default FunctionNodeBlock;
