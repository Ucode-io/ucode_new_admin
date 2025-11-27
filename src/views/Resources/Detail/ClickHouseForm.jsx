import stringifyQueryParams from "@/utils/stringifyQueryParams";
import {Box, Button, Grid, Stack, Typography} from "@mui/material";
import React, {useMemo} from "react";
import {useWatch} from "react-hook-form";
import Footer from "../../../components/Footer";
import HFSelect from "../../../components/FormElements/HFSelect";
import HFTextField from "../../../components/FormElements/HFTextField";
import VariableResources from "../../../components/LayoutSidebar/Components/Resources/VariableResource";
import {resourceTypes, resources} from "../../../utils/resourceConstants";
import HFNumberField from "../../../components/FormElements/HFNumberField";

const headerStyle = {
  width: "100",
  height: "50px",
  borderBottom: "1px solid #e5e9eb",
  display: "flex",
  padding: "15px",
};

const ClickHouseForm = ({
  control,
  btnLoading,
  selectedEnvironment,
  setSelectedEnvironment,
  projectEnvironments,
  isEditPage,
}) => {
  const environments = useMemo(() => {
    return projectEnvironments?.map((item) => ({
      value: item.id,
      label: item.name,
      name: item.name,
      project_id: item.project_id,
      description: item.description,
      display_color: item.display_color,
      is_configured: item.is_configured,
      id: item.id,
    }));
  }, [projectEnvironments]);

  const resurceType = useWatch({
    control,
    name: "resource_type",
  });

  const type = useWatch({
    control,
    name: "type",
  });

  const onResourceTypeChange = (value) => {
    if (value !== 5) return;

    const queryParams = {
      client_id: import.meta.env.VITE_GITHUB_CLIENT_ID,
      redirect_uri: window.location.href,
      scope: "read:user,repo",
    };

    window.location.assign(
      "https://github.com/login/oauth/authorize?" +
        stringifyQueryParams(queryParams)
    );
  };
  // host, port, username, password, database
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
              // borderBottom: "1px solid #e5e9eb",
              padding: "15px",
              fontWeight: "bold",
            }}>
            <Box sx={{fontSize: "14px", marginBottom: "15px"}}>Host</Box>
            <HFTextField
              control={control}
              required
              disabled={true}
              name="host"
              fullWidth
              inputProps={{
                placeholder: "Resource name",
              }}
            />

            <Box
              sx={{fontSize: "14px", marginTop: "10px", marginBottom: "10px"}}>
              Port
            </Box>

            <HFTextField
              control={control}
              required
              disabled={true}
              name="port"
              fullWidth
              inputProps={{
                placeholder: "Resource name",
              }}
            />

            <Box
              sx={{fontSize: "14px", marginTop: "10px", marginBottom: "10px"}}>
              username
            </Box>

            <HFTextField
              control={control}
              required
              disabled={true}
              name="username"
              fullWidth
              inputProps={{
                placeholder: "Resource name",
              }}
            />

            <Box
              sx={{fontSize: "14px", marginTop: "10px", marginBottom: "10px"}}>
              password
            </Box>

            <HFTextField
              control={control}
              required
              disabled={true}
              name="password"
              fullWidth
              inputProps={{
                placeholder: "Resource name",
              }}
            />

            <Box
              sx={{fontSize: "14px", marginTop: "10px", marginBottom: "10px"}}>
              database
            </Box>

            <HFTextField
              control={control}
              required
              disabled={true}
              name="database"
              fullWidth
              inputProps={{
                placeholder: "Resource name",
              }}
            />
          </Box>
        </Stack>
      </Box>
      {resurceType === 4 && <VariableResources control={control} />}

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

export default ClickHouseForm;
