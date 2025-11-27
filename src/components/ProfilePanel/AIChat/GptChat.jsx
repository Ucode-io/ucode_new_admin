import {Box, Paper, Typography} from "@mui/material";
import React from "react";
import Typewriter from "./TypeWriter";
import styles from "./style.module.scss";

function Loader() {
  return (
    <div
      className={styles.animated_text}
      sx={{fontSize: "12px", fontWeight: "bold"}}>
      Analyzing...
    </div>
  );
}

function GptChat({index, msg}) {
  return (
    <Box
      key={index}
      sx={{
        display: "flex",
        alignItems: "center",
        margin: "10px",
        justifyContent: "flex-start",
      }}>
      <img width={24} height={24} src="/img/chat.png" alt="" />
      <Paper
        sx={{
          padding: "10px",
          backgroundColor: "#fff",
          alignSelf: "flex-start",
          maxWidth: "80%",
          color: "#000",
          wordBreak: "break-all",
          borderRadius: "20px",
          padding: "10px 15px 10px 10px",
          minHeight: "40px",
        }}>
        {msg.errorText ? (
          <Typography sx={{fontSize: "14px", color: "red"}}>
            {msg.errorText}
          </Typography>
        ) : msg.type === "loader" ? (
          <Loader />
        ) : (
          <Typography sx={{fontSize: "14px"}}>
            <Typewriter text={msg.text} delay={69} />
          </Typography>
        )}
      </Paper>
    </Box>
  );
}

export default GptChat;
