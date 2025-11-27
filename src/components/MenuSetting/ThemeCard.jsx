import { Box, IconButton } from "@mui/material";
import styles from "./style.module.scss";
import { LeftArrow, Search, UdevsLogo } from "../../assets/icons/icon";
import {
  Sidebar,
  sidebarElements,
} from "../../layouts/MainLayout/mock/sidebarElements";
import IconGenerator from "../IconPicker/IconGenerator";
import DeleteIcon from "@mui/icons-material/Delete";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
const ThemeCard = ({ item, deleteTemplate, setFormType, setModalType }) => {
  const colors = [
    { color: item?.background },
    { color: item?.active_background },
    { color: item?.text },
    { color: item?.active_text },
  ];
  return (
    <>
      <Box>
        <IconButton
          color="primary"
          onClick={() => {
            setFormType(item?.id);
            setModalType("MENUFORM");
          }}
          className={styles.editbutton}
        >
          <ModeEditIcon />
        </IconButton>
        <IconButton
          color="error"
          onClick={() => {
            deleteTemplate(item?.id);
          }}
          className={styles.deletebutton}
        >
          <DeleteIcon />
        </IconButton>
        <Box className={styles.sidebarbackground}>
          <Box className={styles.sidebar}>
            <div
              className={styles.menu}
              style={{
                background: item?.background,
              }}
            >
              <UdevsLogo fill={"#007AFF"} />
              <Search className={styles.searchicon} />
              {Sidebar.map((element) => (
                <div
                  className={styles.element}
                  style={{
                    background: element.active
                      ? item?.active_background
                      : item?.background,
                  }}
                >
                  <IconGenerator
                    icon={element.icon}
                    style={{
                      color: element.active ? item?.active_text : item.text,
                    }}
                  />
                </div>
              ))}
            </div>
            <div
              className={styles.submenu}
              style={{
                background: item?.background,
              }}
            >
              <div className={styles.submenuheader}>
                <p style={{ color: item?.text }}>Mobile apps</p>
                <LeftArrow fill={item?.text} />
              </div>
              <div className={styles.search}>
                <Search />
                <p>Search</p>
              </div>
              {sidebarElements.map((element) => (
                <div
                  className={styles.element}
                  style={{
                    background: element.active
                      ? item?.active_background
                      : item?.background,
                  }}
                >
                  <IconGenerator
                    icon={element.icon}
                    style={{
                      color: element.active ? item?.active_text : item.text,
                    }}
                  />
                  <p
                    style={{
                      color: element.active ? item?.active_text : item.text,
                    }}
                  >
                    {element.title}
                  </p>
                </div>
              ))}
            </div>
          </Box>
        </Box>
        <Box className={styles.sidebarfooter}>
          <h5 className={styles.colortext}>{item?.title || "No color"}</h5>
          <Box className={styles.colorblock}>
            {colors.map((item) => (
              <div
                className={styles.color}
                style={{ background: item.color }}
              ></div>
            ))}
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default ThemeCard;
