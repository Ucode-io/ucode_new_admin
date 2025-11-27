import ReactJson from "react-json-view";
import CodeMirrorWithPopUp from "./CodeMirrorWithPopUp";
import CodeMirror from "@uiw/react-codemirror";
import { Box, Typography } from "@mui/material";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";

const QueryForClickHouse = ({ form, responseQuery }) => {
  return (
    <>
      <Box width="100%" borderRadius="0.375rem">
        <CodeMirrorWithPopUp form={form} name={"body.body"} />
      </Box>

      {responseQuery ? (
        <Box mt={"50px"}>
          <Typography mb="10px">Response</Typography>

          <Box width="100%" borderRadius="0.375rem" overflow="hidden">
            <Tabs>
              <TabList>
                <Tab>Tree</Tab>
                <Tab>Raw</Tab>
              </TabList>

              <TabPanel>
                <ReactJson
                  src={responseQuery}
                  theme="monokai"
                  collapsed={true}
                />
              </TabPanel>
              <TabPanel>
                <CodeMirror
                  value={JSON.stringify(responseQuery, null, 2)}
                  height="auto"
                  width="100%"
                  color="#00C387"
                  theme={"dark"}
                />
              </TabPanel>
            </Tabs>
          </Box>
        </Box>
      ) : (
        ""
      )}
    </>
  );
};

export default QueryForClickHouse;
