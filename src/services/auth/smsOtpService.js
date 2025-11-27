import { useSelector } from "react-redux";

import { store } from "../../store";
import requestAuth from "../../utils/requestAuth";

const authStore = store.getState().auth;

const smsOtpService = {
  getList: (params) => requestAuth.get(`/v2/sms-otp-settings`, { params }),
  getById: (id) => requestAuth.get(`/v2/sms-otp-settings/${id}`),
  create: (data, params) =>
    requestAuth.post(`/v2/sms-otp-settings`, data, {
      params,
      headers: { "environment-id": authStore.environmentId },
    }),
  update: (data, params) =>
    requestAuth.put(`/v2/sms-otp-settings`, data, {
      params,
      headers: { "environment-id": authStore.environmentId },
    }),
  delete: (params, id) =>
    requestAuth.delete(`/v2/sms-otp-settings/${id}`, {
      params,
      headers: { "environment-id": authStore.environmentId },
    }),
};

export default smsOtpService;
