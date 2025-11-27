import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { Box, Button, Collapse, IconButton, Tooltip } from "@mui/material";
import { useMemo, useState } from "react";
import { FaFolder } from "react-icons/fa";
import { HiOutlineCodeBracket } from "react-icons/hi2";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  useFunctionFolderDeleteMutation,
  useFunctionFoldersListQuery,
} from "../../../../services/functionFolderService";
import {
  useFunctionDeleteMutation,
  useFunctionsListQuery,
} from "../../../../services/functionService";
import { store } from "../../../../store";
import { menuActions } from "../../../../store/menuItem/menuItem.slice";
import IconGenerator from "../../../IconPicker/IconGenerator";
import "../../style.scss";
import AddIcon from "@mui/icons-material/Add";
// import FunctionButtonMenu from "./Components/FunctionButtonMenu";
// import FunctionFolderCreateModal from "./Components/Modal/FolderCreateModal";
import { BsThreeDots } from "react-icons/bs";
import { useQueryClient } from "react-query";
// import FunctionCreateModal from "./Components/Modal/FunctionCreateModal";
import {
  useNotificationCategoryDeleteMutation,
  useNotificationCategoryListQuery,
} from "../../../../services/notificationCategoryService";
import { AiFillFolderAdd } from "react-icons/ai";
import RectangleIconButton from "../../../Buttons/RectangleIconButton";
import { Delete } from "@mui/icons-material";
import NotificationRecursive from "./RecursiveBlock";
import { updateLevel } from "../../../../utils/level";
export const adminId = `${import.meta.env.VITE_ADMIN_FOLDER_ID}`;

const notificationFolder = {
  label: "Functions",
  type: "USER_FOLDER",
  icon: "documents.svg",
  parent_id: "adminId",
  id: "26",
  data: {
    permission: {
      read: true,
      write: true,
      delete: true,
      update: true,
    },
  },
};

const NotificationSidebar = ({
  level = 1,
  menuStyle,
  setSubMenuIsOpen,
  menuItem,
}) => {
  const dispatch = useDispatch();
  const company = store.getState().company;
  const navigate = useNavigate();
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

  const [folderModalIsOpen, setFolderModalIsOpen] = useState(false);
  const [functionModalIsOpen, setFunctionModalIsOpen] = useState(false);
  const [selectedFunction, setSelectedFunction] = useState();
  const [selectedFolder, setSelectedFolder] = useState(null);

  const openFolderModal = (folder) => {
    setSelectedFolder(folder);
    setFolderModalIsOpen(true);
  };

  const closeFolderModal = () => {
    setFolderModalIsOpen(false);
  };

  const openFunctionModal = (folder, func) => {
    setSelectedFolder(folder);
    setSelectedFunction(func);
    setFunctionModalIsOpen(true);
  };

  const closeFunctionModal = () => {
    setFunctionModalIsOpen(false);
  };

  const [selectedNotificationCategory, setSelectedNotificationCategory] =
    useState(null);
  const [notificationCategoryModalType, setNotificationCategoryModalType] =
    useState(null);

  const closeTemplateFolderModal = () =>
    setNotificationCategoryModalType(false);

  const openApiCategoryModal = (folder, type) => {
    setSelectedNotificationCategory(folder);
    setNotificationCategoryModalType(type);
  };

  const {
    data: category = [],
    isLoading: formLoading,
    refetch: refetchCategory,
  } = useNotificationCategoryListQuery();

  const { mutate: deleteCategory } = useNotificationCategoryDeleteMutation({
    onSuccess: () => refetchCategory(),
  });
  const onDeleteCategory = (id) => {
    deleteCategory({
      id,
    });
  };
  const sidebarElements = useMemo(
    () =>
      category?.categories?.map((category) => ({
        icon: FaFolder,
        name: category.name,
        id: category.guid,
        buttons: (
          <>
            <Delete onClick={() => onDeleteCategory(category.guid)} />
          </>
        ),
      })),
    [category, navigate]
  );

  const clickHandler = (e) => {
    e.stopPropagation();
    dispatch(menuActions.setMenuItem(notificationFolder));
    setSelected(notificationFolder);
    if (!pinIsEnabled && notificationFolder.type !== "USER_FOLDER") {
      setSubMenuIsOpen(false);
    }
    setChildBlockVisible((prev) => !prev);
    navigate(`/main/${adminId}`);
  };

  // --CREATE FOLDERS--

  const onSelect = (id, element) => {
    setSelected(element);
    navigate(`/main/${adminId}/notification/${id}`);
    dispatch(menuActions.setMenuItem(element));
  };
  const rowClickHandler = (id, element) => {};

  const activeStyle = {
    backgroundColor:
      notificationFolder?.id === menuItem?.id
        ? menuStyle?.active_background || "#007AFF"
        : menuStyle?.background,
    color:
      notificationFolder?.id === menuItem?.id
        ? menuStyle?.active_text || "#fff"
        : menuStyle?.text,
    paddingLeft: updateLevel(level),
  };
  const iconStyle = {
    color:
      notificationFolder?.id === menuItem?.id
        ? menuStyle?.active_text
        : menuStyle?.text || "",
  };

  const labelStyle = {
    color:
      notificationFolder?.id === menuItem?.id
        ? menuStyle?.active_text
        : menuStyle?.text,
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
            <IconGenerator icon={"bell.svg"} size={18} />
            Notifications
          </div>
          <Box className="icon_group">
            <Tooltip title="Create folder" placement="top">
              <Box className="extra_icon">
                <AddIcon
                  size={13}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenNotify(e, "CREATE_FOLDER");
                  }}
                  style={iconStyle}
                />
              </Box>
            </Tooltip>
          </Box>
        </Button>
      </div>

      <Collapse in={childBlockVisible} unmountOnExit>
        {sidebarElements?.map((element) => (
          <NotificationRecursive
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

      {/* <FunctionButtonMenu
        selected={selected}
        openMenu={openMenu}
        menu={menu?.event}
        menuType={menu?.type}
        element={menu?.element}
        handleCloseNotify={handleCloseNotify}
        openFolderModal={openFolderModal}
        deleteFolder={deleteFolder}
        openFunctionModal={openFunctionModal}
        deleteFunction={deleteFunction}
      />
      {folderModalIsOpen && (
        <FunctionFolderCreateModal
          folder={selectedFolder}
          closeModal={closeFolderModal}
        />
      )} */}
      {/* {functionModalIsOpen && (
        <FunctionCreateModal
          folder={selectedFolder}
          func={selectedFunction}
          closeModal={closeFunctionModal}
        />
      )} */}
    </Box>
  );
};

export default NotificationSidebar;
