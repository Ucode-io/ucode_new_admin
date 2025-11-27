import "./style.scss";
import {Box, ListItemButton, ListItemText, Tooltip} from "@mui/material";
import {useEffect, useMemo} from "react";
import {BsThreeDots} from "react-icons/bs";
import {useNavigate, useParams, useSearchParams} from "react-router-dom";
import {Draggable} from "react-smooth-dnd";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import AddIcon from "@mui/icons-material/Add";
import IconGenerator from "../IconPicker/IconGenerator";
import {useDispatch} from "react-redux";
import {menuActions} from "../../store/menuItem/menuItem.slice";
import MenuIcon from "./MenuIcon";
import {useTranslation} from "react-i18next";
import {store} from "../../store";
import {useQueryClient} from "react-query";
import FolderIcon from "@mui/icons-material/Folder";
import {relationTabActions} from "../../store/relationTab/relationTab.slice";
export const adminId = `${import.meta.env.VITE_ADMIN_FOLDER_ID}`;
export const analyticsId = `${import.meta.env.VITE_ANALYTICS_FOLDER_ID}`;

const AppSidebar = ({
  index,
  element,
  sidebarIsOpen,
  setElement,
  setSubMenuIsOpen,
  handleOpenNotify,
  setSelectedApp,
  selectedApp,
  menuTemplate,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {i18n} = useTranslation();
  const queryClient = useQueryClient();
  const auth = store.getState().auth;
  const {appId} = useParams();

  const defaultAdmin = auth?.roleInfo?.name === "DEFAULT ADMIN";
  const readPermission = element?.data?.permission?.read;
  const withoutPermission =
    element?.id === adminId || element?.id === analyticsId ? true : false;
  const permission = defaultAdmin
    ? readPermission || withoutPermission
    : readPermission;

  const clickHandler = () => {
    dispatch(menuActions.setMenuItem(element));
    dispatch(relationTabActions.clear());
    setSelectedApp(element);
    if (element.type === "FOLDER") {
      if (element?.id === "9e988322-cffd-484c-9ed6-460d8701551b") {
        setElement(element);
        setSubMenuIsOpen(true);
        navigate(`/main/${element.id}`);
        queryClient.refetchQueries("GET_CLIENT_TYPE_LIST");
      } else {
        setElement(element);
        setSubMenuIsOpen(true);
        navigate(`/main/${element.id}`);
      }
    } else if (element.type === "TABLE") {
      setSubMenuIsOpen(false);
      navigate(
        `/main/${element?.parent_id}/object/${element?.data?.table?.slug}?menuId=${element?.id}`
      );
    } else if (element.type === "LINK") {
      if (element?.id === "3b74ee68-26e3-48c8-bc95-257ca7d6aa5c") {
        navigate(
          replaceValues(
            element?.attributes?.link,
            auth?.loginTableSlug,
            auth?.userId
          )
        );
      } else {
        navigate(element?.attributes?.link);
      }
      setSubMenuIsOpen(false);
    } else if (element.type === "MICROFRONTEND") {
      setSubMenuIsOpen(false);
      let obj = {};
      element?.attributes?.params.forEach((el) => {
        obj[el.key] = el.value;
      });
      const searchParams = new URLSearchParams(obj || {});
      return navigate({
        pathname: `/main/${element.id}/page/${element?.data?.microfrontend?.id}`,
        search: `?menuId=${element?.id}&${searchParams.toString()}`,
      });
    } else if (element.type === "WEBPAGE") {
      navigate(
        `/main/${element?.id}/web-page/${element?.data?.webpage?.id}?menuId=${element?.id}`
      );
      setSubMenuIsOpen(false);
    }
  };
  const menuStyle = menuTemplate?.menu_template;

  const [searchParams] = useSearchParams();

  const menuItem = searchParams.get("menuId");

  function replaceValues(inputString, loginTableSlug, userId) {
    return inputString
      .replace("{login_table_slug}", loginTableSlug)
      .replace("{user_id}", userId);
  }

  useEffect(() => {
    setElement(element);
  }, [element]);

  const defaultLanguage = i18n.language;

  const activeMenu =
    element?.type === "FOLDER"
      ? Boolean(selectedApp?.id === element?.id)
      : element?.id === menuItem;

  return (
    <Draggable key={index}>
      {permission ? (
        <ListItemButton
          key={index}
          onClick={(e) => {
            e.stopPropagation();
            clickHandler();
          }}
          className="parent-folder column-drag-handle awdaw"
          style={{
            background: activeMenu
              ? menuStyle?.active_background ?? "#007AFF"
              : menuStyle?.background,
            cursor: "pointer",
            color:
              Boolean(
                appId !== "c57eedc3-a954-4262-a0af-376c65b5a284" &&
                  appId === element?.id
              ) || menuItem === element?.id
                ? "#fff"
                : "#A8A8A8",
            borderRadius: "10px",
            margin: "0 10px",
          }}>
          <IconGenerator
            icon={
              element?.icon ||
              element?.data?.microfrontend?.icon ||
              element?.data?.webpage?.icon ||
              "folder.svg"
            }
            size={
              menuTemplate?.icon_size === "SMALL"
                ? 10
                : menuTemplate?.icon_size === "MEDIUM"
                  ? 15
                  : 18 || 18
            }
            className="folder-icon"
            style={{
              marginRight: sidebarIsOpen ? "8px" : "0px",
              color: activeMenu
                ? menuStyle?.active_text
                : menuStyle?.text || "",
            }}
          />

          {sidebarIsOpen && (
            <ListItemText
              primary={
                element?.attributes?.[`label_${defaultLanguage}`] ||
                element?.label ||
                element?.data?.microfrontend?.name ||
                element?.data?.webpage?.title
              }
              style={{
                color: activeMenu
                  ? menuStyle?.active_text
                  : menuStyle?.text || "#A8A8A8",
              }}
            />
          )}
          {element?.type === "FOLDER" &&
          sidebarIsOpen &&
          !element?.is_static ? (
            <>
              {(element?.data?.permission?.delete ||
                element?.data?.permission?.update ||
                element?.data?.permission?.write) && (
                <Tooltip title="Folder settings" placement="top">
                  <Box className="extra_icon">
                    <BsThreeDots
                      id={"three_dots"}
                      size={13}
                      onClick={(e) => {
                        handleOpenNotify(e, "FOLDER");
                      }}
                      style={{
                        color: activeMenu
                          ? menuStyle?.active_text
                          : menuStyle?.text ?? "#fff",
                      }}
                    />
                  </Box>
                </Tooltip>
              )}

              {element?.data?.permission?.create && (
                <Tooltip title="Create folder" placement="top">
                  <Box
                    id={"create_folder"}
                    className="extra_icon"
                    onClick={(e) => {
                      handleOpenNotify(e, "CREATE_TO_FOLDER");
                    }}>
                    <AddIcon
                      size={13}
                      style={{
                        color: activeMenu
                          ? menuStyle?.active_text
                          : menuStyle?.text || "",
                      }}
                    />
                  </Box>
                </Tooltip>
              )}
            </>
          ) : (
            ""
          )}
          {element?.type === "TABLE" && (
            <MenuIcon
              id={"menu_icon"}
              title="Table settings"
              onClick={(e) => {
                e.stopPropagation();
                handleOpenNotify(e, "TABLE");
                setElement(element);
              }}
              style={{
                color: activeMenu
                  ? menuStyle?.active_text
                  : menuStyle?.text || "",
              }}
              element={element}
            />
          )}
          {element?.type === "LINK" && (
            <MenuIcon
              id={"menu_icon"}
              title="Table settings"
              onClick={(e) => {
                e.stopPropagation();
                handleOpenNotify(e, "LINK");
                setElement(element);
              }}
              style={{
                color: activeMenu
                  ? menuStyle?.active_text
                  : menuStyle?.text || "",
              }}
              element={element}
            />
          )}
          {element?.type === "MICROFRONTEND" && (
            <MenuIcon
              id={"menu_icon"}
              title="Microfrontend settings"
              onClick={(e) => {
                e.stopPropagation();
                handleOpenNotify(e, "MICROFRONTEND");
                setElement(element);
              }}
              style={{
                color:
                  selectedApp?.id === element.id
                    ? menuStyle?.active_text
                    : menuStyle?.text || "",
              }}
              element={element}
            />
          )}
          {element?.type === "WEBPAGE" && (
            <MenuIcon
              id={"menu_icon"}
              title="Webpage settings"
              onClick={(e) => {
                e.stopPropagation();
                handleOpenNotify(e, "WEBPAGE");
                setElement(element);
              }}
              style={{
                color: activeMenu
                  ? menuStyle?.active_text
                  : menuStyle?.text || "",
              }}
            />
          )}
          {sidebarIsOpen && element?.type === "FOLDER" ? (
            <KeyboardArrowRightIcon
              style={{
                color: activeMenu
                  ? menuStyle?.active_text
                  : menuStyle?.text || "",
                transform: selectedApp?.id === element.id && "rotate(90deg)",
                transition: "0.3s",
              }}
            />
          ) : (
            ""
          )}
        </ListItemButton>
      ) : null}
    </Draggable>
  );
};

export default AppSidebar;
