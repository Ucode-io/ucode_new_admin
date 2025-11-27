import { useMutation, useQuery } from "react-query";
import request from "../utils/request";
import requestAuth from "../utils/requestAuthV2";
import requestV2 from "../utils/requestV2";

const environmentService = {
  getList: (params) => requestAuth.get("/resource-environment", { params }),
  getVersionHistoryList: (envId, params) => requestV2.get(`/version/history/${envId}`, { params }),
  getVersionHistoryById: (envId, id, params) => requestV2.get(`/version/history/${envId}/${id}`, { params }),
  getEnvironments: (envId) => {
    return request.get(`/environment/${envId}`);
  },
  getEnvironmentList: (params) => {
    return request.get(`/environment`, {
      params,
    });
  },
  getByID: (params, envId) =>
    request.get(`/environment/${envId}`, {
      params,
    }),
  update: (data) =>
    request.put(`/environment`, data, {
      params: {
        "project-id": data.project_id,
      },
    }),
  create: (data) =>
    request.post(`/environment`, data, {
      params: {
        "project-id": data.project_id,
      },
    }),
  delete: (id) => request.delete(`/environment/${id}`),
};
export const useEnvironmentsListQuery = ({params ={}, queryParams} = {}) => {
  
  return useQuery(['ENVIRONMENTS', params], () => {
    return environmentService.getList(params)
  }, queryParams)
}

export const useEnvironmentListQuery = ({ params = {}, queryParams } = {}) => {
  return useQuery(
    ["ENVIRONMENT", params],
    () => {
      return environmentService.getEnvironmentList(params);
    },
    queryParams
  );
};

export const useVersionHistoryListQuery = ({ envId,params = {}, queryParams } = {}) => {
  return useQuery(
    ["VERSION_HISTORY", { envId, ...params }],
    () => {
      return environmentService.getVersionHistoryList(envId,params);
    },
    queryParams
  );
};

export const useVersionHistoryByIdQuery = ({ envId, id, params = {}, queryParams } = {}) => {
  return useQuery(
    ["VERSION_HISTORY_BY_ID", { envId, id, ...params }],
    () => {
      return environmentService.getVersionHistoryById(envId, id, params);
    },
    queryParams
  );
};

export const useEnvironmentGetByIdQuery = ({
  envId,
  params = {},
  queryParams,
}) => {
  return useQuery(
    ["ENVIRONMENT_GET_BY_ID", { ...params, envId }],
    () => {
      return environmentService.getByID(params, envId);
    },
    queryParams
  );
};

export const useEnvironmentUpdateMutation = (mutationSettings) => {
  return useMutation(
    (data) => environmentService.update(data),
    mutationSettings
  );
};

export const useEnvironmentCreateMutation = (mutationSettings) => {
  return useMutation(
    (data) => environmentService.create(data),
    mutationSettings
  );
};

export const useEnvironmentDeleteMutation = (mutationSettings) => {
  return useMutation((id) => environmentService.delete(id), mutationSettings);
};

export default environmentService;
