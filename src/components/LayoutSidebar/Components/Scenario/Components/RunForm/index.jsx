import CodeMirror from "@uiw/react-codemirror";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { RxCross2 } from "react-icons/rx";
import ReactJson from "react-json-view";
import { useParams } from "react-router-dom";
import "../../scenarioOverrides.scss";
import { useScenarioRunMutation } from "../../../../../../services/scenarioService";
import runList from "../../../../../../utils/generateRunValues";
import { Box, Button, Divider, Typography } from "@mui/material";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import HFTextField from "../../../../../FormElements/HFTextField";
import HFSelect from "../../../../../FormElements/HFSelect";
import { containsOnlyNumbers } from "../../../../../../utils/contains";

const center = {
  display: "flex",
  alighItems: "center",
  justifyContent: "center",
};

const RunForm = ({ methods }) => {
  const { projectId, scenarioId } = useParams();
  const { handleSubmit, control, setValue, watch } = useForm();
  const [tabIndex, setTabIndex] = useState(0);
  const [response, setResponse] = useState();
  const [text, setText] = useState("");

  const handleTabsChange = (index) => {
    setTabIndex(index);
  };

  const { fields, append, remove } = useFieldArray({
    control,
    name: "keyValues",
  });

  const { mutate: runApi, isLoading: createLoading } = useScenarioRunMutation({
    onSuccess: (res) => {
      //   successToast("Successfully run");
      setResponse(res);
    },
    projectId: projectId,
  });

  const onSubmit = (values) => {
    runApi({
      dag_id: scenarioId,
      body:
        tabIndex === 0
          ? runList(values.keyValues)
          : JSON.parse(values.keyValues),
    });
  };

  return (
    <form>
      <Box
        // style={{
        //   height: "88vh",
        // }}
        _loading={createLoading}
        bg={"#fff"}
      >
        <Box px="12px" py="4px">
          <Typography fontSize={"16px"} fontWeight={600} color="#000">
            New task
          </Typography>
        </Box>
        <Divider color={"#fff"} />
        <Box p="5px">
          <Tabs
            w={"100%"}
            borderBottom={"none"}
            variant="enclosed"
            onChange={handleTabsChange}
          >
            <TabList border={"none"}>
              <Tab
                _selected={{
                  color: "#000",
                  borderBottom: "2px solid #007AFF",
                }}
                borderRadius="0px"
                borderBottom="2px solid #fff"
                width={"50%"}
              >
                Key-Value
              </Tab>
              <Tab
                _selected={{ color: "#000", borderBottom: "2px solid #007AFF" }}
                borderRadius="0px"
                borderBottom="2px solid #fff"
                onClick={() => remove(fields)}
                width={"50%"}
              >
                Code editor
              </Tab>
            </TabList>
            <TabPanel padding={0}>
              <Box padding={"10px"} className="function_node-form">
                <Box border="1px solid #E2E8F0" borderRadius="0.375rem">
                  {fields.map((item, index) => (
                    <Box style={center} borderBottom="1px solid #E2E8F0">
                      <HFTextField
                        control={control}
                        name={`fields.${index}.key`}
                        style={{
                          borderRight: "1px solid #E2E8F0",
                        }}
                        placeholder={"Key"}
                      />
                      <HFTextField
                        control={control}
                        name={`fields.${index}.value`}
                        // setAllText={setText}
                        placeholder="Value"
                        customOnChange={(e) => {
                          setValue(
                            `fields.${index}.type`,
                            containsOnlyNumbers(e.target.value)
                              ? "Number"
                              : "String"
                          );
                        }}
                        height="100%"
                        className="input_with-popup"
                      />

                      <RxCross2
                        fill="white"
                        style={{
                          padding: "0 3px",
                          borderLeft: "1px solid #E2E8F0",
                          cursor: "pointer",
                        }}
                        size={"30px"}
                        onClick={() => remove(fields.length - 1)}
                      />
                    </Box>
                  ))}
                  <Box>
                    <Button
                      variant="unstyled"
                      colorScheme="gray"
                      p="5px"
                      onClick={() => append({ key: "", value: "", type: "" })}
                      color={"#007AFF"}
                    >
                      + Add new
                    </Button>
                  </Box>
                </Box>
              </Box>
              {response ? (
                <Tabs
                  w={"100%"}
                  borderBottom={"none"}
                  variant="enclosed"
                  onChange={handleTabsChange}
                  bg={"#fff"}
                  mt={5}
                  borderTop="1px solid #eef1f6"
                >
                  <TabList border={"none"}>
                    <Tab
                      _selected={{
                        bg: "#fff",
                        borderBottom: "2px #007AFF solid",
                      }}
                      w={143}
                      height="40px"
                      borderRadius="0px"
                      color={"#007AFF"}
                    >
                      Query
                    </Tab>
                    <Tab
                      _selected={{
                        bg: "#fff",
                        borderBottom: "2px #007AFF solid",
                      }}
                      w={143}
                      height="40px"
                      borderRadius="0px"
                      color={"#007AFF"}
                      onClick={() => remove(fields)}
                    >
                      Response
                    </Tab>
                  </TabList>
                  <TabPanel padding={0} mt={4}>
                    <ReactJson
                      src={response}
                      style={{
                        overflow: "auto",
                        height: "200px",
                      }}
                      theme="monokai"
                      collapsed={true}
                    />
                  </TabPanel>
                  <TabPanel padding={0} mt={4}>
                    <Box mt={5}>
                      <CodeMirror
                        height="200px"
                        value={JSON.stringify(response, null, 2)}
                        color="black"
                      />
                    </Box>
                  </TabPanel>
                </Tabs>
              ) : (
                ""
              )}
            </TabPanel>
            <TabPanel padding={0}>
              <Box mt={5}>
                <CodeMirror
                  height="200px"
                  onChange={(value) => {
                    setValue("body", value);
                  }}
                  color="black"
                />
              </Box>
            </TabPanel>
          </Tabs>
          <Button
            variant="contained"
            fullWidth
            onClick={handleSubmit(onSubmit)}
          >
            Run
          </Button>
        </Box>
      </Box>
    </form>
  );
};

export default RunForm;
