import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import {Box, Button} from "@mui/material";
import {BsThreeDots} from "react-icons/bs";
import RecursiveBlock from "../SidebarRecursiveBlock/RecursiveBlockComponent";
import "./style.scss";
import RingLoaderWithWrapper from "../../Loaders/RingLoader/RingLoaderWithWrapper";
import PushPinIcon from "@mui/icons-material/PushPin";
import {useDispatch, useSelector} from "react-redux";
import {mainActions} from "../../../store/main/main.slice";
import {useTranslation} from "react-i18next";
import Permissions from "../Components/Permission";
import DocumentsSidebar from "../Components/Documents/DocumentsSidebar";
import Users from "../Components/Users";
import Resources from "../Components/Resources";
import {Container} from "react-smooth-dnd";
import {applyDrag} from "../../../utils/applyDrag";
import menuService from "../../../services/menuService";
import {useState} from "react";
import {useQueryClient} from "react-query";
import {showAlert} from "../../../store/alert/alert.thunk";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DoneIcon from "@mui/icons-material/Done";
import {store} from "../../../store";
import {menuActions} from "../../../store/menuItem/menuItem.slice";
import {useSearchParams} from "react-router-dom";
import QuerySidebar from "../Components/Query/QuerySidebar";
import ActivityFeedButton from "../Components/ActivityFeedButton";
import ProjectSettings from "../Components/ProjectSettings";
import ApiMenu from "../Components/ApiMenu/Index";
export const adminId = `${import.meta.env.VITE_ADMIN_FOLDER_ID}`;

