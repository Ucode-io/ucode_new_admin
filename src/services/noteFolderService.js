import { useMutation, useQuery } from "react-query";
import request from "../utils/request";

const noteFolderService = {
  getList: (params, envId) =>
    request.get("/note-folder", {
      params,
    }),
  create: (data) =>
    request.post("/note-folder", data, {
      params: { "project-id": data.project_id },
    }),
  update: (data) =>
    request.put("/note-folder", data, {
      params: { "project-id": data.project_id },
    }),
  delete: (id) => request.delete(`/note-folder/${id}`),
};

export const useNoteFoldersListQuery = ({
  params = {},
  envId,
  queryParams,
} = {}) => {
  return useQuery(
    ["NOTE_FOLDERS", { ...params, envId }],
    () => {
      return noteFolderService.getList(params, envId);
    },
    queryParams
  );
};

export const useNoteFolderCreateMutation = (mutationSettings) => {
  return useMutation(
    (data) => noteFolderService.create(data),
    mutationSettings
  );
};

export const useNoteFolderUpdateMutation = (mutationSettings) => {
  return useMutation(
    (data) => noteFolderService.update(data),
    mutationSettings
  );
};

export const useNoteFolderDeleteMutation = (mutationSettings) => {
  return useMutation((id) => noteFolderService.delete(id), mutationSettings);
};
