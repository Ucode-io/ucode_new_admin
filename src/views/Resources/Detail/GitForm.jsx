import {Box, Button, Stack} from "@mui/material";
import React from "react";
import Footer from "../../../components/Footer";
import HFSelect from "../../../components/FormElements/HFSelect";
import HFTextField from "../../../components/FormElements/HFTextField";
import {resources} from "../../../utils/resourceConstants";
import {useWatch} from "react-hook-form";

const headerStyle = {
  width: "100",
  height: "50px",
  borderBottom: "1px solid #e5e9eb",
  display: "flex",
  padding: "15px",
};

const GitForm = ({
  control,
  btnLoading,
  selectedEnvironment,
  setSelectedEnvironment,
  projectEnvironments,
  isEditPage,
}) => {
  return (
    <Box
      flex={1}
      sx={{borderRight: "1px solid #e5e9eb", height: `calc(100vh - 50px)`}}>
      <Box sx={headerStyle}>
        <h2 variant="h6">Resource info</h2>
      </Box>

      <Box
        style={{
          overflow: "auto",
        }}>
        <Stack spacing={4}>
          <Box
            sx={{
              padding: "15px",
              fontWeight: "bold",
            }}>
            <Box sx={{fontSize: "14px", marginBottom: "15px"}}>Name</Box>
            <HFTextField
              control={control}
              required
              name="name"
              fullWidth
              inputProps={{
                placeholder: "Resource name",
              }}
            />

            <Box
              sx={{
                fontSize: "14px",
                marginTop: "10px",
                marginBottom: "10px",
              }}>
              Type
            </Box>
            <HFSelect
              options={resources}
              control={control}
              required
              name="type"
              disabled={true}
            />
            <Box
              sx={{
                fontSize: "14px",
                marginTop: "10px",
                marginBottom: "15px",
              }}>
              Gihub username
            </Box>
            <HFTextField
              control={control}
              required
              name="username"
              fullWidth
              disabled
              inputProps={{
                placeholder: "Github username",
              }}
            />
          </Box>
        </Stack>
      </Box>

      <Footer>
        {selectedEnvironment?.length && (
          <Button type="submit" variant="contained" disabled={btnLoading}>
            Save
          </Button>
        )}
      </Footer>
    </Box>
  );
};

export default GitForm;
