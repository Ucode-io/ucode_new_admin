import AddIcon from "@mui/icons-material/Add";
import PersonIcon from "@mui/icons-material/Person";
import {Box, Button, Collapse, Tooltip} from "@mui/material";
import {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {BsThreeDots} from "react-icons/bs";
import {useQueryClient} from "react-query";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate, useParams} from "react-router-dom";
import {Draggable} from "react-smooth-dnd";
import {useMenuListQuery} from "../../../services/menuService";
import {store} from "../../../store";
import {menuActions} from "../../../store/menuItem/menuItem.slice";
import IconGenerator from "../../IconPicker/IconGenerator";
import ApiKeyButton from "../Components/ApiKey/ApiKeyButton";
import DataBase from "../Components/DataBase";
import FunctionSidebar from "../Components/Functions/FunctionSIdebar";
import {MenuFolderArrows, NavigateByType} from "../Components/MenuSwitchCase";
import activeStyles from "../Components/MenuUtils/activeStyles";
import MicroServiceSidebar from "../Components/MicroService/MicroServiceSidebar";
import MicrofrontendSettingSidebar from "../Components/Microfrontend/MicrofrontendSidebar";
import RedirectButton from "../Components/Redirect/RedirectButton";
import SmsOtpButton from "../Components/SmsOtp/SmsOtpButton";
import TableSettingSidebar from "../Components/TableSidebar/TableSidebar";
import "../style.scss";
import {folderIds} from "./mock/folders";
import ScenarioSidebar from "../Components/Scenario/ScenarioSidebar";
import FileUploadMenu from "../Components/Functions/FileUploadMenu";
export const adminId = `${import.meta.env.VITE_ADMIN_FOLDER_ID}`;
export const analyticsId = `${import.meta.env.VITE_ANALYTICS_FOLDER_ID}`;

