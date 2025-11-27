import { useMutation, useQuery } from "react-query";
import request from "../utils/request";
import requestV2 from "../utils/requestV2";

const tableService = {
  getList: (params) => requestV2.get("/collections", {params : {...params}}),
  getByID: ({ tableSlug }) => requestV2.get(`/collections/${tableSlug}`),
  update: (data) => requestV2.put(`/collections`, data),
  create: (data) => requestV2.post("/collections", data),
  delete: ({ tableSlug }) => requestV2.delete(`/collections/${tableSlug}`),
  configure: ({ data }) => request.post(`/fields-relations`, data),
  getHistory: ({ tableId }) => request.get(`/table-history/list/${tableId}`, {}),
  getHistoryById: ({ historyId }) => request.get(`/table-history/${historyId}`, {}),
  revertCommit: ({ data }) => request.put(`/table-history/revert`, data, {}),
  postVersion: ({ data }) => request.put(`/table-history`, data, {}),
};

export const useTablesListQuery = ({ params = {}, queryParams } = {}) => {
  return useQuery(
    ["TABLES", params],
    () => {
      return tableService.getList(params);
    },
    queryParams
  );
};

export const useTableGetByIdQuery = ({ tableId, resourceId, envId, projectId, queryParams }) => {
  return useQuery(
    ["TABLE_GET_BY_ID", { tableId, resourceId, envId, projectId }],
    () => {
      return tableService.getByID({ tableId, resourceId, envId, projectId });
    },
    queryParams
  );
};

export const useTableUpdateMutation = (mutationSettings) => {
  return useMutation((data) => tableService.update(data), mutationSettings);
};

export const useTableCreateMutation = (mutationSettings) => {
  return useMutation((data) => tableService.create(data), mutationSettings);
};

export const useTableDeleteMutation = (mutationSettings) => {
  return useMutation(({ id, resourceId, envId }) => tableService.delete({ id, resourceId, envId }), mutationSettings);
};

export const useTableHistoryQuery = ({ tableId, projectId, envId, queryParams } = {}) => {
  return useQuery(
    ["TABLE_HISTORY", { tableId, projectId, envId }],
    () => {
      return tableService.getHistory({ tableId, projectId, envId });
    },
    queryParams
  );
};
export const useHistoryGetByIdQuery = ({ historyId, envId, projectId, queryParams }) => {
  return useQuery(
    ["HISTORY_GET_BY_ID", { historyId, envId, projectId }],
    () => {
      return tableService.getHistoryById({ historyId, envId, projectId });
    },
    queryParams
  );
};

export const useTableRevertCommitMutation = (mutationSettings) => {
  return useMutation(
    (data) =>
      tableService.revertCommit({
        projectId: mutationSettings.projectId,
        data,
      }),
    mutationSettings
  );
};
export const useTableCommitVersionMutation = (mutationSettings) => {
  return useMutation(
    (data) =>
      tableService.postVersion({
        projectId: mutationSettings.projectId,
        data,
      }),
    mutationSettings
  );
};

export const useTableConfigureMutation = (mutationSettings) => {
  return useMutation(({ data, resourceId, envId }) => tableService.configure({ data, resourceId, envId }), mutationSettings);
};

export default tableService;
