import React from "react";
import styles from "./styles.module.scss";
import {Outlet} from "react-router-dom";
import {Box, Typography} from "@mui/material";

function AuthLayoutDesign() {
  return (
    <div className={styles.layout} style={{margin: 0, padding: 0}}>
      <div className={styles.leftSide}>
        <Box
          sx={{
            backgroundColor: "#ffffff",
            borderRadius: "12px",
            padding: "40px",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)",
          }}>
          <Box sx={{textAlign: "left", marginBottom: "32px"}}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                color: "#0f172a",
                fontSize: "26px",
                lineHeight: 1.2,
              }}>
              Sign in to your account
            </Typography>
          </Box>

          <div>
            <Outlet />
          </div>
        </Box>
      </div>
    </div>
  );
}

export default AuthLayoutDesign;
