import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { Box, Button, Collapse, Menu, MenuItem, Tooltip } from "@mui/material";
import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { store } from "../../../../store";
import IconGenerator from "../../../IconPicker/IconGenerator";
import "../../style.scss";
import {
  useResourceCreateFromClusterMutation,
  useResourceDeleteMutation,
  useResourceListQuery,
} from "../../../../services/resourceService";
import AddIcon from "@mui/icons-material/Add";
import StorageIcon from "@mui/icons-material/Storage";
import { resourceTypes } from "../../../../utils/resourceConstants";
import RecursiveBlock from "./RecursiveBlock";
import DatabasesConnectIcon from "../../../../assets/icons/DatabaseIcon";
import { TbDatabaseExport } from "react-icons/tb";
import { BiGitCompare } from "react-icons/bi";
import { IoEnter, IoExit } from "react-icons/io5";
import { updateLevel } from "../../../../utils/level";
export const adminId = `${import.meta.env.VITE_ADMIN_FOLDER_ID}`;

const dataBase = {
  label: "Resources",
  type: "USER_FOLDER",
  icon: "database.svg",
  parent_id: adminId,
  id: "150",
  data: {
    permission: {
      read: true,
      write: true,
      delete: true,
      update: true,
    },
  },
};

const EltResources = ({ level = 1, menuStyle, menuItem }) => {
  const navigate = useNavigate();
  const { projectId, resourceId } = useParams();
  const [childBlockVisible, setChildBlockVisible] = useState(false);
  const [selected, setSelected] = useState({});
  const company = store.getState().company;
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const authStore = store.getState().auth;

  const { data: { resources } = {}, refetch } = useResourceListQuery({
    params: {
      project_id: company?.projectId,
    },
  });

  const activeStyle = {
    backgroundColor:
      dataBase?.id === menuItem?.id
        ? menuStyle?.active_background || "#007AFF"
        : menuStyle?.background,
    color:
      dataBase?.id === menuItem?.id
        ? menuStyle?.active_text || "#fff"
        : menuStyle?.text,
    paddingLeft: updateLevel(level),
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const sidebarElements = useMemo(
    () => [
      {
        id: 1,
        title: "Connections",
        icon: BiGitCompare,
        link: `/project/${projectId}/elt/connections`,
      },
      {
        id: 2,
        title: "Sources",
        icon: IoExit,
        link: `/project/${projectId}/elt/sources`,
      },
      {
        id: 3,
        title: "Destinations",
        icon: IoEnter,
        link: `/project/${projectId}/elt/destinations`,
      },
    ],
    [projectId]
  );

  const { mutate: deleteResource, isLoading: deleteLoading } =
    useResourceDeleteMutation({
      onSuccess: () => {
        refetch();
        handleClose();
      },
    });

  const { mutate: addResourceFromCluster, isLoading: clusterLoading } =
    useResourceCreateFromClusterMutation({
      onSuccess: () => {
        refetch();
      },
    });

  const addResourceFromClusterClick = (resourceType) => {
    addResourceFromCluster({
      company_id: authStore.userInfo.company_id,
      project_id: authStore.projectId,
      environment_id: authStore.environmentId,
      resource: {
        resource_type: resourceType || 1,
        service_type: 1,
      },
      user_id: authStore.userId,
    });
  };

  const clickHandler = (e) => {
    e.stopPropagation();
    setChildBlockVisible((prev) => !prev);
  };

 

  const navigateToCreateForm = () => {
    navigate(`/project/${projectId}/resources/create`);
  };

  const navigateToEditPage = (id) => {
    navigate(`/project/${projectId}/resources/${id}`);
  };

  const onSelect = (id, element) => {
    if (element.link) navigate(element.link);
    else if (element.type === "RESOURCE") navigateToEditPage(id);
  };

  return (
    <Box>
      <div className="parent-block column-drag-handle">
        <Button
          style={activeStyle}
          className={`nav-element`}
          onClick={(e) => {
            clickHandler(e);
          }}
        >
          <div
            className="label"
            style={{
              color:
                selected?.id === dataBase?.id
                  ? menuStyle?.active_text
                  : menuStyle?.text,
            }}
          >
            {/* <IconGenerator icon={"database.svg"} size={18} /> */}
            <DatabasesConnectIcon />
            Elt
          </div>

          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
          >
            {resourceTypes?.map((el) => (
              <MenuItem
                sx={{ width: "250px" }}
                onClick={(e) => {
                  e.stopPropagation();
                  addResourceFromClusterClick(el.value);
                }}
              >
                {el?.label}
              </MenuItem>
            ))}
          </Menu>
          {childBlockVisible ? (
            <KeyboardArrowDownIcon />
          ) : (
            <KeyboardArrowRightIcon />
          )}
        </Button>
      </div>

      <Collapse in={childBlockVisible} unmountOnExit>
        {sidebarElements?.map((childElement) => (
          <RecursiveBlock
            key={childElement.id}
            level={level + 1}
            element={childElement}
            menuStyle={menuStyle}
            clickHandler={clickHandler}
            onSelect={onSelect}
            selected={selected}
            resourceId={resourceId}
            childBlockVisible={childBlockVisible}
          />
        ))}
      </Collapse>
    </Box>
  );
};

export default EltResources;
