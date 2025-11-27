import AddIcon from "@mui/icons-material/Add";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import {Box, Button, Collapse, Tooltip} from "@mui/material";
import {useMemo, useState} from "react";
import {FaFolder} from "react-icons/fa";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate, useParams} from "react-router-dom";
import {
  useScenarioCategoryDeleteMutation,
  useScenarioCategoryListQuery,
} from "../../../../services/scenarioCategory";
import {
  useScenarioDeleteMutation,
  useScenarioListQuery,
} from "../../../../services/scenarioService";
import {store} from "../../../../store";
import {menuActions} from "../../../../store/menuItem/menuItem.slice";
import IconGenerator from "../../../IconPicker/IconGenerator";
import "../../../LayoutSidebar/style.scss";
import "../../style.scss";
import FolderCreateModal from "./Components/Modal/FolderCreateModal";
import ScenarioButtonMenu from "./Components/ScenarioButtonMenu";
import ScenarioRecursive from "./RecursiveBlock";
import {BsTable} from "react-icons/bs";
import {updateLevel} from "../../../../utils/level";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
export const adminId = `${import.meta.env.VITE_ADMIN_FOLDER_ID}`;

const scenarioFolder = {
  label: "Scenarios",
  type: "USER_FOLDER",
  button: "PLUS",
  icon: "scenario.svg",
  parent_id: adminId,
  id: "16",
  data: {
    permission: {
      read: true,
      write: true,
      delete: true,
      update: true,
    },
  },
};

const ScenarioSidebar = ({
  level = 1,
  menuStyle,
  setSubMenuIsOpen,
  menuItem,
}) => {
  const dispatch = useDispatch();
  const [childBlockVisible, setChildBlockVisible] = useState(false);
  const pinIsEnabled = useSelector((state) => state.main.pinIsEnabled);
  const [selected, setSelected] = useState({});
  const company = store.getState().company;
  const [openedFolders, setOpenedFolders] = useState([]);
  const navigate = useNavigate();
  const [menu, setMenu] = useState({event: "", type: ""});
  const openMenu = Boolean(menu?.event);
  const [selectedScenarioFolder, setSelectedScenarioFolder] = useState(null);
  const [scenarioFolderModalType, setScenarioFolderModalType] = useState(null);
  const closeScenarioFolderModal = () => setSelectedScenarioFolder(null);

  const openScenarioFolderModal = (folder, type) => {
    setSelectedScenarioFolder(folder);
    setScenarioFolderModalType(type);
  };

  const handleOpenNotify = (event, type) => {
    setMenu({event: event?.currentTarget, type: type});
  };

  const handleCloseNotify = () => {
    setMenu(null);
  };
  const activeStyle = {
    backgroundColor:
      scenarioFolder?.id === menuItem?.id
        ? menuStyle?.active_background || "#007AFF"
        : menuStyle?.background,
    color:
      scenarioFolder?.id === menuItem?.id
        ? menuStyle?.active_text || "#fff"
        : menuStyle?.text,
    paddingLeft: updateLevel(level),
    borderRadius: "8px",
  };
  const labelStyle = {
    color:
      scenarioFolder?.id === menuItem?.id
        ? menuStyle?.active_text
        : menuStyle?.text,
  };
  const iconStyle = {
    color:
      scenarioFolder?.id === menuItem?.id
        ? menuStyle?.active_text
        : menuStyle?.text || "",
  };

  const clickHandler = (e) => {
    e.stopPropagation();
    dispatch(menuActions.setMenuItem(scenarioFolder));
    setSelected(scenarioFolder);
    if (!pinIsEnabled && scenarioFolder.type !== "USER_FOLDER") {
      setSubMenuIsOpen(false);
    }
    setChildBlockVisible((prev) => !prev);
  };

  const rowClickHandler = (id, element) => {
    setSelected(element);
    element.type !== "DAG" && navigate(`/main/${adminId}`);
    if (element.type !== "FOLDER" || openedFolders.includes(id)) return;
    setOpenedFolders((prev) => [...prev, id]);
  };

  const onSelect = (id, element) => {
    if (element.type === "DAG") {
      navigate(`/main/${adminId}/scenario/${element?.category_id}/${id}`);
    }
  };

  const {
    data: category = [],
    isLoading: formLoading,
    refetch: refetchCategory,
  } = useScenarioCategoryListQuery({});
  const {
    data: scenario = [],
    isLoading: scenarioLoading,
    refetch,
  } = useScenarioListQuery();

  const deleteEndpointClickHandler = (id) => {
    deleteScenario({
      id,
      envId: company.environmentId,
      projectId: company.projectId,
    });
  };

  const {mutate: deleteScenario, deleteScenarioLoading} =
    useScenarioDeleteMutation({
      onSuccess: () => {
        refetch();
      },
    });

  const {mutate: deleteCategory} = useScenarioCategoryDeleteMutation({
    onSuccess: () => refetchCategory(),
  });
  const onDeleteCategory = (id) => {
    deleteCategory({
      id,
      envId: company.environmentId,
      projectId: company.projectId,
    });
  };
  const computedElements = useMemo(
    () =>
      category?.categories?.map((category) => ({
        icon: FaFolder,
        name: category.name,
        id: category.guid,
        type: "FOLDER",
        children: scenario?.DAGs?.filter(
          (dag) => dag.category_id === category.guid
        ).map((dag) => ({
          ...dag,
          icon: BsTable,
          id: dag.id,
          name: dag.title,
          type: "DAG",
        })),
      })),
    [category, scenario, company.projectId, navigate]
  );

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
            {childBlockVisible ? (
              <KeyboardArrowDownIcon />
            ) : (
              <KeyboardArrowRightIcon />
            )}
            <PlayCircleIcon />
            {/* <IconGenerator icon={"film.svg"} size={18} /> */}
            Scenarios
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
        {computedElements?.map((element) => (
          <ScenarioRecursive
            key={element.id}
            level={level + 1}
            element={element}
            menuStyle={menuStyle}
            onRowClick={rowClickHandler}
            selected={selected}
            handleOpenNotify={handleOpenNotify}
            onSelect={onSelect}
          />
        ))}
      </Collapse>

      <ScenarioButtonMenu
        selected={selected}
        openMenu={openMenu}
        menu={menu?.event}
        menuType={menu?.type}
        handleCloseNotify={handleCloseNotify}
        deleteEndpointClickHandler={deleteEndpointClickHandler}
        openScenarioFolderModal={openScenarioFolderModal}
        onDeleteCategory={onDeleteCategory}
      />

      {selectedScenarioFolder && (
        <FolderCreateModal
          modalType={scenarioFolderModalType}
          folder={selectedScenarioFolder}
          closeModal={closeScenarioFolderModal}
        />
      )}
    </Box>
  );
};

export default ScenarioSidebar;
