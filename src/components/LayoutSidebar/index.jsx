import "./style.scss";
import AddIcon from "@mui/icons-material/Add";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import {Box, Button, Divider} from "@mui/material";
import {useEffect, useState} from "react";
import {useQuery, useQueryClient} from "react-query";
import {useDispatch, useSelector} from "react-redux";
import {Container} from "react-smooth-dnd";
import {UdevsLogo} from "../../assets/icons/icon";
import FolderCreateModal from "../../layouts/MainLayout/FolderCreateModal";
import LinkTableModal from "../../layouts/MainLayout/LinkTableModal";
import MenuSettingModal from "../../layouts/MainLayout/MenuSettingModal";
import MicrofrontendLinkModal from "../../layouts/MainLayout/MicrofrontendLinkModal";
import TableLinkModal from "../../layouts/MainLayout/TableLinkModal";
import TemplateModal from "../../layouts/MainLayout/TemplateModal";
import clientTypeServiceV2 from "../../services/auth/clientTypeServiceV2";
import menuService, {
  useMenuGetByIdQuery,
  useMenuListQuery,
} from "../../services/menuService";
import {useMenuSettingGetByIdQuery} from "../../services/menuSettingService";
import menuSettingsService from "../../services/menuSettingsService";
import {useProjectGetByIdQuery} from "../../services/projectService";
import {store} from "../../store";
import {mainActions} from "../../store/main/main.slice";
import {applyDrag} from "../../utils/applyDrag";
import RingLoaderWithWrapper from "../Loaders/RingLoader/RingLoaderWithWrapper";
import NewProfilePanel from "../ProfilePanel/NewProfileMenu";
import AppSidebar from "./AppSidebarComponent";
import MenuBox from "./Components/MenuBox";
import FolderModal from "./FolderModalComponent";
import MenuButtonComponent from "./MenuButtonComponent";
import ButtonsMenu from "./MenuButtons";
import SubMenu from "./SubMenu";
import WikiFolderCreateModal from "../../layouts/MainLayout/WikiFolderCreateModal";
import {useSearchParams} from "react-router-dom";
import AiChatMenu from "../ProfilePanel/AIChat";

