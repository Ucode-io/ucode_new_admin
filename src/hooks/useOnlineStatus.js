import {useState, useEffect} from "react";
import {useDispatch} from "react-redux";
import {isOnlineReducerAction} from "../store/isOnline/isOnline.slice";

export function useOnlineStatus() {
  const dispatch = useDispatch();

  useEffect(() => {
    const handleOnline = () =>
      dispatch(isOnlineReducerAction.setisOnline(true));
    const handleOffline = () =>
      dispatch(isOnlineReducerAction.setisOnline(false));

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [navigator.onLine]);
}
