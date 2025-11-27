import AddIcon from "@mui/icons-material/Add";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { Box, Button, Collapse } from "@mui/material";
import { useMemo, useState } from "react";
import { FaFolder } from "react-icons/fa";
import { TbApi } from "react-icons/tb";
import { useQueryClient } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import {
  useApiCategoryDeleteMutation,
  useApiCategoryListQuery,
} from "../../../../services/apiCategoryService";
import {
  useApiEndpointDeleteMutation,
  useApiEndpointListQuery,
} from "../../../../services/apiEndpointService";
import { store } from "../../../../store";
import { menuActions } from "../../../../store/menuItem/menuItem.slice";
import IconGenerator from "../../../IconPicker/IconGenerator";
import "../../style.scss";
import ApiButtonMenu from "./ApiButtonMenu";
import ApiRecursive from "./RecursiveBlock";
import ApiFolderCreateModal from "./Modal/ApiFolderCreateModal";
import { showAlert } from "../../../../store/alert/alert.thunk";
import { BsThreeDots } from "react-icons/bs";
import { updateLevel } from "../../../../utils/level";
export const adminId = `${import.meta.env.VITE_ADMIN_FOLDER_ID}`;

const apiFolder = {
  label: "API's",
  type: "USER_FOLDER",
  icon: "code.svg",
  parent_id: adminId,
  id: "99",
  data: {
    permission: {
      read: true,
      write: true,
      delete: true,
      update: true,
    },
  },
};

