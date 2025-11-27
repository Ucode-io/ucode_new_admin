import {useMutation, useQuery} from "react-query";
import request from "../utils/request";
import requestWithoutProjectId from "../utils/requestWithoutProjectId";

const queryService = {
  getListFolder: (params, envId) =>
    requestWithoutProjectId.get("/v1/query-folder", {
      params,
    }),
  createFolder: (data) => request.post("/query-folder", data, {}),
  updateFolder: (data) => request.put("/query-folder", data, {}),
  deleteFolder: (id) => request.delete(`/query-folder/${id}`, {}),
  getListQuery: (params) =>
    request.get("/query-request", {
      params,
    }),
  updateQuery: (data) => request.put("/query-request", data, {}),
  createQuery: (data) =>
    request.post("/query-request", data, {
      params: {"project-id": data.project_id},
    }),
  getSingleQuery: ({id, params}) =>
    request.get(`/query-request/${id}`, {
      params,
    }),
  deleteQuery: (id) => request.delete(`/query-request/${id}`, {}),
  runQuery: (data) =>
    request.post("/query-request/run", data, {
      params: {"project-id": data.project_id},
    }),

  getHistory: ({queryId, projectId}) =>
    request.get(`/query-request/${queryId}/history`, {
      params: {"project-id": projectId},
    }),
  revertCommit: ({queryId, data}) =>
    request.post(`/query-request/${queryId}/revert`, data, {}),
  selectVersion: ({envId, queryId, data}) =>
    request.post(`/query-request/select-versions/${queryId}`, data, {}),
};

/* *********************************** FOLDERS *********************************** */

export const useQueryFoldersListQuery = ({
  params = {},
  envId,
  queryParams,
} = {}) => {
  return useQuery(
    ["QUERY_FOLDERS", {...params, envId}],
    () => {
      return queryService.getListFolder(params, envId);
    },
    queryParams
  );
};

export const useQueryFolderCreateMutation = (mutationSettings) => {
  return useMutation(
    (data) => queryService.createFolder(data),
    mutationSettings
  );
};

export const useQueryFolderUpdateMutation = (mutationSettings) => {
  return useMutation(
    (data) => queryService.updateFolder(data),
    mutationSettings
  );
};

export const useQueryFolderDeleteMutation = (mutationSettings) => {
  return useMutation((id) => queryService.deleteFolder(id), mutationSettings);
};

/* *********************************** QUERIES *********************************** */

export const useQueriesListQuery = ({params = {}, envId, queryParams} = {}) => {
  return useQuery(
    ["QUERIES", {...params, envId}],
    () => {
      return queryService.getList(params, envId);
    },
    queryParams
  );
};

export const useQueryByIdQuery = ({
  params = {},
  id,
  envId,
  queryParams,
} = {}) => {
  return useQuery(
    ["QUERY_BY_ID", {...params, id, envId}],
    () => {
      return queryService.getSingleQuery({id, params, envId});
    },
    queryParams
  );
};

export const useQueryUpdateMutation = (mutationSettings) => {
  return useMutation(
    (data) => queryService.updateQuery(data),
    mutationSettings
  );
};

export const useQueryCreateMutation = (mutationSettings) => {
  return useMutation(
    (data) => queryService.createQuery(data),
    mutationSettings
  );
};

export const useQueryDeleteMutation = (mutationSettings) => {
  return useMutation((id) => queryService.deleteQuery(id), mutationSettings);
};

export const useRunQueryMutation = (mutationSettings) => {
  return useMutation((data) => queryService.runQuery(data), mutationSettings);
};

/* *********************************** COMMIT AND VERSIONS *********************************** */

export const useQueryHistoryQuery = ({
  queryId,
  projectId,
  queryParams,
} = {}) => {
  return useQuery(
    ["QUERY_HISTORY", {queryId, projectId}],
    () => {
      return queryService.getHistory({queryId, projectId});
    },
    queryParams
  );
};

export const useQueryRevertCommitMutation = (mutationSettings) => {
  return useMutation(
    ({data, queryId}) => queryService.revertCommit({data, queryId}),
    mutationSettings
  );
};

export const useQueryVersionSelectMutation = (mutationSettings) => {
  return useMutation(
    ({data, queryId, envId}) =>
      queryService.selectVersion({data, queryId, envId}),
    mutationSettings
  );
};

export default queryService;
