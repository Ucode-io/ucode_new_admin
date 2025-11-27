import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  Drawer,
} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ViewInArIcon from "@mui/icons-material/ViewInAr";
import ClearIcon from "@mui/icons-material/Clear";
import {useRef, useState} from "react";
import {useQueryLogById} from "../../../../../services/queryService";
import {useParams} from "react-router-dom";
import CodeMirror from "@uiw/react-codemirror";
import ReactJson from "react-json-view";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import QueryLogBody from "./QueryLogBody";

const tableStyles = {
  borderRadius: "0px",
  borderLeft: "none",
  borderBottomLeftRadius: "0px !important",
  borderBottom: "1px solid #ccc",
  background: "#fff",
  overflow: "hidden",
};

const codeMirrorStyles = {
  height: "250px",
  overflow: "scroll",
  borderBottomRightRadius: "8px",
  borderBottomLeftRadius: "8px",
};

const labelStyles = {
  width: "100%",
  background: "#272822",
  borderBottom: "0.5px solid #eee",
  borderTopLeftRadius: "8px",
  borderTopRightRadius: "8px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "5px",
};

const QueryLogs = ({}) => {
  const {queryId} = useParams();
  const jsonRef = useRef();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [requestSuccess, setRequestSuccess] = useState(false);
  const [responseSuccess, setResponseSuccess] = useState(false);

  const handleCopy = (item, type) => {
    let jsonString = "";
    if (typeof item !== "string") {
      jsonString = JSON.stringify(item, null, 2);
    } else {
      jsonString = item;
    }

    navigator.clipboard
      .writeText(jsonString)
      .then(() => {
        if (type === "request") {
          setRequestSuccess(true);
          setTimeout(() => {
            setRequestSuccess(false);
          }, 500);
        } else if (type === "response") {
          setResponseSuccess(true);
          setTimeout(() => {
            setResponseSuccess(false);
          }, 500);
        }
      })
      .catch((error) => {
        console.error("Error copying to clipboard:", error);
      });
  };

  const handleRowClick = (row) => {
    setIsDrawerOpen(true);
    setSelectedRow(row);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedRow(null);
  };

  const {data: logs} = useQueryLogById({
    id: queryId,
    queryParams: {
      cacheTime: false,
      onSuccess: (res) => {
        console.log("res", res);
      },
    },
  });

  return (
    <>
      <Box p="16px">
        <Box sx={{display: "flex", alignItems: "center"}}>
          <Box
            size="small"
            sx={{
              borderRadius: "50%",
              width: "35px",
              height: "35px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#eeee",
              marginRight: "10px",
            }}
          >
            <AccessTimeIcon />
          </Box>
          <Typography fontSize={"18px"} fontWeight="700" textAlign="end">
            Activity Feed
          </Typography>
        </Box>
        <Paper sx={{width: "100%", overflow: "hidden"}}>
          <TableContainer sx={{margin: "10px", maxHeight: 340}}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{
                      ...tableStyles,
                      fontSize: "14px",
                    }}
                    width={30}
                  >
                    Request
                  </TableCell>
                  <TableCell
                    width={100}
                    align="right"
                    sx={{
                      ...tableStyles,
                      fontSize: "14px",
                    }}
                  >
                    Response
                  </TableCell>
                  <TableCell
                    sx={{
                      ...tableStyles,
                      fontSize: "14px",
                    }}
                    width={100}
                    align="right"
                  >
                    User
                  </TableCell>
                  <TableCell
                    sx={{
                      ...tableStyles,
                      fontSize: "14px",
                    }}
                    width={100}
                    align="right"
                  >
                    Duration
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {logs?.logs?.map((row) => (
                  <QueryLogBody
                    row={row}
                    tableStyles={tableStyles}
                    handleRowClick={handleRowClick}
                  />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>

      <Drawer anchor="right" open={isDrawerOpen} onClose={handleCloseDrawer}>
        <Box p="16px" style={{width: 500}}>
          <Box
            sx={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography fontSize={"24px"} fontWeight="600" textAlign="end">
              Activity Feed
            </Typography>
            <Button
              sx={{background: "none", padding: 0}}
              onClick={handleCloseDrawer}
            >
              <ClearIcon
                sx={{width: "40px", fontSize: "24px", color: "#000"}}
              />
            </Button>
          </Box>
          <Box sx={{padding: "20px 0px 0 0"}}>
            <Box>
              <Box
                sx={{
                  ...labelStyles,
                }}
              >
                <Typography
                  fontSize={"16px"}
                  fontWeight="600"
                  style={{color: "#fff", marginLeft: "10px"}}
                >
                  Request:
                </Typography>
                <Button
                  onClick={() => {
                    handleCopy(selectedRow?.request, "request");
                  }}
                >
                  {requestSuccess ? <DoneAllIcon /> : <ContentCopyIcon />}
                </Button>
              </Box>

              <ReactJson
                src={selectedRow?.request ? selectedRow?.request : {}}
                ref={jsonRef}
                style={{
                  ...codeMirrorStyles,
                }}
                theme="monokai"
                collapsed={false}
                enableClipboard={false}
              />
            </Box>
          </Box>
          <Box sx={{padding: "20px 0px 0 0"}}>
            {selectedRow && (
              <Box>
                <Box
                  sx={{
                    ...labelStyles,
                  }}
                >
                  <Typography
                    fontSize={"16px"}
                    fontWeight="600"
                    style={{color: "#fff", marginLeft: "10px"}}
                  >
                    Response:
                  </Typography>
                  <Button
                    onClick={() => {
                      handleCopy(selectedRow?.response, "response");
                    }}
                  >
                    {responseSuccess ? <DoneAllIcon /> : <ContentCopyIcon />}
                  </Button>
                </Box>
                <ReactJson
                  src={
                    selectedRow?.response
                      ? JSON.parse(selectedRow?.response)
                      : ""
                  }
                  ref={jsonRef}
                  style={{
                    ...codeMirrorStyles,
                  }}
                  theme="monokai"
                  collapsed={false}
                  enableClipboard={false}
                />
              </Box>
            )}
          </Box>
          <Box
            sx={{
              padding: "20px 0px 0 0",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <Typography fontSize={"16px"} fontWeight="600">
              User:
            </Typography>
            {selectedRow && (
              <Box>
                <Typography fontSize={"15px"}>
                  {selectedRow.user_data?.login ??
                    selectedRow?.user_data?.email ??
                    selectedRow?.user_data?.phone}
                </Typography>
              </Box>
            )}
          </Box>
          <Box
            sx={{
              padding: "20px 0px 0 0",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <Typography fontSize={"16px"} fontWeight="600">
              Duration:
            </Typography>
            {selectedRow && (
              <Typography fontSize={"15px"}>
                {selectedRow.duration} s
              </Typography>
            )}
          </Box>
        </Box>
      </Drawer>
    </>
  );
};

export default QueryLogs;