const ApiSidebar = ({ level = 1, menuStyle, setSubMenuIsOpen, menuItem }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const company = store.getState().company;
  const [selected, setSelected] = useState({});
  const [childBlockVisible, setChildBlockVisible] = useState(false);
  const pinIsEnabled = useSelector((state) => state.main.pinIsEnabled);
  const [menu, setMenu] = useState({ event: "", type: "" });
  const openMenu = Boolean(menu?.event);
  const queryClient = useQueryClient();
  const handleOpenNotify = (event, type, element) => {
    setMenu({ event: event?.currentTarget, type: type, element });
  };
  const handleCloseNotify = () => {
    setMenu(null);
  };

  const [openedFolders, setOpenedFolders] = useState([]);
  const [folderModalType, setFolderModalType] = useState(null);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const location = useLocation();

  const openFolderModal = (folder, type) => {
    setSelectedFolder(folder);
    setFolderModalType(type);
  };
  const closeFolderModal = () => {
    setSelectedFolder(null);
    setFolderModalType(null);
  };
  const handleNavigate = (folder) => {
    navigate(`${location.pathname}/api-endpoints/${folder?.guid}/create`);
  };

  // --REST API CATEGORIES--

  const { data: apiCategories, isLoading: categoryLoading } =
    useApiCategoryListQuery({
      queryParams: {
        select: (res) => res.categories,
      },
    });

  // --API REFERENCE--

  const {
    data: apiEndpoints,
    refetch,
    isLoading: endpointsLoading,
  } = useApiEndpointListQuery({
    queryParams: {
      select: (res) => res.api_references,
    },
  });

  // --DELETE ENDPOINT--


  const { mutate: deleteFolder, isLoading: deleteLoading } =
    useApiCategoryDeleteMutation({
      onSuccess: () => {
        dispatch(showAlert("Successfully deleted", "success"));
        queryClient.refetchQueries("API_CATEGORIES");
      },
    });

  const { mutate: deleteEndpoint, deleteEndpointLoading } =
    useApiEndpointDeleteMutation({
      onSuccess: () => {
        refetch();
      },
    });

  const activeStyle = {
    backgroundColor:
      apiFolder?.id === menuItem?.id
        ? menuStyle?.active_background || "#007AFF"
        : menuStyle?.background,
    color:
      apiFolder?.id === menuItem?.id
        ? menuStyle?.active_text || "#fff"
        : menuStyle?.text,
    paddingLeft: updateLevel(level),
    borderRadius: "8px",
  };

  const labelStyle = {
    color:
      apiFolder?.id === menuItem?.id ? menuStyle?.active_text : menuStyle?.text,
  };

  // --API ENDPOINTS SIDEBAR ELEMENTS--

  const computedApiEndpoints = useMemo(() => {
    return apiCategories?.map((category) => ({
      ...category,
      title: category.name,
      id: category.guid,
      type: "FOLDER",
      icon: FaFolder,
      buttons: (
        <BsThreeDots
          size={13}
          onClick={(e) => {
            e?.stopPropagation();
            handleOpenNotify(e, "FOLDER", category);
          }}
          style={{
            color:
              menuItem?.guid === category?.guid
                ? menuStyle?.active_text
                : menuStyle?.text || "",
          }}
        />
      ),
      children: apiEndpoints
        ?.filter((endpoint) => endpoint.category_id === category.guid)
        .map((endpoint) => ({
          ...endpoint,
          id: endpoint.guid,
          name: endpoint.title,
          type: "API_ENDPOINT",
          icon: TbApi,
          //   buttons: (
          //     <IconButton
          //       variant="ghost"
          //       colorScheme="whiteAlpha"
          //       onClick={(e) => {
          //         e.stopPropagation();
          //         deleteEndpointClickHandler(endpoint.guid);
          //       }}
          //     >
          //       <DeleteIcon />
          //     </IconButton>
          //   ),
        })),
    }));
  }, [apiCategories, apiEndpoints, menuItem, selected]);

  // --SIDEBAR ELEMENTS--
  const sidebarElements = useMemo(
    () => [
      {
        id: 1,
        name: "REST API",
        type: "FOLDER",
        icon: TbApi,
        children: computedApiEndpoints,
        buttons: (
          <>
            <AddIcon
              size={13}
              onClick={(e) => {
                e.stopPropagation();
                openFolderModal({}, "CREATE");
              }}
              style={{
                color:
                  selected?.id === menuItem?.id
                    ? menuStyle?.active_text
                    : menuStyle?.text || "",
              }}
            />
          </>
        ),
      },
    ],
    [computedApiEndpoints, menuItem, selected]
  );

  // --ROW CLICK HANDLER--

  const rowClickHandler = (id, element) => {
    dispatch(menuActions.setMenuItem(element));

    if (element.type !== "FOLDER" || openedFolders.includes(id)) return;
    setOpenedFolders((prev) => [...prev, id]);
  };

  // --RENDER--

  const clickHandler = (e) => {
    e.stopPropagation();
    dispatch(menuActions.setMenuItem(apiFolder));
    setSelected(apiFolder);
    if (!pinIsEnabled && apiFolder.type !== "USER_FOLDER") {
      setSubMenuIsOpen(false);
    }
    setChildBlockVisible((prev) => !prev);
    navigate(`/main/${adminId}`);
  };

  // --CREATE FOLDERS--

  const onSelect = (id, element) => {
    setSelected(element);
    dispatch(menuActions.setMenuItem(element));
    if (element.type === "FOLDER") return;
    navigate(`${location.pathname}/api-endpoints/${element.category_id}/${id}`);
  };

  return (
    <Box>
      <div className="parent-block column-drag-handle">
        <Button
          style={activeStyle}
          className="nav-element"
          onClick={(e) => {
            clickHandler(e);
          }}
        >
          {childBlockVisible ? (
            <KeyboardArrowDownIcon />
          ) : (
            <KeyboardArrowRightIcon />
          )}
          <div className="label" style={labelStyle}>
            <IconGenerator icon={"code.svg"} size={18} />
            {apiFolder.label}
          </div>
        </Button>
      </div>
      <Collapse in={childBlockVisible} unmountOnExit>
        {sidebarElements?.map((element) => (
          <ApiRecursive
            key={element.id}
            level={level + 1}
            element={element}
            menuStyle={menuStyle}
            onRowClick={rowClickHandler}
            selected={selected}
            handleOpenNotify={handleOpenNotify}
            onSelect={onSelect}
            setSelected={setSelected}
            menuItem={menuItem}
          />
        ))}
      </Collapse>

      <ApiButtonMenu
        openMenu={openMenu}
        menu={menu?.event}
        menuType={menu?.type}
        element={menu?.element}
        handleCloseNotify={handleCloseNotify}
        openFolderModal={openFolderModal}
        handleNavigate={handleNavigate}
        deleteFolder={deleteFolder}
      />

      {selectedFolder && (
        <ApiFolderCreateModal
          folder={selectedFolder}
          closeModal={closeFolderModal}
          formType={folderModalType}
        />
      )}
    </Box>
  );
};

export default ApiSidebar;
