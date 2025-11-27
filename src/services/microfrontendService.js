import {useMutation, useQuery} from "react-query";
import httpsRequest from "../utils/httpsRequest";

const microfrontendService = {
  getList: (params) =>
    httpsRequest.get("/v2/functions/micro-frontend", { params }),
  getById: (id, params) =>
    httpsRequest.get(`/v2/functions/micro-frontend/${id}`, { params }),
  create: (data) => httpsRequest.post("/v2/functions/micro-frontend", data),
  update: (data) => httpsRequest.put("/v2/functions/micro-frontend", data),
  delete: (id) => httpsRequest.delete(`/v2/functions/micro-frontend/${id}`),
  createWebhook: (data) => httpsRequest.post('/v2/webhook/create', data)
};

export const useMicrofrontendListQuery = ({
  params = {},
  queryParams,
} = {}) => {
  return useQuery(
    ["MENU_TEMPLATE", params],
    () => {
      return microfrontendService.getList(params);
    },
    queryParams
  );
};

export const useMicrofrontendCreateWebhookMutation = (mutationSettings) => {
  return useMutation(
    (data) =>
      microfrontendService.createWebhook(data),
    mutationSettings
  );
}

export default microfrontendService;
