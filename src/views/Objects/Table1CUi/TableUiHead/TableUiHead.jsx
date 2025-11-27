import {Box, Button, Menu} from "@mui/material";
import React, {useState} from "react";
import styles from "./style.module.scss";
import {useMenuGetByIdQuery} from "../../../../services/menuService";
import {useNavigate, useParams} from "react-router-dom";
import SettingsIcon from "@mui/icons-material/Settings";
import ShareModal from "../../ShareModal/ShareModal";
import PermissionWrapperV2 from "../../../../components/PermissionWrapper/PermissionWrapperV2";
import NewViewTabSelector from "./NewViewTabSelector";

function TableUiHead({
  menuItem,
  selectedTabIndex,
  setSelectedTabIndex,
  views,
  settingsModalVisible,
  setSettingsModalVisible,
  isChanged,
  setIsChanged,
  selectedView,
  setSelectedView,
}) {
  const {appId, tableSlug} = useParams();
  const [parentMenu, setParentMenu] = useState();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const {loader: menuLoader} = useMenuGetByIdQuery({
    menuId: appId,
    queryParams: {
      enabled: Boolean(appId),
      onSuccess: (res) => {
        setParentMenu(res);
      },
    },
  });

  const navigateToSettingsPage = () => {
    const url = `/settings/constructor/apps/${appId}/objects/${menuItem?.table_id}/${menuItem?.data?.table?.slug}?menuId=${menuItem?.id}`;
    navigate(url);
  };

  return (
    <div className={styles.tableUiHead}>
      <Box sx={{display: "flex", gap: "6px", alignItems: "center"}}>
        <Box
          sx={{cursor: "pointer"}}
          onClick={(e) => {
            handleClick(e);
          }}>
          <img src="/img/homeIcon.svg" alt="" />
        </Box>
        <Menu open={open} onClose={handleClose} anchorEl={anchorEl}>
          <Box sx={{width: "150px", padding: "10px"}}>
            <Box sx={{padding: "5px 0"}}>
              <Box
                sx={{fontWeight: 500, fontSize: "12px", cursor: "pointer"}}
                onClick={() => navigate(`/main/${appId}`)}>
                {parentMenu?.label}
              </Box>
            </Box>
            <Box sx={{padding: "5px 0"}}>
              <Box sx={{color: "#337E28", fontWeight: 600, fontSize: "12px"}}>
                {menuItem?.label ?? ""}
              </Box>
            </Box>
          </Box>
        </Menu>
        <NewViewTabSelector
          selectedTabIndex={selectedTabIndex}
          setSelectedTabIndex={setSelectedTabIndex}
          views={views}
          settingsModalVisible={settingsModalVisible}
          setSettingsModalVisible={setSettingsModalVisible}
          isChanged={isChanged}
          setIsChanged={setIsChanged}
          selectedView={selectedView}
          setSelectedView={setSelectedView}
          menuItem={menuItem}
        />
      </Box>
      <Box sx={{display: "flex", alignItems: "center", gap: "12px"}}>
        <PermissionWrapperV2 tableSlug={tableSlug} type="share_modal">
          <ShareModal newTableView={true} />
        </PermissionWrapperV2>

        <PermissionWrapperV2 tableSlug={tableSlug} type="settings">
          <Button
            variant="outlined"
            onClick={navigateToSettingsPage}
            style={{
              borderColor: "#337E28",
              width: "35px",
              height: "35px",
              padding: "0px",
              minWidth: "35px",
            }}>
            <SettingsIcon
              style={{
                color: "#337E28",
              }}
            />
          </Button>
        </PermissionWrapperV2>
      </Box>
    </div>
  );
}

export default TableUiHead;
