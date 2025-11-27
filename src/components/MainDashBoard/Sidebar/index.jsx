import React from "react";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import {useNavigate} from "react-router-dom";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import BarChartIcon from "@mui/icons-material/BarChart";
import LayersIcon from "@mui/icons-material/Layers";

const NAV_ITEMS = [
  {title: "Dashboard", icon: <DashboardIcon />, path: "/dashboard"},
  {title: "Orders", icon: <ShoppingCartIcon />, path: "/orders"},
  {title: "Reports", icon: <BarChartIcon />, path: "/reports"},
  {title: "Integrations", icon: <LayersIcon />, path: "/integrations"},
];

function Sidebar() {
  const navigate = useNavigate();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: 240,
          boxSizing: "border-box",
          background: "#181818",
          color: "#fff",
        },
      }}>
      <List>
        {NAV_ITEMS.map((item) => (
          <ListItem button key={item.title} onClick={() => navigate(item.path)}>
            <ListItemIcon sx={{color: "#fff"}}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.title} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
}

export default Sidebar;
