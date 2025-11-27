import React from "react";
import {Box, Paper, Typography} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

function UserChat({msg, index}) {
  return (
    <Box
      key={index}
      sx={{
        display: "flex",
        alignItems: "center",
        margin: "10px",
        justifyContent: "flex-end",
      }}>
      <Paper
        sx={{
          padding: "10px",
          backgroundColor: "#F4F4F4",
          alignSelf: "flex-end",
          maxWidth: "70%",
          color: "#000",
          wordBreak: "break-all",
          borderRadius: "20px",
          padding: "10px 10px 10px 10px",
          minHeight: "40px",
          marginRight: "10px",
        }}>
        <Typography sx={{fontSize: "14px", padding: "5px 10px"}}>
          {msg.text}
        </Typography>
      </Paper>
      <AccountCircleIcon sx={{width: "24px", height: "24px"}} />
    </Box>
  );
}

export default UserChat;
