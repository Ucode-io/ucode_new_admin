import { Divider, Menu } from "@mui/material";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { authActions } from "../../store/auth/auth.slice";
import UserAvatar from "../UserAvatar";
import styles from "./style.module.scss";
import { store } from "../../store";

const ProfilePanel = ({
  anchorEl,
  handleMenuSettingModalOpen,
  projectInfo,
}) => {
  const [anchorProfileEl, setProfileAnchorEl] = useState(null);
  const menuVisible = Boolean(anchorEl || anchorProfileEl);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { appId } = useParams();

  const handleClick = () => {
    navigate(`/main/${appId}/api-key`);
  };
  const closeMenu = () => {
    setProfileAnchorEl(null);
  };
  const openMenu = (event) => {
    setProfileAnchorEl(event.currentTarget);
  };

  const logoutClickHandler = () => {
    dispatch(authActions.logout());
    closeMenu();
  };

  return (
    <div>
      <UserAvatar
        user={{
          name: "User",
          photo_url: "https://image.emojisky.com/71/8041071-middle.png",
        }}
        onClick={openMenu}
      />

      <Menu
        id="lock-menu"
        anchorEl={anchorEl || anchorProfileEl}
        open={menuVisible}
        onClose={closeMenu}
        classes={{ list: styles.menu, paper: styles.paper }}
      >
        <div className={styles.scrollBlocksss}>
          {projectInfo && (
            <div className={styles.menuItem}>
              <span className={styles.avatar}>
                {projectInfo?.title?.charAt(0).toUpperCase()}
              </span>

              <p className={styles.itemText}>{projectInfo?.title}</p>
            </div>
          )}
          <div className={styles.menuItem} onClick={handleClick}>
            {/* <KeyIcon className={styles.dragIcon} /> */}

            <p className={styles.itemText}>Api Keys</p>
          </div>
          <div
            className={styles.menuItem}
            onClick={() => {
              navigate(`/settings/auth/matrix/profile/crossed`);
            }}
          >
            {/* <Settings className={styles.dragIcon} /> */}

            <p className={styles.itemText}>Profile settings</p>
          </div>
          <div
            className={styles.menuItem}
            onClick={() => {
              navigate(`/analytics/dashboard`);
            }}
          >
            {/* <AnalyticsIcon className={styles.dragIcon} /> */}

            <p className={styles.itemText}>Analytics</p>
          </div>
          <div
            className={styles.menuItem}
            onClick={() => {
              navigate(`/settings/constructor/apps`);
            }}
          >
            {/* <Settings className={styles.dragIcon} /> */}

            <p className={styles.itemText}>Settings</p>
          </div>

          <div className={styles.menuItem} onClick={logoutClickHandler}>
            {/* <Logout className={styles.dragIcon} /> */}

            <p className={styles.itemText}>Logout</p>
          </div>
        </div>
        <Divider />
        {projectInfo && (
          <div className={styles.scrollBlocksss}>
            <div
              className={styles.menuItem}
              onClick={() => {
                handleMenuSettingModalOpen();
                closeMenu();
              }}
            >
              {/* <KeyIcon className={styles.dragIcon} /> */}
              <p className={styles.itemText}>Menu settings</p>
            </div>
          </div>
        )}
      </Menu>
    </div>
  );
};

export default ProfilePanel;
