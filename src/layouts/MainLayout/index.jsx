import {useEffect} from "react";
import {Outlet, useParams} from "react-router-dom";
import styles from "./style.module.scss";
import Favicon from "react-favicon";
import LayoutSidebar from "../../components/LayoutSidebar";
import {useProjectGetByIdQuery} from "../../services/projectService";
import {store} from "../../store";
import {isOnlineReducerAction} from "../../store/isOnline/isOnline.slice";
import {useDispatch, useSelector} from "react-redux";
import {Box} from "@mui/material";

const MainLayout = ({setFavicon, favicon}) => {
  const isOnline = useSelector((store) => store.isOnline.isOnline);
  const {appId} = useParams();
  const projectId = store.getState().company.projectId;
  const dispatch = useDispatch();

  const {data: projectInfo} = useProjectGetByIdQuery({projectId});

  useEffect(() => {
    setFavicon(projectInfo?.logo);
    document.title = projectInfo?.title;
  }, [projectInfo]);

  useEffect(() => {
    const handleOnline = () => {
      console.log("GGGG ONLINE");
      dispatch(isOnlineReducerAction.setisOnline(true));
    };
    const handleOffline = () => {
      console.log("GGGG OFFLINE");
      dispatch(isOnlineReducerAction.setisOnline(false));
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <>
      {" "}
      <div className={styles.layout}>
        {favicon && <Favicon url={favicon} />}
        <LayoutSidebar appId={appId} />
        <div className={styles.content}>
          <Outlet />
        </div>
      </div>
      {/* {!isOnline && (
        <Box
          sx={{
            position: "fixed",
            background: "red",
            width: "100%",
            top: 0,
            height: "40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: "0.9",
            color: "#fff",
            fontSize: "16px",
          }}>
          No Internet Connection!
        </Box>
      )} */}
    </>
  );
};

export default MainLayout;
