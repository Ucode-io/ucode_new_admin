import styles from "./style.module.scss";
import companyLogo from "../../../builder_config/assets/company-logo.svg";
import { Box, Collapse, Tooltip, Typography } from "@mui/material";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import React, { useEffect, useMemo, useState } from "react";
import { NavLink, useLocation, useParams } from "react-router-dom";
import IconGenerator from "../IconPicker/IconGenerator";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import { useDispatch, useSelector } from "react-redux";
import { useQuery } from "react-query";
import projectService from "../../services/projectService";
import { Container, Draggable } from "react-smooth-dnd";
import { applyDrag } from "../../utils/applyDrag";
import applicationService from "../../services/applicationService";
import { fetchConstructorTableListAction } from "../../store/constructorTable/constructorTable.thunk";
import constructorTableService from "../../services/constructorTableService";

const Sidebar = ({ elements = [], environment }) => {
  const dispatch = useDispatch();
  const { appId } = useParams();
  const location = useLocation();
  const [visible, setVisible] = useState(false);
  const projectId = useSelector((state) => state.auth.projectId);
  const [rightBlockVisible, setRightBlockVisible] = useState(true);
  const applicationElements = useSelector((state) => state.constructorTable.applications);

  const selectedMenuItem = useMemo(() => {
    const activeElement = elements.find((el) => {
      if (location.pathname === el.path) return true;
      return el.children?.some((child) => location.pathname.includes(child.path));
    });
    return activeElement;
  }, [location.pathname, elements]);

  const setVisibBlock = () => {
    setVisible(!visible);
  };

  useEffect(() => {
    if (selectedMenuItem?.children) setRightBlockVisible(true);
  }, [selectedMenuItem]);

  const { data: projectInfo } = useQuery(["GET_PROJECT_BY_ID", projectId], () => {
    return projectService.getById(projectId);
  });
  const { data: tableFolder } = useQuery(["GET_TABLE_FOLDER"], () => {
    return constructorTableService.getFolderList(projectId);
  });

  const onDrop = (dropResult) => {
    const result = applyDrag(elements, dropResult);
    const computedTables = [
      ...result.map((el) => ({
        table_id: el.id,
        is_visible: Boolean(el.is_visible),
        is_own_table: Boolean(el.is_own_table),
      })),
    ];
    if (result) {
      applicationService
        .update({
          ...applicationElements,
          tables: computedTables,
        })
        .then(() => {
          // dispatch(fetchConstructorTableListAction(appId));
        });
    }
  };

  return (
    <div className={styles.sidebar}>
      <div className={visible ? styles.leftSide_open : styles.leftSide}>
        <div
          className={styles.header}
          onClick={() => {
            setRightBlockVisible((prev) => !prev);
            setVisibBlock();
          }}
        >
          <div className={styles.headerLogo}>
            <img className={styles.logo} src={projectInfo?.logo ?? companyLogo} alt="logo" />
            {visible && <h2>{projectInfo?.title}</h2>}
          </div>
          {visible && (
            <div className={styles.closeBtn} onClick={setVisibBlock}>
              <MenuOpenIcon />
            </div>
          )}
        </div>

        <div
          className={styles.scrollBlock}
          style={{
            background: environment?.data?.background || "#fff",
          }}
        >
          <div className={styles.menuItemsBlock}>
            <Container lockAxis="y" onDrop={onDrop} dropPlaceholder={{ className: "drag-row-drop-preview" }}>
              {elements
                .filter((element) => element.icon)
                .map((element) => (
                  <Tooltip placement="right" followCursor key={element.id} title={element.title}>
                    <Box className={styles.dragBox}>
                      <Draggable key={element.id}>
                        {visible ? (
                          <div className={styles.navLinkOpen}>
                            <NavLink
                              key={element.id}
                              to={element.path ?? element.children?.[0]?.path}
                              className={`${styles.menuItem} ${selectedMenuItem?.id === element.id ? styles.active : ""}`}
                              style={{
                                color: selectedMenuItem?.id === element.id ? environment?.data?.active_color || "#fff" : environment?.data?.color || "#6E8BB7",
                                background: selectedMenuItem?.id === element.id ? environment?.data?.active_background || "#007AFF" : "",
                              }}
                              // onClick={setVisibBlock}
                            >
                              {typeof element.icon === "string" ? (
                                <div className={styles.noficationButton}>
                                  <IconGenerator icon={element.icon} size={18} />
                                  {element?.count_notifications && <span className={styles.notificationNum}>{element?.count_notifications ?? 0}</span>}
                                </div>
                              ) : (
                                // <IconPickerItem icon="FaAdobe" size={24} />
                                <element.icon />
                              )}
                              <span>{element?.title}</span>
                            </NavLink>
                          </div>
                        ) : (
                          <NavLink
                            key={element.id}
                            to={element.path ?? element.children?.[0]?.path}
                            className={`${styles.menuItem} ${selectedMenuItem?.id === element.id ? styles.active : ""}`}
                            style={{
                              color: selectedMenuItem?.id === element.id ? environment?.data?.active_color || "#fff" : environment?.data?.color || "#6E8BB7",
                              background: selectedMenuItem?.id === element.id ? environment?.data?.active_background || "#007AFF" : "",
                            }}
                            // onClick={setVisibBlock}
                          >
                            {typeof element.icon === "string" ? (
                              <div className={styles.noficationButtons}>
                                <IconGenerator icon={element.icon} size={18} />
                                {element?.count_notifications && <span className={styles.notificationNums}>{element?.count_notifications ?? 0}</span>}
                              </div>
                            ) : (
                              // <IconPickerItem icon="FaAdobe" size={24} />
                              <element.icon />
                            )}
                          </NavLink>
                        )}
                      </Draggable>
                    </Box>
                  </Tooltip>
                ))}
            </Container>
          </div>

          {/* <div className={styles.footer}>
          <div className={styles.menuItem}>
            <NotificationsIcon />
          </div>

          {settingsElements
            .filter((element) => element.icon)
            .map((element) => (
              <Tooltip
                placement="right"
                followCursor
                key={element.id}
                title={element.title}
              >
                <NavLink
                  key={element.id}
                  to={element.path ?? element.children?.[0]?.path}
                  className={`${styles.menuItem} ${
                    selectedMenuItem?.id === element.id ? styles.active : ""
                  }`}
                >
                  {typeof element.icon === "string" ? (
                    <IconGenerator icon={element.icon} size={18} />
                  ) : (
                    <element.icon />
                  )}
                </NavLink>
              </Tooltip>
            ))}

          <UserAvatar disableTooltip />

          <div className={styles.menuItem} onClick={logout}>
            <LogoutIcon />
          </div>
        </div> */}
        </div>
      </div>

      <Collapse in={rightBlockVisible && selectedMenuItem?.children} orientation="horizontal" unmountOnExit>
        <div className={styles.rightSide}>
          <div className={styles.header}>
            <Typography className={styles.title} variant="h4">
              {selectedMenuItem?.title}
            </Typography>
            <div className={styles.closeButton} onClick={() => setRightBlockVisible(false)}>
              <KeyboardDoubleArrowLeftIcon />
            </div>
          </div>

          <div className={styles.menuItemsBlock}>
            {selectedMenuItem?.children?.map((childMenuItem) => (
              <NavLink to={childMenuItem.path} key={childMenuItem.key} className={({ isActive }) => `${styles.menuItem} ${isActive ? styles.active : ""}`}>
                {childMenuItem.title}
              </NavLink>
            ))}
          </div>
        </div>
      </Collapse>
    </div>
  );
};

export default Sidebar;
