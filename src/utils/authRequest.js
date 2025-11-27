import axios from "axios";
import {store} from "../store/index";
import {showAlert} from "../store/alert/alert.thunk";
export const baseURL = import.meta.env.VITE_AUTH_BASE_URL_V2;

const authRequestV2 = axios.create({
  baseURL,
  timeout: 100000,
});

const errorHandler = (error, hooks) => {
  const isOnline = store.getState().isOnline;
  if (error?.response) {
    if (error.response?.data?.data) {
      isOnline?.isOnline &&
        store.dispatch(
          showAlert(
            error.response.data.data?.replace(
              "rpc error: code = InvalidArgument desc = ",
              ""
            )
          )
        );
    }

    if (error?.response?.status === 403) {
    } else if (error?.response?.status === 401) {
      // store.dispatch(logout())
    }
  } else isOnline?.isOnline && store.dispatch(showAlert("No connection to the server, try again"));

  return Promise.reject(error.response);
};

authRequestV2.interceptors.request.use(
  (config) => {
    const authStore = store.getState().auth;
    const token = authStore.token;
    const projectId = authStore.projectId;
    const environmentId = authStore.environmentId;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      config.headers["environment-id"] = environmentId;
    }
    if (!config.params?.["project-id"]) {
      if (config.params) {
        config.params["project-id"] = projectId;
      } else {
        config.params = {
          "project-id": projectId,
        };
      }
    }

    return config;
  },

  (error) => errorHandler(error)
);

authRequestV2.interceptors.response.use(
  (response) => response.data.data,
  errorHandler
);

export default authRequestV2;
