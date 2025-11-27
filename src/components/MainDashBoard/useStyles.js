const drawerWidth = 260;

export const useStyles = () => ({
  root: {
    display: "flex",
  },
  toolbar: {
    paddingRight: 24,
    paddingLeft: 24,
  },
  toolbarIcon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 20px",
    height: "64px",
    background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
    borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
  },
  appBar: {
    zIndex: 1201,
    background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
    boxShadow: "0 2px 12px rgba(0, 0, 0, 0.1)",
    transition:
      "width 195ms cubic-bezier(0.4, 0, 0.6, 1), margin 195ms cubic-bezier(0.4, 0, 0.6, 1)",
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition:
      "width 225ms cubic-bezier(0.4, 0, 0.6, 1), margin 225ms cubic-bezier(0.4, 0, 0.6, 1)",
  },
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: "none",
  },
  title: {
    flexGrow: 1,
    textTransform: "capitalize",
    fontWeight: 600,
    letterSpacing: "0.5px",
  },
  drawerPaper: {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    background: "#ffffff",
    boxShadow: "2px 0 8px rgba(0, 0, 0, 0.05)",
    transition: "width 225ms cubic-bezier(0.4, 0, 0.6, 1)",
    borderRight: "1px solid #e0e0e0",
  },
  drawerPaperClose: {
    overflowX: "hidden",
    transition: "width 195ms cubic-bezier(0.4, 0, 0.6, 1)",
    width: 56,
    "@media (min-width: 600px)": {
      width: 72,
    },
  },
  appBarSpacer: {
    minHeight: 64,
  },
  content: {
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
    height: "100vh",
    overflow: "auto",
    backgroundColor: "#ffffff",
  },
  container: {
    paddingTop: 32,
    paddingBottom: 32,
  },
  paper: {
    padding: 16,
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
  },
  fixedHeight: {
    height: 240,
  },
  footer: {
    padding: 16,
    marginTop: "auto",
    backgroundColor: "white",
    alignSelf: "flex-end",
  },
});
