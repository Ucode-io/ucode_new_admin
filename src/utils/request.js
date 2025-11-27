import axios from "axios";
import {store} from "../store/index";
import {showAlert} from "../store/alert/alert.thunk";
import authService from "../services/auth/authService";
import {authActions} from "../store/auth/auth.slice";
export const baseURL = `${import.meta.env.VITE_BASE_URL}/v1`;

const request = axios.create({
  baseURL,
  timeout: 100000,
});

// const errorHandler = (error, hooks) => {

//   if(error.response?.data?.data) store.dispatch(showAlert(error.response.data.data))
//   else store.dispatch(showAlert('No connection to the server, try again'))

//   return Promise.reject(error.response)
// }

const errorHandler = (error, hooks) => {
  // const token = store.getState().auth.token;
  // const logoutParams = {
  //   access_token: token,
  // };

  const isOnline = store.getState().isOnline;

  if (
    error?.response?.status === 401 &&
    error?.response?.data?.data ===
      "rpc error: code = Unavailable desc = User not access environment"
  ) {
    store.dispatch(authActions.logout());
  } else if (error?.response?.status === 401) {
    const refreshToken = store.getState().auth.refreshToken;

    const params = {
      refresh_token: refreshToken,
    };

    const originalRequest = error.config;

    return authService
      .refreshToken(params)
      .then((res) => {
        store.dispatch(authActions.setTokens(res));
        store.dispatch(authActions.setPermission(res));
        return request(originalRequest);
      })
      .catch((err) => {
        console.log(err);
        store.dispatch(authActions.logout());
        return Promise.reject(error);
      });
  } else {
    if (error?.response) {
      if (error.response?.data?.data) {
        if (
          error.response.data.data !==
          "rpc error: code = Internal desc = member group is required to add new member"
        ) {
          // isOnline?.isOnline &&
          store.dispatch(showAlert(error.response.data.data));
        }
      }
      if (error?.response?.status === 403) {
        // store.dispatch(authActions.logout());
        // store.dispatch(logoutAction(logoutParams)).unwrap().catch()
      }
    }
    // isOnline?.isOnline &&
    else store.dispatch(showAlert("No connection to the server, try again"));

    return Promise.reject(error.response);
  }
};

const customMessageHandler = (res) => {
  if (res.data.custom_message?.length && res.status < 400) {
    store.dispatch(showAlert(res.data.custom_message, "success"));
  } else if (res.data.custom_message?.length) {
    store.dispatch(showAlert(res.data.custom_message, "error"));
  }
};

request.interceptors.request.use(
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

request.interceptors.response.use((response) => {
  customMessageHandler(response);
  return response.data.data;
}, errorHandler);

export default request;
