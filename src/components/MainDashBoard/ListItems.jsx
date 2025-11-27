import React from "react";
import {ListItem, ListItemIcon, ListItemText} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import SettingsIcon from "@mui/icons-material/Settings";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import {useLocation, useNavigate} from "react-router-dom";

const useStyles = () => ({
  menuItem: {
    margin: "2px 8px",
    borderRadius: "8px",
    padding: "10px 12px",
    transition: "all 0.3s ease",
    "&:hover": {
      backgroundColor: "#f5f7fa !important",
      transform: "translateX(2px)",
    },
  },
  activeMenuItem: {
    margin: "2px 8px",
    borderRadius: "8px",
    padding: "10px 12px",
    backgroundColor: "#e3f2fd !important",
    borderLeft: "3px solid #1e88e5",
    transition: "all 0.3s ease",
    "&:hover": {
      backgroundColor: "#bbdefb !important",
      transform: "translateX(2px)",
    },
  },
  menuIcon: {
    minWidth: "36px",
  },
  menuText: {
    "& span": {
      fontWeight: 500,
      fontSize: "14px",
      letterSpacing: "0.3px",
    },
  },
});

export const MainListItems = ({open}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const classes = useStyles();

  const activeVal = (val) => {
    if (location.pathname?.includes(val)) return true;
    else return false;
  };

  const menuItems = [
    {
      label: "Dashboard",
      icon: DashboardIcon,
      path: "/main/dashboard",
      activeKey: "dashboard",
    },
    {
      label: "Company",
      icon: SettingsIcon,
      path: "/main/company",
      activeKey: "company",
    },
    {
      label: "Fares",
      icon: AttachMoneyIcon,
      path: "/main/fares",
      activeKey: "fares",
    },
    {
      label: "Transactions",
      icon: AccountBalanceIcon,
      path: "/main/transactions",
      activeKey: "transactions",
    },
  ];

  return (
    <div style={{padding: "4px 0"}}>
      {menuItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeVal(item.activeKey);

        return (
          <ListItem
            key={item.activeKey}
            button
            onClick={() => navigate(item.path)}
            sx={{
              ...(isActive ? classes.activeMenuItem : classes.menuItem),
              color: isActive ? "#1565c0" : "#616161",
              justifyContent: open ? "initial" : "center",
            }}>
            <ListItemIcon
              sx={{
                ...classes.menuIcon,
                minWidth: open ? "36px" : "auto",
                justifyContent: "center",
              }}>
              <Icon
                style={{
                  color: isActive ? "#1e88e5" : "#757575",
                  fontSize: "20px",
                }}
              />
            </ListItemIcon>
            {open && (
              <ListItemText primary={item.label} sx={classes.menuText} />
            )}
          </ListItem>
        );
      })}
    </div>
  );
};
