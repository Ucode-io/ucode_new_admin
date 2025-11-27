import {useMutation, useQuery} from "react-query";
import request from "../utils/request";
import requestV2 from "../utils/requestV2";

const resourceService = {
  getList: (params) => request.get(`/company/project/resource`, {params}),
  getListClickHouse: (data) => request.post(`/company/airbyte`, data),
  getListV2: (params) => requestV2.get(`/company/project/resource`, {params}),
  getVariableResources: (id) =>
    request.get(`/company/project/resource-variable/${id}`),
  getByID: (id, params) =>
    request.get(`/company/project/resource/${id}`, {params}),
  getByIDV2: (id, params) =>
    requestV2.get(`/company/project/resource/${id}`, {params}),

  getClickHouseByID: (id, params) =>
    request.get(`/company/airbyte/${id}`, {params}),

  getByIDV1: (id, params) =>
    request.get(`/company/project/resource/${id}`, {params}),
  create: (data) => request.post(`/company/project/resource`, data),
  createResource: (data) =>
    request.post(`/company/project/create-resource`, data),
  createV2: (data) => requestV2.post(`/company/project/resource`, data),
  update: (data) => request.put(`/company/project/resource/${data.id}`, data),
  updateV2: (data) =>
    requestV2.put(`/company/project/resource`, data, {
      params: {type: data.type},
    }),
  createFromCluster: (data) =>
    request.post("/company/project/create-resource", data),
  getResourceEnvironment: (id) =>
    request.get(`v1/company/project/resource-environment/${id}`),
  configureResource: (data) =>
    request.post("/v1/company/project/configure-resource", data),
  delete: (data) => request.delete(`/company/project/resource`, {data}),
  deleteV2: ({id}) => requestV2.delete(`/company/project/resource/${id}`),
  reconnect: ({data, projectId}) => {
    return request.post(`v1/company/project/resource/reconnect`, data, {
      params: {"project-id": projectId},
    });
  },
};

export const useResourceListQuery = ({params = {}, queryParams} = {}) => {
  return useQuery(
    ["RESOURCES", params],
    () => {
      return resourceService.getList(params);
    },
    queryParams
  );
};

export const useResourceListQueryV2 = ({params = {}, queryParams} = {}) => {
  return useQuery(
    ["RESOURCESV2", params],
    () => {
      return resourceService.getListV2(params);
    },
    queryParams
  );
};

export const useVariableResourceListQuery = ({id, queryParams} = {}) => {
  return useQuery(
    ["RESOURCES_VARIABLE", id],
    () => {
      return resourceService.getVariableResources(id);
    },
    queryParams
  );
};

export const useResourceGetByIdQuery = ({
  id,
  params = {},
  queryParams,
} = {}) => {
  return useQuery(
    ["RESOURCE_BY_ID", {id, ...params}],
    () => {
      return resourceService.getByID(id, params);
    },
    queryParams
  );
};

export const useResourceGetByIdQueryV2 = ({
  id,
  params = {},
  queryParams,
} = {}) => {
  return useQuery(
    ["RESOURCE_BY_ID", {id, ...params}],
    () => {
      return resourceService.getByIDV2(id, params);
    },
    queryParams
  );
};

export const useResourceGetByIdClickHouse = ({
  id,
  params = {},
  queryParams,
} = {}) => {
  return useQuery(
    ["CLICK_HOUSE", {id, ...params}],
    () => {
      return resourceService.getClickHouseByID(id, params);
    },
    queryParams
  );
};

export const useResourceGetByIdQueryV1 = ({
  id,
  params = {},
  queryParams,
} = {}) => {
  return useQuery(
    ["RESOURCE_BY_ID", {id, ...params}],
    () => {
      return resourceService.getByIDV1(id, params);
    },
    queryParams
  );
};

export const useResourceCreateFromClusterMutation = (mutationSettings) => {
  return useMutation(
    (data) => resourceService.createFromCluster(data),
    mutationSettings
  );
};

export const useResourceReconnectMutation = ({projectId, mutationSettings}) => {
  return useMutation(
    (data) => resourceService.reconnect({data, projectId}),
    mutationSettings
  );
};

export const useResourceEnvironmentGetByIdQuery = ({id, queryParams} = {}) => {
  return useQuery(
    ["RESOURCE_ENVIRONMENT_BY_ID", id],
    () => {
      return resourceService.getResourceEnvironment(id);
    },
    queryParams
  );
};

export const useResourceDeleteMutation = (mutationSettings) => {
  return useMutation((data) => resourceService.delete(data), mutationSettings);
};

export const useResourceDeleteMutationV2 = (mutationSettings) => {
  return useMutation(
    ({id}) => resourceService.deleteV2({id}),
    mutationSettings
  );
};

export const useResourceCreateMutation = (mutationSettings) => {
  return useMutation((data) => resourceService.create(data), mutationSettings);
};

export const useResourceCreateMutationV2 = (mutationSettings) => {
  return useMutation(
    (data) => resourceService.createV2(data),
    mutationSettings
  );
};

export const useCreateResourceMutationV1 = (mutationSettings) => {
  return useMutation(
    (data) => resourceService.createResource(data),
    mutationSettings
  );
};

export const useResourceUpdateMutation = (mutationSettings) => {
  return useMutation((data) => resourceService.update(data), mutationSettings);
};

export const useResourceUpdateMutationV2 = (mutationSettings) => {
  return useMutation(
    (data) => resourceService.updateV2(data),
    mutationSettings
  );
};

export const useResourceConfigureMutation = (mutationSettings) => {
  return useMutation(
    (data) => resourceService.configureResource(data),
    mutationSettings
  );
};

export default resourceService;
