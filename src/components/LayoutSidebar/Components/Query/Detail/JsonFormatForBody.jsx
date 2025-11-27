import { Box, Button } from "@mui/material";
import { useFieldArray } from "react-hook-form";
import { GrClose } from "react-icons/gr";
import InputWithPopUp from "./InputWithPopUp";
import styles from "../style.module.scss";

const JsonFormatForBody = ({ form, control, allText, setAllText }) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "body.body",
  });

  return (
    <Box width="100%">
      <Box>
        <Box border="1px solid #E2E8F0" borderRadius="0.375rem">
          <Box>
            {fields.map((field, index) => (
              <Box
                borderBottom="1px solid #E2E8F0"
                display="flex"
                justifyContent="space-between"
              >
                <Box
                  w="full"
                  display="flex"
                  alignItems="center"
                  pl="5px"
                  maxH="32px !important"
                >
                  <InputWithPopUp
                    allText={allText}
                    setAllText={setAllText}
                    name={`body.body.${index}.key`}
                    form={form}
                    placeholder={"key"}
                  />
                </Box>

                <Box
                  w="full"
                  display="flex"
                  alignItems="center"
                  borderLeft="1px solid #E2E8F0"
                  pl="5px"
                  maxH="32px !important"
                >
                  <InputWithPopUp
                    alltext={allText}
                    setAllText={setAllText}
                    name={`body.body.${index}.value`}
                    form={form}
                    placeholder={"value"}
                  />
                </Box>

                <Box
                  w="32px"
                  h="32px"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  borderLeft="1px solid #E2E8F0"
                >
                  <Button
                    variant="unstyled"
                    isDisabled={fields?.length === 1}
                    className={styles.button}
                    onClick={() => remove(index)}
                  >
                    <GrClose size="15px" />
                  </Button>
                </Box>
              </Box>
            ))}
          </Box>

          <Box>
            <Button
              variant="unstyled"
              colorScheme="gray"
              p="7px"
              onClick={() => append({ key: "", value: "" })}
              color={"#007AFF"}
            >
              + Add new
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default JsonFormatForBody;
