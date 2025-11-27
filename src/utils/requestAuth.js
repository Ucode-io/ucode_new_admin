import axios from "axios";
import {store} from "../store/index";
import {showAlert} from "../store/alert/alert.thunk";
export const baseURL = import.meta.env.VITE_AUTH_BASE_URL;

const requestAuth = axios.create({
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
  }
  // isOnline?.isOnline &&
  else store.dispatch(showAlert("No connection to the server, try again"));

  return Promise.reject(error.response);
};

requestAuth.interceptors.request.use(
  (config) => {
    const authStore = store.getState().auth;
    const token = authStore.token;
    const resourceId = authStore.resourceId;
    const companyStore = store.getState().company;
    const environmentId = companyStore.environmentId;
    const projectId = companyStore.projectId;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      config.headers["environment-id"] = environmentId;
      config.headers["resource-id"] = resourceId;
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

requestAuth.interceptors.response.use(
  (response) => response.data.data,
  errorHandler
);

export default requestAuth;
