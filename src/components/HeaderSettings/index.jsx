import { useNavigate } from "react-router-dom";
import BackButton from "../BackButton";
import IconGenerator from "../IconPicker/IconGenerator";
import ProfilePanel from "../ProfilePanel";
import styles from "./style.module.scss";
import { Tooltip } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import RectangleIconButton from "../Buttons/RectangleIconButton";
import NewProfilePanel from "../ProfilePanel/NewProfileMenu";
const HeaderSettings = ({
  title = "",
  subtitle,
  extra,
  children,
  loader,
  backButtonLink,
  icon,
  sticky,
  disabledMenu = true,
  line = true,
  extraButtons,
  ...props
}) => {
  const navigate = useNavigate();

  return (
    <div
      className={`${styles.header} ${sticky ? styles.sticky : ""}`}
      {...props}
    >
      <div className={styles.leftSide}>
        {backButtonLink && (
          <BackButton
            style={{
              marginRight: "8px",
            }}
            onClick={() => navigate(backButtonLink)}
          />
        )}

        {icon && <IconGenerator className={styles.icon} icon={icon} />}

        <div className={styles.titleBlock}>
          {title && <div className={styles.title}>{title}</div>}
          {subtitle && <div className={styles.subtitle}>{subtitle}</div>}
        </div>

        {line && <div className={styles.line} />}

        <div>{children}</div>
      </div>

      {extraButtons && <div className={styles.rightSide}>{extraButtons}</div>}

      {/* {disabledMenu && (
        <div className={styles.rightSide}>
          <Tooltip title="Menu">
            <RectangleIconButton
              color="primary"
              className={`${styles.addButton}`}
              onClick={() =>
                navigate("/main/c57eedc3-a954-4262-a0af-376c65b5a284")
              }
            >
              <MenuIcon />
            </RectangleIconButton>
          </Tooltip>
          <AppSelector />
          <NewProfilePanel />
        </div>
      )} */}
    </div>
  );
};

export default HeaderSettings;
