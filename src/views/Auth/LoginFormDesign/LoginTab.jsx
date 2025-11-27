import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import {Box, InputAdornment, Typography, IconButton} from "@mui/material";
import React, {useState} from "react";
import PrimaryButton from "../../../components/Buttons/PrimaryButton";
import HFTextFieldLogin from "../../../components/FormElements/HFTextFieldLogin";

function LoginTab({control, loading = false}) {
  const [showPassword, setShowPassword] = useState(false);
  console.log("ENTERED TO LOGIN TAB");
  return (
    <Box>
      <Box sx={{marginBottom: "24px"}}>
        <Typography
          sx={{
            fontSize: "14px",
            fontWeight: 500,
            color: "#0f172a",
            marginBottom: "8px",
          }}>
          Username
        </Typography>
        <HFTextFieldLogin
          required
          control={control}
          name="username"
          placeholder="Enter your username"
          fullWidth
          autoFocus
          InputProps={{
            sx: {
              borderRadius: "8px",
              backgroundColor: "#ffffff",
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "#d1d5db",
                borderWidth: "1px",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "#9ca3af",
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "#7c3aed",
                borderWidth: "2px",
                boxShadow: "0 0 0 3px rgba(124, 58, 237, 0.1)",
              },
              "& input": {
                padding: "8px 14px",
                fontSize: "15px",
                color: "#0f172a",
              },
            },
          }}
        />
      </Box>

      <Box sx={{marginBottom: "32px"}}>
        <Typography
          sx={{
            fontSize: "14px",
            fontWeight: 500,
            color: "#0f172a",
            marginBottom: "8px",
          }}>
          Password
        </Typography>
        <HFTextFieldLogin
          required
          control={control}
          name="password"
          type={showPassword ? "text" : "password"}
          fullWidth
          placeholder="Enter your password"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                  sx={{
                    color: "#64748b",
                    "&:hover": {
                      backgroundColor: "rgba(124, 58, 237, 0.08)",
                    },
                  }}>
                  {showPassword ? (
                    <VisibilityOffIcon sx={{fontSize: "20px"}} />
                  ) : (
                    <VisibilityIcon sx={{fontSize: "20px"}} />
                  )}
                </IconButton>
              </InputAdornment>
            ),
            sx: {
              borderRadius: "8px",
              backgroundColor: "#ffffff",
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "#d1d5db",
                borderWidth: "1px",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "#9ca3af",
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "#7c3aed",
                borderWidth: "2px",
                boxShadow: "0 0 0 3px rgba(124, 58, 237, 0.1)",
              },
              "& input": {
                padding: "8px 14px",
                fontSize: "15px",
                color: "#0f172a",
              },
            },
          }}
        />
      </Box>

      <PrimaryButton
        type="submit"
        size="large"
        style={{
          width: "100%",
          borderRadius: "8px",
          padding: "14px",
          fontSize: "15px",
          fontWeight: 600,
          textTransform: "none",
          backgroundColor: "#7c3aed",
          boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
          transition: "all 0.2s ease",
          border: "none",
        }}
        loader={loading}>
        Sign in
      </PrimaryButton>
    </Box>
  );
}

export default LoginTab;
