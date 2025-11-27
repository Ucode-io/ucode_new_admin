import { Delete } from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { Box, Button, Collapse, Tooltip } from "@mui/material";
import { useMemo, useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import { FaDatabase, FaFolder } from "react-icons/fa";
import { TbApi } from "react-icons/tb";
import { useQueries, useQueryClient } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import queryService, {
  useQueryDeleteMutation,
  useQueryFolderDeleteMutation,
  useQueryFoldersListQuery,
} from "../../../../services/query.service";
import { showAlert } from "../../../../store/alert/alert.thunk";
import { menuActions } from "../../../../store/menuItem/menuItem.slice";
import { listToNested } from "../../../../utils/listToNestedList";
import IconGenerator from "../../../IconPicker/IconGenerator";
import "../../style.scss";
import activeStyles from "../MenuUtils/activeStyles";
import QueryFolderCreateModal from "./Modal/QueryFolderCreateModal";
import QueryButtonMenu from "./QueryButtonMenu";
import QueryRecursive from "./RecursiveBlock";
export const adminId = `${import.meta.env.VITE_ADMIN_FOLDER_ID}`;

const queryFolder = {
  label: "HTTP Requests",
  type: "USER_FOLDER",
  icon: "documents.svg",
  parent_id: adminId,
  id: "90",
  data: {
    permission: {
      read: true,
      write: true,
      delete: true,
      update: true,
    },
  },
};

const QuerySidebar = ({ level = 1, menuStyle, setSubMenuIsOpen }) => {
  const dispatch = useDispatch();
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
  const menuItem = useSelector((state) => state.menu.menuItem);
  const activeStyle = activeStyles({ menuItem, element: queryFolder, menuStyle, level });

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
    navigate(`${location.pathname}/queries/create?folder_id=${folder?.id}`);
  };


  const { data: folders, isLoading: foldersLoading } =
    useQueryFoldersListQuery({
      queryParams: {
        enabled: childBlockVisible
      }
    });


  const computedFolders = useMemo(() => {
    const list = [];
    folders?.folders?.forEach((folder) => {
      list.push({
        ...folder,
        icon: FaFolder,
        type: "FOLDER",
        hasChild: true,
        name: folder.title,
        buttons: (
          <BsThreeDots
            size={13}
            onClick={(e) => {
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
        button_text: "Query settings",
      });
    });
    return list;
  }, [folders?.folders, menuItem, selected]);


  const queryQueries = useMemo(() => {
    return openedFolders.map((folderId) => ({
      queryKey: [
        "QUERIES",
        {
          "folder-id": folderId,
        },
      ],
      queryFn: () => queryService.getListQuery({ "folder-id": folderId }),
    }));
  }, [openedFolders]);

  const queryResults = useQueries(queryQueries);

  const { mutate: deleteQuery } = useQueryDeleteMutation({
    onSuccess: () => {
      dispatch(showAlert("Удалено", "success"));
      queryClient.refetchQueries(["QUERIES"]);
    },
  });

  const queries = useMemo(() => {
    const list = [];
    queryResults.forEach((query) => {
      query.data?.queries?.forEach((query) => {
        list.push({
          ...query,
          parent_id: query.folder_id,
          name: query.title,
          icon: query.query_type === "REST" ? TbApi : FaDatabase,
          buttons: (
            <Delete
              size={13}
              onClick={(e) => {
                deleteQuery(query?.id);
              }}
              style={{
                color:
                  menuItem?.id === query?.id
                    ? menuStyle?.active_text
                    : menuStyle?.text || "",
              }}
            />
          ),
          button_text: "Delete query",
        });
      });
    });
    return list;
  }, [queryResults]);

  const computedQueryList = useMemo(() => {
    return listToNested([...(computedFolders ?? []), ...queries], {
      undefinedChildren: true,
    });
  }, [computedFolders, queries]);

  const sidebarElements = useMemo(() => computedQueryList, [computedQueryList]);

  const { mutate: deleteFolder, isLoading: deleteLoading } =
    useQueryFolderDeleteMutation({
      onSuccess: () => {
        dispatch(showAlert("Success deleted", "success"));
        queryClient.refetchQueries("QUERY_FOLDERS");
      },
    });


  const rowClickHandler = (id, element) => {
    if (element.type !== "FOLDER" || openedFolders.includes(id)) return;
    setOpenedFolders((prev) => [...prev, id]);
  };


  const clickHandler = (e) => {
    dispatch(menuActions.setMenuItem(queryFolder));
    setSelected(queryFolder);
    if (!pinIsEnabled && queryFolder.type !== "USER_FOLDER") {
      setSubMenuIsOpen(false);
    }
    setChildBlockVisible((prev) => !prev);
    navigate(`/main/${adminId}`);
  };


  const onSelect = (id, element) => {
    setSelected(element);
    dispatch(menuActions.setMenuItem(element));
    if (element.type === "FOLDER") return;
    navigate(`/main/${adminId}/queries/${id}`);
  };

  const iconStyle = {
    color:
      queryFolder?.id === menuItem?.id
        ? menuStyle?.active_text
        : menuStyle?.text || "",
  };

  const labelStyle = {
    color:
      queryFolder?.id === menuItem?.id
        ? menuStyle?.active_text
        : menuStyle?.text,
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
          {childBlockVisible ? (
            <KeyboardArrowDownIcon />
          ) : (
            <KeyboardArrowRightIcon />
          )}
          <div className="label" style={labelStyle}>
            <IconGenerator icon={"code.svg"} size={18} />
            {queryFolder.label}
          </div>
          <Box className="icon_group">
            <Tooltip title="Create folder" placement="top">
              <Box className="extra_icon">
                <AddIcon
                  size={13}
                  onClick={(e) => {
                    openFolderModal({}, "CREATE");
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
          <QueryRecursive
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

      <QueryButtonMenu
        openMenu={openMenu}
        menu={menu?.event}
        menuType={menu?.type}
        element={menu?.element}
        handleCloseNotify={handleCloseNotify}
        openFolderModal={openFolderModal}
        deleteFolder={deleteFolder}
        handleNavigate={handleNavigate}
      />
      {selectedFolder && (
        <QueryFolderCreateModal
          folder={selectedFolder}
          closeModal={closeFolderModal}
          formType={folderModalType}
        />
      )}
    </Box>
  );
};

export default QuerySidebar;
