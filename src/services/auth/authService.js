import {store} from "../../store";
import authRequestV2 from "../../utils/authRequest";
import request from "../../utils/request";
import requestAuth from "../../utils/requestAuth";
import requestAuthV2 from "../../utils/requestAuthV2";

const authStore = store.getState().auth;

const authService = {
  login: (data) =>
    requestAuthV2.post(`/login`, data, {
      headers: {"environment-id": data.environment_id},
    }),
  sendFcmToken: (data) =>
    request.post(`/notification/user-fcmtoken`, data, {
      headers: {"environment-id": data.environment_id},
    }),
  multiCompanyLogin: (data) => requestAuthV2.post("/multi-company/login", data),
  register: (data) => requestAuth.post("/company", data),
  sendResetMessageToEmail: (data) =>
    requestAuth.post(`/user/send-message`, data),
  resetPassword: (data) => requestAuth.put(`/v1/user/reset-password`, data),
  resetUserPasswordV2: (data) =>
    requestAuth.put(`/v2/user/reset-password`, data),
  refreshToken: (data) => requestAuthV2.put(`/refresh`, data),
  updateToken: (data, params) =>
    authRequestV2.put(`/refresh`, data, {params: {for_env: params?.for_env}}),
  sendCode: (data) => requestAuth.post(`/send-code`, data),
  verifyCode: (sms_id, otp, data) =>
    requestAuth.post(`/verify/${sms_id}/${otp}`, data),
  sendMessage: (data) => requestAuth.post(`/send-message`, data),
  verifyEmail: (sms_id, otp, data) =>
    requestAuth.post(`/verify-email/${sms_id}/${otp}`, data),
  verifyOnlyEmail: (data) => requestAuth.post(`/v2/verify-only-email`, data),
  forgotPassword: (login) => requestAuth.post(`/v2/forgot-password`, login),
  setEmail: (data) => requestAuth.put(`/v2/set-email/send-code`, data),
  getUserById: (user_id, params) =>
    requestAuthV2.get(`user/${user_id}`, {
      params,
      headers: {"environment-id": authStore.environmentId},
    }),
  resetPasswordProfile: (data) => requestAuthV2.put("/reset-password", data),
  sendCodeApp: (data) => requestAuthV2.post(`/send-code-app`, data),
};

export default authService;