const SubMenu = ({
  child,
  subMenuIsOpen,
  openFolderCreateModal,
  setFolderModalType,
  setTableModal,
  setSubMenuIsOpen,
  handleOpenNotify,
  setElement,
  selectedApp,
  isLoading,
  menuStyle,
  setSelectedApp,
  setLinkedTableModal,
  menuItem,
}) => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const pinIsEnabled = useSelector((state) => state.main.pinIsEnabled);
  const {i18n} = useTranslation();
  const defaultLanguage = i18n.language;
  const [searchParams, setSearchParams] = useSearchParams();

  const [isCopied, setIsCopied] = useState(false);
  const company = store.getState().company;
  const addPermission =
    selectedApp?.id === "c57eedc3-a954-4262-a0af-376c65b5a280" ||
    selectedApp?.id === "9e988322-cffd-484c-9ed6-460d8701551b";
  const handleClick = () => {
    navigator.clipboard.writeText(
      `https://wiki.u-code.io/main/744d63e6-0ab7-4f16-a588-d9129cf959d1?project_id=${company.projectId}&env_id=${company.environmentId}`
    );
    setIsCopied(true);
    dispatch(showAlert("Скопировано в буфер обмена", "success"));
    setTimeout(() => setIsCopied(false), 3000);
  };

  const exception =
    selectedApp?.id !== "c57eedc3-a954-4262-a0af-376c65b5a282" &&
    selectedApp?.id !== "8a6f913a-e3d4-4b73-9fc0-c942f343d0b9" &&
    selectedApp?.id !== "9e988322-cffd-484c-9ed6-460d8701551b" &&
    selectedApp?.id !== "c57eedc3-a954-4262-a0af-376c65b5a280" &&
    selectedApp?.id !== "31a91a86-7ad3-47a6-a172-d33ceaebb35f";

  const setPinIsEnabledFunc = (val) => {
    dispatch(mainActions.setPinIsEnabled(val));
  };

  const clickHandler = (e) => {
    if (selectedApp?.id === "8a6f913a-e3d4-4b73-9fc0-c942f343d0b9") {
      handleOpenNotify(e, "CREATE_TO_MINIO");
    } else if (selectedApp?.id === "744d63e6-0ab7-4f16-a588-d9129cf959d1") {
      handleOpenNotify(e, "WIKI_FOLDER");
    } else if (selectedApp?.id === "c57eedc3-a954-4262-a0af-376c65b5a282") {
      handleOpenNotify(e, "FAVOURITE");
    } else {
      handleOpenNotify(e, "ROOT");
    }
    setElement(selectedApp);
    dispatch(menuActions.setMenuItem(selectedApp));
  };

  const onDrop = (dropResult) => {
    const result = applyDrag(child, dropResult);
    if (result) {
      menuService
        .updateOrder({
          menus: result,
        })
        .then(() => {
          queryClient.refetchQueries(["MENU"]);
        });
    }
  };

  return (
    <div
      className={`SubMenu ${!subMenuIsOpen || !selectedApp?.id ? "right-side-closed" : ""}`}
      style={{
        background: menuStyle?.background || "#fff",
      }}>
      <div className="body">
        <div className="header" onClick={() => {}}>
          {subMenuIsOpen && (
            <h2
              style={{
                color: menuStyle?.text || "#000",
              }}>
              {selectedApp?.attributes?.[`label_${defaultLanguage}`] ??
                selectedApp?.label}
            </h2>
          )}
          <Box className="buttons">
            <div className="dots">
              {selectedApp?.id === "744d63e6-0ab7-4f16-a588-d9129cf959d1" &&
                (isCopied ? (
                  <DoneIcon
                    style={{
                      color: menuStyle?.text,
                    }}
                    size={13}
                  />
                ) : (
                  <ContentCopyIcon
                    size={13}
                    onClick={handleClick}
                    style={{
                      color: menuStyle?.text,
                    }}
                  />
                ))}
              {!selectedApp?.is_static && (
                <BsThreeDots
                  id={"three_dots"}
                  size={13}
                  onClick={(e) => {
                    handleOpenNotify(e, "FOLDER");
                    setElement(selectedApp);
                  }}
                  style={{
                    color: menuStyle?.text,
                  }}
                />
              )}
              {selectedApp?.data?.permission?.write && !addPermission ? (
                <AddIcon
                  id="add_icon"
                  size={13}
                  onClick={(e) => {
                    clickHandler(e);
                  }}
                  style={{
                    color: menuStyle?.text,
                  }}
                />
              ) : null}
              <PushPinIcon
                size={13}
                onClick={() => {
                  if (!pinIsEnabled) setPinIsEnabledFunc(true);
                  else setPinIsEnabledFunc(false);
                }}
                style={{
                  rotate: pinIsEnabled ? "" : "45deg",
                  color: menuStyle?.text,
                }}
              />
            </div>
            <div
              className="close-btn"
              onClick={() => {
                setSelectedApp({});
                setSubMenuIsOpen(false);
              }}>
              <ClearIcon />
            </div>
          </Box>
        </div>

        <Box
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            height: "calc(100% - 56px)",
          }}>
          <div>
            {isLoading ? (
              <RingLoaderWithWrapper />
            ) : (
              <Box className="nav-block">
                {selectedApp?.id === adminId && (
                  <ProjectSettings
                    handleOpenNotify={handleOpenNotify}
                    menuStyle={menuStyle}
                    setSubMenuIsOpen={setSubMenuIsOpen}
                    pinIsEnabled={pinIsEnabled}
                  />
                )}
                {selectedApp?.id === adminId && (
                  <Permissions menuStyle={menuStyle} setElement={setElement} />
                )}
                {selectedApp?.id === adminId && (
                  <Resources
                    handleOpenNotify={handleOpenNotify}
                    menuStyle={menuStyle}
                    setSubMenuIsOpen={setSubMenuIsOpen}
                    pinIsEnabled={pinIsEnabled}
                  />
                )}
                {selectedApp?.id === adminId && (
                  <ApiMenu
                    handleOpenNotify={handleOpenNotify}
                    menuStyle={menuStyle}
                    setSubMenuIsOpen={setSubMenuIsOpen}
                    pinIsEnabled={pinIsEnabled}
                  />
                )}
                {selectedApp?.id === "9e988322-cffd-484c-9ed6-460d8701551b" && (
                  <Users
                    menuStyle={menuStyle}
                    setSubMenuIsOpen={setSubMenuIsOpen}
                    child={child}
                    selectedApp={selectedApp}
                  />
                )}
                <div className="menu-element">
                  {selectedApp?.id !== "9e988322-cffd-484c-9ed6-460d8701551b" &&
                  child?.length ? (
                    <Container
                      dragHandleSelector=".column-drag-handle"
                      onDrop={onDrop}>
                      {child?.map((element, index) => (
                        <RecursiveBlock
                          key={element.id}
                          element={element}
                          openFolderCreateModal={openFolderCreateModal}
                          setFolderModalType={setFolderModalType}
                          sidebarIsOpen={subMenuIsOpen}
                          setTableModal={setTableModal}
                          setLinkedTableModal={setLinkedTableModal}
                          handleOpenNotify={handleOpenNotify}
                          setElement={setElement}
                          setSubMenuIsOpen={setSubMenuIsOpen}
                          menuStyle={menuStyle}
                          menuItemId={searchParams.get("menuId")}
                          index={index}
                          selectedApp={selectedApp}
                        />
                      ))}
                    </Container>
                  ) : null}
                  {selectedApp?.id ===
                    "31a91a86-7ad3-47a6-a172-d33ceaebb35f" && (
                    <DocumentsSidebar
                      menuStyle={menuStyle}
                      setSubMenuIsOpen={setSubMenuIsOpen}
                      menuItem={menuItem}
                      level={2}
                    />
                  )}
                  {selectedApp?.id === adminId && (
                    <QuerySidebar
                      menuStyle={menuStyle}
                      setSubMenuIsOpen={setSubMenuIsOpen}
                    />
                  )}
                  {selectedApp?.id === adminId && (
                    <ActivityFeedButton
                      menuStyle={menuStyle}
                      menuItem={menuItem}
                      level={2}
                      setSubMenuIsOpen={setSubMenuIsOpen}
                      pinIsEnabled={pinIsEnabled}
                    />
                  )}
                </div>
              </Box>
            )}

            {selectedApp?.data?.permission?.write && exception ? (
              <Button
                id="create_btn"
                className="menu-button active-with-child"
                onClick={clickHandler}
                openFolderCreateModal={openFolderCreateModal}
                style={{
                  background: menuStyle?.background || "#fff",
                  color: menuStyle?.text || "",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-start",
                }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    color: "#A8A8A8",
                    fontSize: "14px",
                    fontWeight: 500,
                    lineHeight: "24px",
                    flex: 1,
                    whiteSpace: "nowrap",
                    columnGap: "8px",
                  }}>
                  <AddIcon
                    style={{
                      width: 15,
                      color: menuStyle?.text,
                    }}
                  />
                  Create
                </div>
              </Button>
            ) : null}
          </div>
        </Box>
      </div>
    </div>
  );
};

export default SubMenu;
