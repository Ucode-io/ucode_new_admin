import React, {useEffect} from "react";
import {useDispatch} from "react-redux";
import {store} from "../../store";
import {useProjectGetByIdQuery} from "../../services/projectService";
import {isOnlineReducerAction} from "../../store/isOnline/isOnline.slice";
import MainDashBoard from "../../components/MainDashBoard";

function MainLayout({setFavicon = () => {}, favicon}) {
  const projectId = store.getState().company.projectId;
  const dispatch = useDispatch();

  const {data: projectInfo} = useProjectGetByIdQuery({projectId});

  useEffect(() => {
    setFavicon(projectInfo?.logo);
    document.title = projectInfo?.title;
  }, [projectInfo]);

  useEffect(() => {
    const handleOnline = () => {
      dispatch(isOnlineReducerAction.setisOnline(true));
    };
    const handleOffline = () => {
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
    <div>
      <MainDashBoard />
    </div>
  );
}

export default MainLayout;
