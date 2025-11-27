import stringifyQueryParams from "@/utils/stringifyQueryParams";
import {Box, Button, Grid, Stack, Typography} from "@mui/material";
import React, {useMemo, useState} from "react";
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

const Form = ({
  control,
  btnLoading,
  selectedEnvironment,
  setSelectedEnvironment,
  projectEnvironments,
  isEditPage,
}) => {
  const environments = useMemo(() => {
    return projectEnvironments?.map((item) => ({
      value: item.environment_id ?? item.id,
      label: item.name,
      name: item.name,
      project_id: item.project_id,
      description: item.description,
      display_color: item.display_color,
      is_configured: item.is_configured,
      id: item?.id,
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
              sx={{fontSize: "14px", marginTop: "10px", marginBottom: "10px"}}>
              Type
            </Box>
            <HFSelect
              options={resourceTypes}
              control={control}
              onChange={onResourceTypeChange}
              required
              name="resource_type"
              resurceType={resurceType}
              disabled={isEditPage}
            />

            {Boolean(resurceType === 7 || type === "SMTP") && (
              <>
                <Box
                  sx={{
                    fontSize: "14px",
                    marginTop: "10px",
                    marginBottom: "10px",
                  }}>
                  Email
                </Box>
                <HFTextField
                  control={control}
                  required
                  name={`settings.smtp.email`}
                  fullWidth
                  inputProps={{
                    placeholder: "Email",
                  }}
                />
                <Box
                  sx={{
                    fontSize: "14px",
                    marginTop: "10px",
                    marginBottom: "15px",
                  }}>
                  Password
                </Box>
                <HFTextField
                  control={control}
                  required
                  name="settings.smtp.password"
                  fullWidth
                  inputProps={{
                    placeholder: "Password",
                  }}
                />
                <Box
                  sx={{
                    fontSize: "14px",
                    marginTop: "10px",
                    marginBottom: "10px",
                  }}>
                  Default otp
                </Box>
                <HFTextField
                  control={control}
                  required
                  name={`settings.smtp.default_otp`}
                  fullWidth
                  inputProps={{
                    placeholder: "Default otp",
                  }}
                />
                <Box
                  sx={{
                    fontSize: "14px",
                    marginTop: "10px",
                    marginBottom: "15px",
                  }}>
                  Number of otp
                </Box>
                <HFNumberField
                  control={control}
                  required
                  name="settings.smtp.number_of_otp"
                  fullWidth
                  type="number"
                  inputProps={{
                    placeholder: "Number of otp",
                  }}
                />
              </>
            )}

            {Boolean(resurceType === 6 || type === "SMS") && (
              <>
                <Box
                  sx={{
                    fontSize: "14px",
                    marginTop: "10px",
                    marginBottom: "10px",
                  }}>
                  Default otp
                </Box>
                <HFTextField
                  control={control}
                  required
                  name={`settings.sms.default_otp`}
                  fullWidth
                  inputProps={{
                    placeholder: "Default otp",
                  }}
                />
                <Box
                  sx={{
                    fontSize: "14px",
                    marginTop: "10px",
                    marginBottom: "15px",
                  }}>
                  Login
                </Box>
                <HFTextField
                  control={control}
                  required
                  name="settings.sms.login"
                  fullWidth
                  inputProps={{
                    placeholder: "Login",
                  }}
                />
                <Box
                  sx={{
                    fontSize: "14px",
                    marginTop: "10px",
                    marginBottom: "15px",
                  }}>
                  Number of otp
                </Box>
                <HFNumberField
                  control={control}
                  required
                  name="settings.sms.number_of_otp"
                  fullWidth
                  type="number"
                  inputProps={{
                    placeholder: "Number of otp",
                  }}
                />
                <Box
                  sx={{
                    fontSize: "14px",
                    marginTop: "10px",
                    marginBottom: "15px",
                  }}>
                  Originator
                </Box>
                <HFTextField
                  control={control}
                  required
                  name="settings.sms.originator"
                  fullWidth
                  inputProps={{
                    placeholder: "Originator",
                  }}
                />
                <Box
                  sx={{
                    fontSize: "14px",
                    marginTop: "10px",
                    marginBottom: "15px",
                  }}>
                  Password
                </Box>
                <HFTextField
                  control={control}
                  required
                  name="settings.sms.password"
                  fullWidth
                  inputProps={{
                    placeholder: "Password",
                  }}
                />
              </>
            )}

            {resurceType === 5 || type === "GITHUB" ? (
              <>
                {/* <Box
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
                /> */}
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
                  name="integration_resource.username"
                  fullWidth
                  disabled
                  inputProps={{
                    placeholder: "Github username",
                  }}
                />
              </>
            ) : null}
          </Box>

          {!isEditPage && (
            <Box sx={{marginTop: "0px", padding: "15px"}} px={2}>
              <Box sx={{fontSize: "14px", marginBottom: "10px"}}>
                Environment
              </Box>
              <HFSelect
                options={environments}
                control={control}
                required
                name="environment_id"
                onChange={(value) => {
                  setSelectedEnvironment(value);
                }}
              />
            </Box>
            // </h2>
          )}
        </Stack>

        {/* <Divider /> */}

        {/* {selectedEnvironment?.length > 0 && (
          <>
            <Box sx={{padding: "15px", fontSize: "24px"}}>
              <Typography variant="h6">Credentials</Typography>
            </Box>

            <Grid px={2} container spacing={2}>
              <Grid item xs={6} sx={{paddingLeft: "0px"}}>
                <Box width={50} sx={{fontSize: "14px"}}>
                  Host
                </Box>
                <HFTextField
                  fullWidth
                  control={control}
                  required
                  name="credentials.host"
                />
              </Grid>
              <Grid item xs={6}>
                <Box sx={{fontSize: "14px"}}>Port</Box>
                <HFTextField
                  fullWidth
                  control={control}
                  required
                  name="credentials.port"
                />
              </Grid>
              <Grid item xs={6}>
                <Box sx={{fontSize: "14px"}}>Username</Box>
                <HFTextField
                  control={control}
                  required
                  fullWidth
                  name="credentials.username"
                />
              </Grid>
              <Grid item xs={6}>
                <Box sx={{fontSize: "14px"}}>Database</Box>
                <HFTextField
                  control={control}
                  required
                  fullWidth
                  name="credentials.database"
                />
              </Grid>
              {true && (
                <Grid item xs={6}>
                  <Box mb={4}>
                    <Box sx={{fontSize: "14px"}}>Password</Box>
                    <HFTextField
                      fullWidth
                      control={control}
                      name="credentials.password"
                    />
                  </Box>
                </Grid>
              )}
            </Grid>
          </>
        )} */}
      </Box>
      {resurceType === 4 && <VariableResources control={control} />}

      <Footer>
        {/* {selectedEnvironment?.length && (
          <Button type="submit" variant="contained" disabled={btnLoading}>
            Save
          </Button>
        )} */}
      </Footer>
    </Box>
  );
};

export default Form;
