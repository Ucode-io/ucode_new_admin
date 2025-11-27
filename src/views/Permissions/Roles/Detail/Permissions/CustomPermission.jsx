import {Box, Checkbox} from "@mui/material";
import {CTableCell, CTableHeadRow} from "../../../../../components/CTable";

const CustomPermissionRow = ({watch, setValue}) => {
  const handleChange = (e, type) => {
    setValue(`data.global_permission.${type}`, e.target.checked);
  };

  return (
    <>
      <CTableHeadRow>
        <CTableCell>Chat</CTableCell>
        <CTableCell>
          <Box sx={{justifyContent: "center", display: "flex"}}>
            <Checkbox
              checked={watch("data.global_permission.chat")}
              onChange={(e) => handleChange(e, "chat")}
            />
          </Box>
        </CTableCell>
      </CTableHeadRow>
      <CTableHeadRow>
        <CTableCell>Menu button</CTableCell>
        <CTableCell>
          <Box sx={{justifyContent: "center", display: "flex"}}>
            <Checkbox
              checked={watch("data.global_permission.menu_button")}
              onChange={(e) => handleChange(e, "menu_button")}
            />
          </Box>
        </CTableCell>
      </CTableHeadRow>
      <CTableHeadRow>
        <CTableCell>Settings button</CTableCell>
        <CTableCell>
          <Box sx={{justifyContent: "center", display: "flex"}}>
            <Checkbox
              checked={watch("data.global_permission.settings_button")}
              onChange={(e) => handleChange(e, "settings_button")}
            />
          </Box>
        </CTableCell>
      </CTableHeadRow>
      <CTableHeadRow>
        <CTableCell>Projects button</CTableCell>
        <CTableCell>
          <Box sx={{justifyContent: "center", display: "flex"}}>
            <Checkbox
              checked={watch("data.global_permission.projects_button")}
              onChange={(e) => handleChange(e, "projects_button")}
            />
          </Box>
        </CTableCell>
      </CTableHeadRow>
      <CTableHeadRow>
        <CTableCell>Environments button</CTableCell>
        <CTableCell>
          <Box sx={{justifyContent: "center", display: "flex"}}>
            <Checkbox
              checked={watch("data.global_permission.environments_button")}
              onChange={(e) => handleChange(e, "environments_button")}
            />
          </Box>
        </CTableCell>
      </CTableHeadRow>
      <CTableHeadRow>
        <CTableCell>API keys button</CTableCell>
        <CTableCell>
          <Box sx={{justifyContent: "center", display: "flex"}}>
            <Checkbox
              checked={watch("data.global_permission.api_keys_button")}
              onChange={(e) => handleChange(e, "api_keys_button")}
            />
          </Box>
        </CTableCell>
      </CTableHeadRow>
      <CTableHeadRow>
        <CTableCell>Redirects button</CTableCell>
        <CTableCell>
          <Box sx={{justifyContent: "center", display: "flex"}}>
            <Checkbox
              checked={watch("data.global_permission.redirects_button")}
              onChange={(e) => handleChange(e, "redirects_button")}
            />
          </Box>
        </CTableCell>
      </CTableHeadRow>
      <CTableHeadRow>
        <CTableCell>Menu setting button</CTableCell>
        <CTableCell>
          <Box sx={{justifyContent: "center", display: "flex"}}>
            <Checkbox
              checked={watch("data.global_permission.menu_setting_button")}
              onChange={(e) => handleChange(e, "menu_setting_button")}
            />
          </Box>
        </CTableCell>
      </CTableHeadRow>
      <CTableHeadRow>
        <CTableCell>Profile settings button</CTableCell>
        <CTableCell>
          <Box sx={{justifyContent: "center", display: "flex"}}>
            <Checkbox
              checked={watch(
                "data.global_permission.profile_settings_button"
              )}
              onChange={(e) => handleChange(e, "profile_settings_button")}
            />
          </Box>
        </CTableCell>
      </CTableHeadRow>
      <CTableHeadRow>
        <CTableCell>Project Button</CTableCell>
        <CTableCell>
          <Box sx={{justifyContent: "center", display: "flex"}}>
            <Checkbox
              checked={watch("data.global_permission.project_button")}
              onChange={(e) => handleChange(e, "project_button")}
            />
          </Box>
        </CTableCell>
      </CTableHeadRow>
      <CTableHeadRow>
        <CTableCell>Sms Button</CTableCell>
        <CTableCell>
          <Box sx={{justifyContent: "center", display: "flex"}}>
            <Checkbox
              checked={watch("data.global_permission.sms_button")}
              onChange={(e) => handleChange(e, "sms_button")}
            />
          </Box>
        </CTableCell>
      </CTableHeadRow>
      <CTableHeadRow>
        <CTableCell>Version Button</CTableCell>
        <CTableCell>
          <Box sx={{justifyContent: "center", display: "flex"}}>
            <Checkbox
              checked={watch("data.global_permission.version_button")}
              onChange={(e) => handleChange(e, "version_button")}
            />
          </Box>
        </CTableCell>
      </CTableHeadRow>
    </>
  );
};

export default CustomPermissionRow;
