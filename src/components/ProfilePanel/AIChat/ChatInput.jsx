import {InputAdornment, TextField} from "@mui/material";
import React from "react";

function ChatInput({
  loader,
  setInputValue,
  handleSendClick,
  inputValue,
  handleKeyDown,
  setLoader,
}) {
  return (
    <TextField
      multiline={!loader}
      fullWidth
      placeholder="Type your message..."
      value={inputValue}
      onChange={(e) => {
        if (inputValue?.length > 0) {
          setLoader(true);
        }
        setInputValue(e.target.value);
      }}
      onKeyDown={handleKeyDown}
      sx={{
        "& .MuiInputBase-input": {
          width: "316px",
          padding: "10px",
          fontSize: "16px",
          border: "1px solid #000",
          overflow: "hidden",
          borderRadius: "20px",
          paddingRight: "0px",
        },

        "& .MuiOutlinedInput-root": {
          padding: "10px 10px 10px 0px",
          "&.Mui-focused fieldset": {
            borderColor: "transparent",
            borderWidth: 0,
          },
          "& fieldset": {
            borderWidth: 0,
          },
        },
        "& .MuiInputBase-root": {
          paddingRight: 0,
        },
      }}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <button
              disabled={inputValue?.length === 0}
              style={{
                width: "40px",
                height: "40px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "50%",
                border: "none",
                cursor: "pointer",
                background: inputValue?.length ? "#000" : "#eee",
                cursor: inputValue?.length ? "pointer" : "not-allowed",
              }}
              onClick={() => {
                console.log("ssssssss");
                handleSendClick();
              }}>
              <img src="/img/gptSendIcon.svg" alt="" />
            </button>
          </InputAdornment>
        ),
      }}
    />
  );
}

export default ChatInput;
