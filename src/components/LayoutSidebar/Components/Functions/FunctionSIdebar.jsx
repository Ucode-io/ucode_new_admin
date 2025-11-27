import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import {Box, Button, Collapse, Tooltip} from "@mui/material";
import {useMemo, useState} from "react";
import {FaFolder} from "react-icons/fa";
import {HiOutlineCodeBracket} from "react-icons/hi2";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate, useParams} from "react-router-dom";
import {
  useFunctionFolderDeleteMutation,
  useFunctionFoldersListQuery,
} from "../../../../services/functionFolderService";
import {
  useFunctionDeleteMutation,
  useFunctionsListQuery,
} from "../../../../services/functionService";
import {store} from "../../../../store";
import {menuActions} from "../../../../store/menuItem/menuItem.slice";
import IconGenerator from "../../../IconPicker/IconGenerator";
import "../../style.scss";
import FunctionRecursive from "./RecursiveBlock";
import AddIcon from "@mui/icons-material/Add";
import FunctionButtonMenu from "./Components/FunctionButtonMenu";
import FunctionFolderCreateModal from "./Components/Modal/FolderCreateModal";
import {BsThreeDots} from "react-icons/bs";
import {useQueryClient} from "react-query";
import FunctionCreateModal from "./Components/Modal/FunctionCreateModal";
import {updateLevel} from "../../../../utils/level";
export const adminId = `${import.meta.env.VITE_ADMIN_FOLDER_ID}`;

const functionFolder = {
  label: "Functions",
  type: "USER_FOLDER",
  icon: "documents.svg",
  parent_id: adminId,
  id: "25",
  data: {
    permission: {
      read: true,
      write: true,
      delete: true,
      update: true,
    },
  },
};

const FunctionSidebar = ({
  setValue,
  level = 1,
  menuStyle,
  menuItem,
  integrated = false,
}) => {
  const dispatch = useDispatch();
  const company = store.getState().company;
  const {appId} = useParams();
  const navigate = useNavigate();
  const [selected, setSelected] = useState({});
  const [childBlockVisible, setChildBlockVisible] = useState(false);
  const pinIsEnabled = useSelector((state) => state.main.pinIsEnabled);
  const [menu, setMenu] = useState({event: "", type: ""});
  const openMenu = Boolean(menu?.event);
  const queryClient = useQueryClient();

  const [folderModalIsOpen, setFolderModalIsOpen] = useState(false);
  const [functionModalIsOpen, setFunctionModalIsOpen] = useState(false);
  const [selectedFunction, setSelectedFunction] = useState();
  const [selectedFolder, setSelectedFolder] = useState(null);

  const handleOpenNotify = (event, type, element) => {
    setMenu({event: event?.currentTarget, type: type, element});
  };

  const handleCloseNotify = () => {
    setMenu(null);
  };

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

  const {data: functionFolders, isLoading: folderLoading} =
    useFunctionFoldersListQuery({
      params: {
        "project-id": company.projectId,
      },
      queryParams: {
        select: (res) => res.function_folders,
      },
    });

  const {mutate: deleteFunction, isLoading: deleteFunctionLoading} =
    useFunctionDeleteMutation({
      onSuccess: () => queryClient.refetchQueries("FUNCTIONS"),
    });

  const {data: functions, isLoading: functionLoading} = useFunctionsListQuery({
    params: {
      "project-id": company.projectId,
    },
    queryParams: {
      select: (res) => res.functions,
    },
  });

  const {mutate: deleteFolder, isLoading: deleteLoading} =
    useFunctionFolderDeleteMutation({
      onSuccess: () => {
        queryClient.refetchQueries("FUNCTION_FOLDERS");
      },
    });

  const sidebarElements = useMemo(() => {
    return functionFolders?.map((folder) => ({
      ...folder,
      icon: FaFolder,
      type: "FOLDER",
      name: folder.title,
      buttons: (
        <BsThreeDots
          size={13}
          onClick={(e) => {
            e?.stopPropagation();
            handleOpenNotify(e, "FOLDER", folder);
          }}
          style={{
            color:
              menuItem?.id === selected?.id
                ? menuStyle?.active_text
                : menuStyle?.text || "",
          }}
        />
      ),
      button_text: "Folder settings",

      children: functions
        ?.filter((func) => func.function_folder_id === folder.id)
        .map((func) => ({
          ...func,
          name: func.name,
          icon: HiOutlineCodeBracket,
          buttons: (
            <BsThreeDots
              size={13}
              onClick={(e) => {
                e?.stopPropagation();
                handleOpenNotify(e, "FUNCTION", func);
              }}
              style={{
                color:
                  menuItem?.id === selected?.id
                    ? menuStyle?.active_text
                    : menuStyle?.text || "",
              }}
            />
          ),
          button_text: "Folder settings",
        })),
    }));
  }, [functionFolders, functions]);

  const clickHandler = (e) => {
    e.stopPropagation();
    dispatch(menuActions.setMenuItem(functionFolder));
    setSelected(functionFolder);
    navigate(`/main/${appId}/openfaas-functions`);
  };

  // --CREATE FOLDERS--

  const onSelect = (id, element) => {
    setSelected(element);
    !integrated && navigate(`/main/${adminId}/function/${id}`);
    dispatch(menuActions.setMenuItem(element));
  };
  const rowClickHandler = (id, element) => {
    if (element.type === "FUNCTION") {
      integrated && setValue("request_info.url", element?.path);
      integrated && setValue("request_info.title", element?.name);
    }
  };

  const activeStyle = {
    backgroundColor:
      functionFolder?.id === menuItem?.id
        ? menuStyle?.active_background || "#007AFF"
        : menuStyle?.background,
    color:
      functionFolder?.id === menuItem?.id
        ? menuStyle?.active_text || "#fff"
        : menuStyle?.text,
    paddingLeft: updateLevel(level),
    borderRadius: "8px",
    display:
      menuItem?.id === "0" ||
      (menuItem?.id === "c57eedc3-a954-4262-a0af-376c65b5a284" && "none"),
  };

  const labelStyle = {
    paddingLeft: "15px",
    color:
      functionFolder?.id === menuItem?.id
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
          }}>
          <div className="label" style={labelStyle}>
            <IconGenerator icon={"key.svg"} size={18} />
            Functions
          </div>
        </Button>
      </div>

      <Collapse in={childBlockVisible} unmountOnExit>
        {sidebarElements?.map((element) => (
          <FunctionRecursive
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

      <FunctionButtonMenu
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
      )}
      {functionModalIsOpen && (
        <FunctionCreateModal
          folder={selectedFolder}
          func={selectedFunction}
          closeModal={closeFunctionModal}
        />
      )}
    </Box>
  );
};

export default FunctionSidebar;
