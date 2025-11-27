import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { Box, Button, Collapse, Tooltip } from "@mui/material";
import { useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import clientTypeServiceV2 from "../../../../services/auth/clientTypeServiceV2";
import { menuActions } from "../../../../store/menuItem/menuItem.slice";
import IconGenerator from "../../../IconPicker/IconGenerator";
import "../../style.scss";
import AddIcon from "@mui/icons-material/Add";
import FolderCreateModal from "./Modal/FolderCreateModal";
import PermissionSidebarRecursiveBlock from "./PermissionSidebarRecursiveBlock";
import activeStyles from "../MenuUtils/activeStyles";
export const adminId = `${import.meta.env.VITE_ADMIN_FOLDER_ID}`;

const permissionFolder = {
  label: "Permissions",
  type: "USER_FOLDER",
  icon: "lock.svg",
  parent_id: adminId,
  id: "14",
  data: {
    permission: {
      read: true,
      write: true,
      delete: true,
      update: true,
    },
  },
};

const Permissions = ({
  level = 1,
  menuStyle,
  setElement,
}) => {
  const dispatch = useDispatch();
  const [childBlockVisible, setChildBlockVisible] = useState(false);
  const [child, setChild] = useState();
  const [selectedUserFolder, setSelectedUserFolder] = useState(null);
  const [userFolderModalType, setUserFolderModalType] = useState(null);
  const closeUserFolderModal = () => setSelectedUserFolder(null);
  const menuItem = useSelector((state) => state.menu.menuItem);
  const activeStyle = activeStyles({ menuItem, element: permissionFolder, menuStyle, level });

  const openUserFolderModal = (folder, type) => {
    setSelectedUserFolder(folder);
    setUserFolderModalType(type);
  };

  const iconStyle = {
    color:
      permissionFolder?.id === menuItem?.id
        ? menuStyle?.active_text
        : menuStyle?.text || "",
  };

  const labelStyle = {
    color:
      permissionFolder?.id === menuItem?.id
        ? menuStyle?.active_text
        : menuStyle?.text,
  };

  const { isLoading } = useQuery(
    ["GET_CLIENT_TYPE_PERMISSION", permissionFolder],
    () => {
      return clientTypeServiceV2.getList();
    },
    {
      cacheTime: 10,
      enabled: Boolean(permissionFolder),
      onSuccess: (res) => {
        setChild(
          res.data.response?.map((row) => ({
            ...row,
            type: "PERMISSION",
            id: row.guid,
            parent_id: "13",
            data: {
              permission: {
                read: true,
              },
            },
          }))
        );
      },
    }
  );

  const clickHandler = (e) => {
    e.stopPropagation();
    setChildBlockVisible((prev) => !prev);
    dispatch(menuActions.setMenuItem(permissionFolder));
  };

  return (
    <Box sx={{ margin: "0 5px" }}>
      <div className="parent-block column-drag-handle">
        <Button
          style={activeStyle}
          className="nav-element"
          onClick={(e) => {
            clickHandler(e);
          }}
        >
          <div className="label" style={labelStyle}>
            {childBlockVisible ? (
              <KeyboardArrowDownIcon />
            ) : (
              <KeyboardArrowRightIcon />
            )}
            <IconGenerator icon={"lock.svg"} size={18} />
            Permissions
          </div>
          <Box className="icon_group">
            <Tooltip title="Create folder" placement="top">
              <Box className="extra_icon">
                <AddIcon
                  size={13}
                  onClick={(e) => {
                    e.stopPropagation();
                    openUserFolderModal({}, "CREATE");
                  }}
                  style={iconStyle}
                />
              </Box>
            </Tooltip>
          </Box>
        </Button>
      </div>

      <Collapse in={childBlockVisible} unmountOnExit>
        {child?.map((childElement) => (
          <PermissionSidebarRecursiveBlock
            key={childElement.id}
            level={level + 1}
            element={childElement}
            menuStyle={menuStyle}
            setElement={setElement}
            openUserFolderModal={openUserFolderModal}
          />
        ))}
      </Collapse>
      {selectedUserFolder && (
        <FolderCreateModal
          clientType={selectedUserFolder}
          closeModal={closeUserFolderModal}
          modalType={userFolderModalType}
        />
      )}
    </Box>
  );
};

export default Permissions;
