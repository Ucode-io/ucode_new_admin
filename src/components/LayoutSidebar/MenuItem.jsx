import { MenuItem } from "@mui/material";
import "./style.scss";

const MenuItemComponent = ({ title, onClick, icon }) => {
  return (
    <MenuItem onClick={onClick}>
      {icon}
      <h3>{title}</h3>
    </MenuItem>
  );
};

export default MenuItemComponent;
