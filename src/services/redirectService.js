import { useMutation, useQuery } from "react-query";
import request from "../utils/request";

const redirectService = {
  getList: (params) => request.get("/redirect-url", { params }),
  getByID: (params, redirectId) =>
    request.get(`/redirect-url/${redirectId}`, {
      params,
    }),
  update: (data) =>
    request.put(`/redirect-url`, data, {
      params: {
        "project-id": data.project_id,
      },
    }),
  updateReorder: (data) =>
    request.put(`/redirect-url/re-order`, data),
    
  create: (data) =>
    request.post(`/redirect-url`, data, {
      params: {
        "project-id": data.project_id,
      },
    }),
  delete: (id) => request.delete(`/redirect-url/${id}`),
};

export const useRedirectListQuery = ({ params = {}, queryParams } = {}) => {
  return useQuery(
    ["REDIRECT", params],
    () => {
      return redirectService.getList(params);
    },
    queryParams
  );
};

export const useRedirectGetByIdQuery = ({
  redirectId,
  params = {},
  queryParams,
}) => {
  return useQuery(
    ["REDIRECT_GET_BY_ID", { ...params, redirectId }],
    () => {
      return redirectService.getByID(params, redirectId);
    },
    queryParams
  );
};

export const useRedirectUpdateMutation = (mutationSettings) => {
  return useMutation((data) => redirectService.update(data), mutationSettings);
};
export const useRedirectUpdateReorderMutation = (mutationSettings) => {
  return useMutation((data) => redirectService.updateReorder(data), mutationSettings);
};

export const useRedirectCreateMutation = (mutationSettings) => {
  return useMutation((data) => redirectService.create(data), mutationSettings);
};

export const useRedirectDeleteMutation = (mutationSettings) => {
  return useMutation((id) => redirectService.delete(id), mutationSettings);
};

export default redirectService;
