import {
  AppBar,
  Container,
  Divider,
  Drawer,
  IconButton,
  Link,
  List,
  Toolbar,
  Typography,
  Box,
  Menu,
} from "@mui/material";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import React, {useState} from "react";
import {Outlet, useLocation} from "react-router-dom";
import {MainListItems} from "./ListItems";
import {useStyles} from "./useStyles";
import {useDispatch} from "react-redux";
import {authActions} from "../../store/auth/auth.slice";

export function MainDashBoard() {
  const classes = useStyles();
  return (
    <Container sx={classes.footer}>
      <Typography variant="body2" color="textSecondary" align="center">
        {"Copyright © "}
        <Link color="inherit" href="https://material-ui.com/">
          Your Website
        </Link>{" "}
        {new Date().getFullYear()}
        {"."}
      </Typography>
    </Container>
  );
}

export default function Dashboard() {
  const classes = useStyles();
  const location = useLocation();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(true);
  const path = location?.pathname?.split("/")?.[2];
  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);

  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <div style={classes.root}>
      <AppBar
        position="absolute"
        sx={{
          ...classes.appBar,
          ...(open && classes.appBarShift),
        }}>
        <Toolbar sx={classes.toolbar}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            sx={{
              ...classes.menuButton,
              ...(open && classes.menuButtonHidden),
            }}>
            <MenuIcon />
          </IconButton>
          <Typography
            component="h1"
            variant="h6"
            color="inherit"
            noWrap
            sx={classes.title}>
            {path}
          </Typography>
          <IconButton
            onClick={handleClick}
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              padding: "8px",
              transition: "all 0.3s ease",
            }}
            color="inherit">
            <AccountCircleIcon style={{fontSize: "28px"}} />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        PaperProps={{
          sx: {
            ...classes.drawerPaper,
            ...(!open && classes.drawerPaperClose),
          },
        }}
        open={open}>
        <div style={classes.toolbarIcon}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}>
            <Box
              sx={{
                width: "46px",
                height: "50px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#2563eb",
                borderRadius: "50%",
              }}>
              <Box>
                <p
                  style={{
                    color: "#fff",
                    fontSize: "24px",
                    fontWeight: 700,
                    fontFamily: "Arial, sans-serif",
                    borderBottom: "4px solid #fff",
                  }}>
                  U
                </p>
              </Box>
            </Box>
          </Box>
          <IconButton
            onClick={handleDrawerClose}
            style={{color: "rgba(255, 255, 255, 0.9)"}}>
            <KeyboardDoubleArrowLeftIcon />
          </IconButton>
        </div>
        <Divider style={{backgroundColor: "rgba(255, 255, 255, 0.1)"}} />
        <List>{<MainListItems open={open} />}</List>
      </Drawer>
      <main style={classes.content}>
        <Outlet />
      </main>

      <Menu
        anchorEl={anchorEl}
        open={openMenu}
        onClose={handleClose}
        PaperProps={{
          elevation: 3,
          sx: {
            minWidth: "180px",
            borderRadius: "8px",
            marginTop: "8px",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
          },
        }}
        transformOrigin={{horizontal: "right", vertical: "top"}}
        anchorOrigin={{horizontal: "right", vertical: "bottom"}}>
        <Box
          onClick={() => dispatch(authActions.logout())}
          sx={{
            padding: "12px 20px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            cursor: "pointer",
            transition: "all 0.2s ease",
            "&:hover": {
              backgroundColor: "#f5f5f5",
            },
          }}>
          <LogoutIcon style={{fontSize: "20px", color: "#f44336"}} />
          <Typography style={{fontWeight: 500, fontSize: "14px"}}>
            Logout
          </Typography>
        </Box>
      </Menu>
    </div>
  );
}
