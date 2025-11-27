import { useMutation, useQuery } from "react-query";
import request from "../utils/request";

const apiEndpoint = {
  getList: (params, headers) =>
    request.get("/api-reference", { params, headers }),
  getByID: ({ resourceId, fieldId, commitId, versionId }) =>
    request.get(`/api-reference/${fieldId}`, {
      headers: { "resource-id": resourceId },
      params: {
        commit_id: commitId,
        version_id: versionId,
      },
    }),
  update: (data) =>
    request.put(`/api-reference`, data, {
      headers: { "resource-id": data.resourceId },
    }),
  create: (data) =>
    request.post("/api-reference", data, {
      headers: { "resource-id": data.resourceId },
    }),
  delete: ({ id, resourceId, projectId }) =>
    request.delete(`/api-reference/${projectId}/${id}`, {
      headers: { "resource-id": resourceId },
    }),
  getHistory: ({ endpointId, projectId }) =>
    request.get(`/api-reference/history/${projectId}/${endpointId}`, {}),
  revertCommit: ({ id, data, projectId }) =>
    request.post(`/api-reference/revert/${id}`, data, {}),
  selectVersion: ({ endpointId, data, projectId }) =>
    request.post(`/api-reference/select-versions/${endpointId}`, data, {}),
};

export const useApiEndpointListQuery = ({
  params = {},
  headers = {},
  queryParams,
} = {}) => {
  return useQuery(
    ["API_ENDPOINT", { ...params, ...headers }],
    () => {
      return apiEndpoint.getList(params, headers);
    },
    queryParams
  );
};

export const useApiEndpointGetByIdQuery = ({
  fieldId,
  envId,
  commitId,
  queryParams,
  versionId,
  projectId,
}) => {
  return useQuery(
    [
      "API_ENDPOINT_GET_BY_ID",
      { fieldId, envId, commitId, versionId, projectId },
    ],
    () => {
      return apiEndpoint.getByID({
        fieldId,
        envId,
        commitId,
        versionId,
        projectId,
      });
    },
    queryParams
  );
};

export const useApiEndpointUpdateMutation = (mutationSettings) => {
  return useMutation((data) => apiEndpoint.update(data), mutationSettings);
};

export const useApiEndpointCreateMutation = (mutationSettings) => {
  return useMutation((data) => apiEndpoint.create(data), mutationSettings);
};

export const useApiEndpointDeleteMutation = (mutationSettings) => {
  return useMutation(
    ({ id, resourceId, envId, projectId }) =>
      apiEndpoint.delete({ id, resourceId, envId, projectId }),
    mutationSettings
  );
};

export const useApiEndpointHistoryQuery = ({
  endpointId,
  projectId,
  envId,
  queryParams,
} = {}) => {
  return useQuery(
    ["API_ENDPOINTS_HISTORY", { endpointId, projectId, envId }],
    () => {
      return apiEndpoint.getHistory({ endpointId, projectId, envId });
    },
    queryParams
  );
};

export const useApiEndpointRevertCommitMutation = (mutationSettings) => {
  return useMutation(
    ({ data, id, envId, projectId }) =>
      apiEndpoint.revertCommit({ data, id, envId, projectId }),
    mutationSettings
  );
};

export const useApiEndpointVersionSelectMutation = (mutationSettings) => {
  return useMutation(
    ({ data, endpointId, envId, projectId }) =>
      apiEndpoint.selectVersion({ data, endpointId, envId, projectId }),
    mutationSettings
  );
};

export default apiEndpoint;
