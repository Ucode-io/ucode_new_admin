import { useMutation, useQuery } from "react-query";
import httpsRequestV2 from "../utils/httpsRequestV2";
import request from "../utils/request";

const tableFolderService = {
  getList: (params) =>
    httpsRequestV2.get("/table-folder", {
      params,
      headers: {
        "environment-id": params.envId,
      },
    }),
  update: (data) => request.put(`/table-folder`, data),
  create: (data) => {
    return httpsRequestV2.post("/table-folder", data);
  },
  delete: (id) => {
    return httpsRequestV2.delete(`/table-folder/${id}`);
  },
};

export const useTableFolderListQuery = ({ params = {}, queryParams } = {}) => {
  return useQuery(
    ["TABLE_FOLDER", params],
    () => {
      return tableFolderService.getList(params);
    },
    queryParams
  );
};

export const useTableFolderUpdateMutation = (mutationSettings) => {
  return useMutation(
    (data) => tableFolderService.update(data),
    mutationSettings
  );
};

export const useTableFolderCreateMutation = (mutationSettings) => {
  return useMutation(
    (data) => tableFolderService.create(data),
    mutationSettings
  );
};

export const useTableFolderDeleteMutation = (mutationSettings) => {
  return useMutation((id) => tableFolderService.delete(id), mutationSettings);
};

export default tableFolderService;