const RecursiveBlock = ({
  customFunc = () => {},
  element,
  openFolderCreateModal,
  environment,
  setFolderModalType,
  level = 1,
  sidebarIsOpen,
  setTableModal,
  handleOpenNotify,
  setElement,
  setSubMenuIsOpen,
  menuStyle,
  index,
  menuItemId,
  selectedApp,
  userType = false,
}) => {
  const menuItem = useSelector((state) => state.menu.menuItem);
  const activeStyle = activeStyles({menuItem, element, menuStyle, level});
  const pinIsEnabled = useSelector((state) => state.main.pinIsEnabled);
  const auth = store.getState().auth;
  const {appId} = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {i18n} = useTranslation();
  const queryClient = useQueryClient();
  const [childBlockVisible, setChildBlockVisible] = useState(false);
  const [child, setChild] = useState();
  const [id, setId] = useState();
  const defaultAdmin = auth?.roleInfo?.name === "DEFAULT ADMIN";
  const activeRequest =
    element?.type === "FOLDER" || element?.type === "WIKI_FOLDER";
  const defaultLanguage = i18n?.language;
  const readPermission = element?.data?.permission?.read;
  const withoutPermission =
    element?.parent_id === adminId || element?.parent_id === analyticsId
      ? true
      : false;
  const permission = defaultAdmin
    ? readPermission || withoutPermission
    : readPermission;
  const addButtonPermission =
    element?.type === "FOLDER" ||
    (element?.type === "MINIO_FOLDER" && sidebarIsOpen) ||
    element?.type === "WIKI_FOLDER";
  const settingsButtonPermission =
    (element?.id !== "cd5f1ab0-432c-459d-824a-e64c139038ea" &&
      selectedApp?.id !== adminId) ||
    !selectedApp?.is_static;

  const {isLoading} = useMenuListQuery({
    params: {
      parent_id: id,
    },
    queryParams: {
      enabled: Boolean(activeRequest),
      onSuccess: (res) => {
        setChild(res.menus);
      },
    },
  });

  const clickHandler = (e) => {
    e.stopPropagation();
    dispatch(menuActions.setMenuItem(element));
    NavigateByType({element, appId, navigate});

    if (element?.type === "FOLDER" || element?.type === "WIKI_FOLDER") {
      setChildBlockVisible((prev) => !prev);
    }
    if (element.type === "PERMISSION") {
      queryClient.refetchQueries("GET_CLIENT_TYPE_LIST");
    }

    if (element?.type === "TABLE") {
      setSubMenuIsOpen(false);
    }
    if (
      !pinIsEnabled &&
      element.type !== "FOLDER" &&
      element.type !== "USER_FOLDER" &&
      element.type !== "MINIO_FOLDER" &&
      element.type !== "WIKI_FOLDER"
    ) {
      setSubMenuIsOpen(false);
    }
    setId(element?.id);
    setElement(element);
  };

  const menuAddClick = (e) => {
    e.stopPropagation();
    setElement(element);
    dispatch(menuActions.setMenuItem(element));
    if (element?.type === "MINIO_FOLDER") {
      handleOpenNotify(e, "CREATE_TO_MINIO");
    } else if (appId === folderIds.wiki_id) {
      handleOpenNotify(e, "WIKI_FOLDER");
    } else {
      handleOpenNotify(e, "CREATE_TO_FOLDER");
    }
  };

  const folderSettings = (e) => {
    e.stopPropagation();
    setElement(element);
    dispatch(menuActions.setMenuItem(element));
    if (selectedApp?.id !== adminId) {
      if (
        element?.type === "FOLDER" ||
        (element?.type === "WIKI_FOLDER" &&
          element?.id !== "cd5f1ab0-432c-459d-824a-e64c139038ea")
      ) {
        handleOpenNotify(e, "FOLDER");
      } else if (element?.type === "TABLE") {
        handleOpenNotify(e, "TABLE");
      } else if (element?.type === "WIKI") {
        handleOpenNotify(e, "WIKI");
      } else if (element?.type === "MICROFRONTEND") {
        handleOpenNotify(e, "MICROFRONTEND");
      } else if (element?.type === "MINIO_FOLDER") {
        handleOpenNotify(e, "MINIO_FOLDER");
      }
    }
  };

  useEffect(() => {
    if (element.id === "c57eedc3-a954-4262-a0af-376c65b5a284") {
      setChildBlockVisible(true);
    }
  }, []);

  return (
    <Draggable key={index}>
      <Box sx={{padding: "0 5px"}}>
        <div className="parent-block column-drag-handle" key={element.id}>
          {permission ? (
            <Button
              key={element.id}
              style={activeStyle}
              className="nav-element"
              onClick={(e) => {
                customFunc(e);
                clickHandler(e);
              }}>
              <div
                className="label"
                style={{
                  color:
                    menuItem?.id === element?.id || menuItemId === element?.id
                      ? menuStyle?.active_text
                      : menuStyle?.text,
                  opacity: element?.isChild && 0.6,
                }}>
                {element?.type === "USER" && (
                  <PersonIcon
                    style={{
                      color:
                        menuItem?.id === element?.id
                          ? "#fff"
                          : "rgb(45, 108, 229)",
                    }}
                  />
                )}
                {MenuFolderArrows({element, childBlockVisible})}
                <IconGenerator
                  icon={
                    element?.icon ||
                    element?.data?.microfrontend?.icon ||
                    element?.data?.webpage?.icon
                  }
                  size={18}
                />

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "100%",
                  }}>
                  <Box>
                    <p>
                      {element?.attributes?.[`label_${defaultLanguage}`] ??
                        element?.attributes?.[`title_${defaultLanguage}`] ??
                        element?.label ??
                        element?.name}
                    </p>
                  </Box>
                  {settingsButtonPermission && !userType ? (
                    <Box className="icon_group">
                      {(element?.data?.permission?.delete ||
                        element?.data?.permission?.update ||
                        element?.data?.permission?.write) && (
                        <Tooltip title="Settings" placement="top">
                          <Box className="extra_icon">
                            <BsThreeDots
                              size={13}
                              onClick={(e) => {
                                folderSettings(e);
                              }}
                              style={{
                                color:
                                  menuItem?.id === element?.id
                                    ? menuStyle?.active_text
                                    : menuStyle?.text || "",
                              }}
                            />
                          </Box>
                        </Tooltip>
                      )}
                    </Box>
                  ) : null}
                </Box>
              </div>
              {addButtonPermission && element?.data?.permission?.write ? (
                <Box className="icon_group">
                  <Tooltip title="Create folder" placement="top">
                    <Box className="extra_icon">
                      <AddIcon
                        size={13}
                        onClick={(e) => {
                          menuAddClick(e);
                        }}
                        style={{
                          color:
                            menuItem?.id === element?.id
                              ? menuStyle?.active_text
                              : menuStyle?.text || "",
                        }}
                      />
                    </Box>
                  </Tooltip>
                </Box>
              ) : null}
            </Button>
          ) : null}
        </div>

        <Collapse in={childBlockVisible} unmountOnExit>
          {child?.map((childElement) => (
            <RecursiveBlock
              customFunc={customFunc}
              key={childElement.id}
              level={level + 1}
              element={childElement}
              openFolderCreateModal={openFolderCreateModal}
              environment={environment}
              setFolderModalType={setFolderModalType}
              sidebarIsOpen={sidebarIsOpen}
              setTableModal={setTableModal}
              handleOpenNotify={handleOpenNotify}
              setElement={setElement}
              setSubMenuIsOpen={setSubMenuIsOpen}
              menuStyle={menuStyle}
              menuItem={menuItem}
              index={index}
              selectedApp={selectedApp}
            />
          ))}
          {element.id === folderIds.data_base_folder_id && (
            <>
              {/* <DataBase
                menuStyle={menuStyle}
                setSubMenuIsOpen={setSubMenuIsOpen}
                level={2}
              />
              <MicroServiceSidebar
                menuStyle={menuStyle}
                menuItem={menuItem}
                level={2}
              /> */}
              <TableSettingSidebar
                menuStyle={menuStyle}
                menuItem={menuItem}
                level={2}
              />
              {/* <ApiKeyButton
                menuStyle={menuStyle}
                menuItem={menuItem}
                level={2}
              />
              <RedirectButton
                menuStyle={menuStyle}
                menuItem={menuItem}
                level={2}
              />
              <SmsOtpButton
                menuStyle={menuStyle}
                menuItem={menuItem}
                level={2}
              /> */}
            </>
          )}

          {element.id === folderIds.code_folder_id && (
            <>
              {/* <ScenarioSidebar
                menuStyle={menuStyle}
                setSubMenuIsOpen={setSubMenuIsOpen}
                menuItem={menuItem}
                level={2}
              /> */}

              <FunctionSidebar
                menuStyle={menuStyle}
                menuItem={menuItem}
                level={2}
                integrated={false}
              />
              <MicrofrontendSettingSidebar
                menuStyle={menuStyle}
                menuItem={menuItem}
                element={element}
                level={2}
              />
              <FileUploadMenu
                menuStyle={menuStyle}
                setSubMenuIsOpen={setSubMenuIsOpen}
                menuItem={menuItem}
                element={element}
                level={2}
              />
            </>
          )}
          {/* {element.id === folderIds.api_folder_id && (
            <>
              <QuerySidebar
                menuStyle={menuStyle}
                setSubMenuIsOpen={setSubMenuIsOpen}
                level={2}
                menuItem={menuItem}
              />
              <ApiSidebar menuStyle={menuStyle} setSubMenuIsOpen={setSubMenuIsOpen} level={2} menuItem={menuItem} />
            </>
          )} */}
        </Collapse>
      </Box>
    </Draggable>
  );
};

export default RecursiveBlock;