const LayoutSidebar = ({appId}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [menuItem, setMenuItem] = useState(null);

  const sidebarIsOpen = useSelector(
    (state) => state.main.settingsSidebarIsOpen
  );
  const pinIsEnabled = useSelector((state) => state.main.pinIsEnabled);
  const subMenuIsOpen = useSelector(
    (state) => state.main.subMenuIsOpen
  );

  const projectId = store.getState().company.projectId;

  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const [modalType, setModalType] = useState(null);
  const [folderModalType, setFolderModalType] = useState(null);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [menuList, setMenuList] = useState();
  const [tableModal, setTableModalOpen] = useState(false);
  const [linkTableModal, setLinkTableModal] = useState(false);
  const [microfrontendModal, setMicrofrontendModalOpen] = useState(false);
  const [menuSettingModal, setMenuSettingModalOpen] = useState(false);
  const [templateModal, setTemplateModalOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState();
  const [child, setChild] = useState();
  const [element, setElement] = useState();
  const [subSearchText, setSubSearchText] = useState();
  // const [subMenuIsOpen, setSubMenuIsOpen] = useState(false);
  const [menu, setMenu] = useState({event: "", type: ""});
  const openSidebarMenu = Boolean(menu?.event);
  const [sidebarAnchorEl, setSidebarAnchor] = useState(null);
  const {data: projectInfo} = useProjectGetByIdQuery({projectId});

  const setSubMenuIsOpen = (val) => {
    dispatch(mainActions.setSubMenuIsOpen(val));
  }

  const {data: menuById} = useMenuGetByIdQuery({
    menuId: "c57eedc3-a954-4262-a0af-376c65b5a284",
  });

  const {data: menuTemplate} = useMenuSettingGetByIdQuery({
    params: {
      template_id:
        menuById?.attributes?.menu_settings_id ||
        "f922bb4c-3c4e-40d4-95d5-c30b7d8280e3",
    },
    menuId: "adea69cd-9968-4ad0-8e43-327f6600abfd",
  });

  const menuStyle = menuTemplate?.menu_template;
  const permissions = useSelector((state) => state.auth.globalPermissions);

  const handleOpenNotify = (event, type) => {
    setMenu({event: event?.currentTarget, type: type});
  };
  const handleCloseNotify = () => {
    setMenu(null);
  };
  const {isLoading} = useMenuListQuery({
    params: {
      parent_id: appId || menuItem?.id,
      search: subSearchText,
    },
    queryParams: {
      enabled: Boolean(appId),
      onSuccess: (res) => {
        setChild(res.menus ?? []);
      },
    },
  });

  const setTableModal = (element) => {
    setTableModalOpen(true);
    setSelectedFolder(element);
  };
  const closeTableModal = () => {
    setTableModalOpen(null);
  };
  const setLinkedTableModal = (element) => {
    setLinkTableModal(true);
    setSelectedFolder(element);
  };
  const closeLinkedTableModal = () => {
    setLinkTableModal(null);
  };
  const setMicrofrontendModal = (element) => {
    setMicrofrontendModalOpen(true);
    setSelectedFolder(element);
  };
  const closeMicrofrontendModal = () => {
    setMicrofrontendModalOpen(null);
  };
  const handleMenuSettingModalOpen = () => {
    setMenuSettingModalOpen(true);
  };
  const closeMenuSettingModal = () => {
    setMenuSettingModalOpen(null);
  };
  const handleTemplateModalOpen = () => {
    setTemplateModalOpen(true);
  };
  const closeTemplateModal = () => {
    setTemplateModalOpen(null);
  };
  const closeModal = () => {
    setModalType(null);
  };
  const closeFolderModal = () => {
    setFolderModalType(null);
  };
  const openFolderCreateModal = (type, element) => {
    setModalType(type);
    setSelectedFolder(element);
  };

  const deleteFolder = (element) => {
    menuSettingsService
      .delete(element.id)
      .then(() => {
        queryClient.refetchQueries(["MENU"], element?.id);
        getMenuList();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getMenuList = () => {
    menuSettingsService
      .getList({
        parent_id: "c57eedc3-a954-4262-a0af-376c65b5a284",
      })
      .then((res) => {
        setMenuList(res.menus);
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  const {isLoadingUser} = useQuery(
    ["GET_CLIENT_TYPE_LIST", appId],
    () => {
      return clientTypeServiceV2.getList();
    },
    {
      enabled: Boolean(appId === "9e988322-cffd-484c-9ed6-460d8701551b"),
      onSuccess: (res) => {
        setChild(
          res.data.response?.map((row) => ({
            ...row,
            type: "USER",
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

  const onDrop = (dropResult) => {
    const result = applyDrag(menuList, dropResult);
    if (result) {
      menuService
        .updateOrder({
          menus: result,
        })
        .then(() => {
          getMenuList();
        });
    }
  };

  const setSidebarIsOpen = (val) => {
    dispatch(mainActions.setSettingsSidebarIsOpen(val));
  };
  useEffect(() => {
    if (menuTemplate?.icon_style === "MODERN") {
      setSidebarIsOpen(false);
    } else {
      setSidebarIsOpen(true);
    }
  }, [menuTemplate]);

  useEffect(() => {
    getMenuList();
  }, []);

  useEffect(() => {
    setSelectedApp(menuList?.find((item) => item?.id === appId));
  }, [menuList]);

  useEffect(() => {
    setSelectedApp(menuList?.find((item) => item?.id === appId));
  }, [appId]);

  useEffect(() => {
    if (
      selectedApp?.type === "FOLDER" ||
      (selectedApp?.type === "USER_FOLDER" && pinIsEnabled)
    )
      setSubMenuIsOpen(true);
  }, [selectedApp]);

  useEffect(() => {
    if (searchParams.get("menuId")) {
      menuService
        .getByID({
          menuId: searchParams.get("menuId"),
        })
        .then((res) => {
          setMenuItem(res);
        });
    }
  }, []);

  return (
    <>
      <div
        className={`LayoutSidebar ${!sidebarIsOpen ? "right-side-closed" : ""}`}
        style={{
          background: menuStyle?.background || "#fff",
        }}>
        <div className="header">
          <div className="brand">
            {projectInfo?.logo ? (
              <img src={projectInfo?.logo} alt="" width={40} height={40} />
            ) : (
              <UdevsLogo fill={"#007AFF"} />
            )}

            {!sidebarIsOpen && (
              <Button
                onClick={() => setSidebarIsOpen(!sidebarIsOpen)}
                style={{
                  position: "absolute",
                  zIndex: "2",
                  left: "58px",
                  width: "20px",
                  height: "20px",
                  minWidth: "20px",
                  borderRadius: "50%",
                  border: "1px solid #e5e5e5",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "#fff",
                }}>
                <KeyboardDoubleArrowRightIcon />
              </Button>
            )}

            {sidebarIsOpen && (
              <h2
                style={{
                  marginLeft: "8px",
                  color: menuStyle?.text || "#000",
                  fontSize: "20px",
                  fontWeight: "700",
                }}>
                {projectInfo?.title}
              </h2>
            )}
          </div>

          {sidebarIsOpen && (
            <Button onClick={() => setSidebarIsOpen(!sidebarIsOpen)}>
              <KeyboardDoubleArrowLeftIcon />
            </Button>
          )}
        </div>

        <Box
          style={{
            display: "flex",
            flexDirection: "column",
            height: "80vh",
            overflow: "hidden",
          }}>
          <div
            style={{
              overflow: "auto",
            }}
            className="p-nav-block">
            {!menuList ? (
              <RingLoaderWithWrapper />
            ) : (
              <Box>
                <div
                  className="nav-block"
                  style={{
                    background: menuStyle?.background || "#fff",
                    color: menuStyle?.text || "#000",
                  }}>
                  <div className="menu-element">
                    <Container
                      dragHandleSelector=".column-drag-handle"
                      onDrop={onDrop}>
                      {menuList &&
                        menuList?.map((element, index) => (
                          <AppSidebar
                            key={index}
                            element={element}
                            sidebarIsOpen={sidebarIsOpen}
                            setElement={setElement}
                            setSubMenuIsOpen={setSubMenuIsOpen}
                            subMenuIsOpen={subMenuIsOpen}
                            handleOpenNotify={handleOpenNotify}
                            setSelectedApp={setSelectedApp}
                            selectedApp={selectedApp}
                            menuTemplate={menuTemplate}
                          />
                        ))}
                    </Container>
                  </div>
                </div>
                {permissions?.menu_button && (
                  <MenuButtonComponent
                    title={"Create"}
                    icon={
                      <AddIcon
                        style={{
                          width:
                            menuTemplate?.icon_size === "SMALL"
                              ? 10
                              : menuTemplate?.icon_size === "MEDIUM"
                                ? 15
                                : 18 || 18,
                          color: menuStyle?.text,
                        }}
                      />
                    }
                    onClick={(e) => {
                      handleOpenNotify(e, "CREATE");
                    }}
                    sidebarIsOpen={sidebarIsOpen}
                    style={{
                      background: menuStyle?.background || "#fff",
                      color: menuStyle?.text || "",
                    }}
                  />
                )}
                <Divider />
              </Box>
            )}
          </div>
        </Box>
        <MenuBox
          title={""}
          openFolderCreateModal={openFolderCreateModal}
          children={<AiChatMenu sidebarIsOpen={sidebarIsOpen} />}
          onClick={(e) => {
            e.stopPropagation();
            setSidebarAnchor(true);
          }}
          style={{
            background: menuStyle?.background || "#fff",
            color: menuStyle?.text || "#000",
            height: "40px",
            cursor: "pointer",
          }}
          sidebarIsOpen={sidebarIsOpen}
        />
        <MenuBox
          title={"Profile"}
          openFolderCreateModal={openFolderCreateModal}
          children={
            <>
              <NewProfilePanel
                sidebarAnchorEl={sidebarAnchorEl}
                setSidebarAnchor={setSidebarAnchor}
                handleMenuSettingModalOpen={handleMenuSettingModalOpen}
                handleTemplateModalOpen={handleTemplateModalOpen}
              />
            </>
          }
          onClick={(e) => {
            e.stopPropagation();
            setSidebarAnchor(true);
          }}
          style={{
            background: menuStyle?.background || "#fff",
            color: menuStyle?.text || "#000",
            height: "60px",
            cursor: "pointer",
          }}
          sidebarIsOpen={sidebarIsOpen}
        />

        {(modalType === "create" ||
          modalType === "parent" ||
          modalType === "update") && (
          <FolderCreateModal
            closeModal={closeModal}
            selectedFolder={selectedFolder}
            modalType={modalType}
            appId={appId}
            getMenuList={getMenuList}
          />
        )}
        {modalType === "WIKI_UPDATE" || modalType === "WIKI_FOLDER_UPDATE" ? (
          <WikiFolderCreateModal
            closeModal={closeModal}
            selectedFolder={selectedFolder}
            modalType={modalType}
            appId={appId}
            getMenuList={getMenuList}
          />
        ) : null}
        {tableModal && (
          <TableLinkModal
            closeModal={closeTableModal}
            selectedFolder={selectedFolder}
            getMenuList={getMenuList}
          />
        )}
        {linkTableModal && (
          <LinkTableModal
            closeModal={closeLinkedTableModal}
            selectedFolder={selectedFolder}
            getMenuList={getMenuList}
          />
        )}
        {microfrontendModal && (
          <MicrofrontendLinkModal
            closeModal={closeMicrofrontendModal}
            selectedFolder={selectedFolder}
            getMenuList={getMenuList}
          />
        )}
        {folderModalType === "folder" && (
          <FolderModal
            closeModal={closeFolderModal}
            modalType={folderModalType}
            menuList={menuList}
            element={element}
            getMenuList={getMenuList}
          />
        )}
      </div>
      <SubMenu
        child={child}
        subMenuIsOpen={subMenuIsOpen}
        setSubMenuIsOpen={setSubMenuIsOpen}
        openFolderCreateModal={openFolderCreateModal}
        setFolderModalType={setFolderModalType}
        setTableModal={setTableModal}
        setLinkedTableModal={setLinkedTableModal}
        setSubSearchText={setSubSearchText}
        handleOpenNotify={handleOpenNotify}
        setElement={setElement}
        selectedApp={selectedApp}
        isLoading={isLoading}
        menuStyle={menuStyle}
        setChild={setChild}
        setSelectedApp={setSelectedApp}
        menuItem={menuItem}
      />
      {menu?.type?.length ? (
        <ButtonsMenu
          element={element}
          menu={menu?.event}
          openMenu={openSidebarMenu}
          handleCloseNotify={handleCloseNotify}
          openFolderCreateModal={openFolderCreateModal}
          menuType={menu?.type}
          setFolderModalType={setFolderModalType}
          appId={appId || "c57eedc3-a954-4262-a0af-376c65b5a284"}
          setTableModal={setTableModal}
          setLinkedTableModal={setLinkedTableModal}
          setMicrofrontendModal={setMicrofrontendModal}
          deleteFolder={deleteFolder}
          getMenuList={getMenuList}
        />
      ) : null}
      {templateModal && <TemplateModal closeModal={closeTemplateModal} />}
      {menuSettingModal && (
        <MenuSettingModal closeModal={closeMenuSettingModal} />
      )}
    </>
  );
};

export default LayoutSidebar;
