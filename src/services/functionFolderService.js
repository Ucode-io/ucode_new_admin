import { useMutation, useQuery } from "react-query";
import request from "../utils/request";

const functionFolderService = {
  getList: (params) =>
    request.get("/function-folder", {
      params,
    }),
  getById: (params, folderId) =>
    request.get(`/function-folder/${folderId}`, {
      params,
    }),
  update: (data) => request.put("/function-folder", data, {}),
  create: (data) => request.post("/function-folder", data, {}),
  delete: (folderId) => request.delete(`/function-folder/${folderId}`, {}),
};

export const useFunctionFoldersListQuery = ({
  params = {},
  queryParams,
} = {}) => {
  return useQuery(
    ["FUNCTION_FOLDERS", { params }],
    () => {
      return functionFolderService.getList(params);
    },
    queryParams
  );
};

export const useFunctionFolderByIdQuery = ({
  params = {},
  folderId,
  queryParams,
} = {}) => {
  return useQuery(
    ["FUNCTION_FOLDER_BY_ID", { params, folderId }],
    () => {
      return functionFolderService.getList(params, folderId);
    },
    queryParams
  );
};

export const useFunctionFolderUpdateMutation = (mutationSettings) => {
  return useMutation(
    (data) => functionFolderService.update(data),
    mutationSettings
  );
};

export const useFunctionFolderCreateMutation = (mutationSettings) => {
  return useMutation(
    (data) => functionFolderService.create(data),
    mutationSettings
  );
};

export const useFunctionFolderDeleteMutation = (mutationSettings) => {
  return useMutation(
    (folderId) => functionFolderService.delete(folderId),
    mutationSettings
  );
};
