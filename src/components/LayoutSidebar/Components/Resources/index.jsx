import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import {Box, Button, Collapse, Menu, MenuItem, Tooltip} from "@mui/material";
import {useMemo, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {store} from "../../../../store";
import IconGenerator from "../../../IconPicker/IconGenerator";
import "../../style.scss";
import resourceService, {
  useResourceCreateFromClusterMutation,
  useResourceCreateMutation,
  useResourceDeleteMutation,
  useResourceDeleteMutationV2,
  useResourceListQuery,
  useResourceListQueryV2,
} from "../../../../services/resourceService";
import RecursiveBlock from "./RecursiveBlock";
import AddIcon from "@mui/icons-material/Add";
import StorageIcon from "@mui/icons-material/Storage";
import {resourceTypes} from "../../../../utils/resourceConstants";
import {useQuery, useQueryClient} from "react-query";
import {menuActions} from "../../../../store/menuItem/menuItem.slice";
import {useDispatch, useSelector} from "react-redux";
import activeStyles from "../MenuUtils/activeStyles";
export const adminId = `${import.meta.env.VITE_ADMIN_FOLDER_ID}`;

const dataBases = {
  label: "Resources",
  type: "USER_FOLDER",
  icon: "database.svg",
  parent_id: adminId,
  id: "15",
  data: {
    permission: {
      read: true,
      write: true,
      delete: true,
      update: true,
    },
  },
};

const Resources = ({
  level = 1,
  menuStyle,
  setSubMenuIsOpen,
  handleOpenNotify,
  pinIsEnabled,
}) => {
  const navigate = useNavigate();
  const {appId} = useParams();

  const [childBlockVisible, setChildBlockVisible] = useState(false);
  const company = store.getState().company;
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const authStore = store.getState().auth;
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const menuItem = useSelector((state) => state.menu.menuItem);
  const activeStyle = activeStyles({
    menuItem,
    element: dataBases,
    menuStyle,
    level,
  });

  const {data: {resources} = {}} = useResourceListQuery({
    params: {
      project_id: company?.projectId,
    },
  });

  const {data: clickHouseList} = useQuery(
    ["GET_OBJECT_LIST"],
    () => {
      return resourceService.getListClickHouse({
        data: {
          environment_id: authStore.environmentId,
          limit: 0,
          offset: 0,
          project_id: company?.projectId,
        },
      });
    },
    {
      enabled: true,
      select: (res) => {
        return (
          res?.airbytes?.map((item) => ({
            ...item,
            type: "CLICK_HOUSE",
            name: "Click house",
          })) ?? []
        );
      },
    }
  );

  const {data = {}, refetch} = useResourceListQueryV2({
    params: {
      project_id: company?.projectId,
    },
  });

  const computedResources = useMemo(() => {
    return [
      ...(data?.resources || []),
      ...(resources || []),
      ...(clickHouseList || []),
    ];
  }, [data, resources, clickHouseList]);

  const {mutate: deleteResource, isLoading: deleteLoading} =
    useResourceDeleteMutationV2({
      onSuccess: () => {
        refetch();
        handleClose();
      },
    });

  const {mutate: deleteResourceV2, isLoading: deleteLoadingV2} =
    useResourceDeleteMutationV2({
      onSuccess: () => {
        queryClient.refetchQueries(["RESOURCESV2"]);
        handleClose();
      },
    });

  const {mutate: addResourceFromCluster, isLoading: clusterLoading} =
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
    dispatch(menuActions.setMenuItem(dataBases));
    e.stopPropagation();
    setChildBlockVisible((prev) => !prev);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{margin: "0 5px"}}>
      <div className="parent-block column-drag-handle">
        <Button
          className={`nav-element`}
          style={activeStyle}
          onClick={(e) => {
            clickHandler(e);
          }}>
          <div className="label">
            {childBlockVisible ? (
              <KeyboardArrowDownIcon />
            ) : (
              <KeyboardArrowRightIcon />
            )}
            <IconGenerator icon={"database.svg"} size={18} />
            {dataBases?.label}
          </div>

          {dataBases?.id === "15" && (
            <Box mt={1} sx={{cursor: "pointer"}}>
              <Tooltip title="Add resource" placement="top">
                <Box className="">
                  <StorageIcon
                    size={13}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleClick(e);
                      handleOpenNotify(e, "CREATE_FOLDER");
                    }}
                  />
                </Box>
              </Tooltip>
            </Box>
          )}

          {dataBases?.id === "15" && (
            <Box mt={1} sx={{cursor: "pointer"}}>
              <Tooltip title="Add resource" placement="top">
                <Box className="">
                  <AddIcon
                    size={13}
                    onClick={(e) => {
                      navigate(`/main/${appId}/resources/create`);
                      e.stopPropagation();
                      handleOpenNotify(e, "CREATE_FOLDER");
                    }}
                  />
                </Box>
              </Tooltip>
            </Box>
          )}

          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}>
            {resourceTypes?.map((el) => (
              <MenuItem
                sx={{width: "250px"}}
                onClick={(e) => {
                  e.stopPropagation();
                  addResourceFromClusterClick(el.value);
                }}>
                {el?.label}
              </MenuItem>
            ))}
          </Menu>
        </Button>
      </div>

      <Collapse in={childBlockVisible} unmountOnExit>
        {computedResources?.map((childElement) => (
          <RecursiveBlock
            key={childElement.id}
            level={level + 1}
            element={childElement}
            pinIsEnabled={pinIsEnabled}
            deleteResource={deleteResource}
            deleteResourceV2={deleteResourceV2}
            childBlockVisible={childBlockVisible}
            setSubMenuIsOpen={setSubMenuIsOpen}
            handleOpenNotify={handleOpenNotify}
            menuStyle={menuStyle}
            menuItem={menuItem}
          />
        ))}
      </Collapse>
    </Box>
  );
};

export default Resources;
