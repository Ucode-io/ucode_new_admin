import { Button } from "@mui/material";
import "./style.scss";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

const MenuButtonComponent = ({
  onClick,
  title,
  icon,
  children,
  sidebarIsOpen,
  style,
  arrow = false,
}) => {
  return (
    <Button
      className="menu-button active-with-child"
      onClick={onClick}
      style={style}
    >
      {arrow && <KeyboardArrowRightIcon />}
      {children}
      <div className={sidebarIsOpen ? `open-label` : "label"} style={style}>
        {icon}
        {sidebarIsOpen && title}
      </div>
    </Button>
  );
};

export default MenuButtonComponent;
