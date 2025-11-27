import { useMutation, useQuery } from "react-query";
import request from "../utils/request";

const templateFolderService = {
  getList: (params, envId) =>
    request.get("/template-folder", {
      params,
    }),
  create: (data) =>
    request.post("/template-folder", data, {
      params: { "project-id": data.project_id },
    }),
  update: (data) =>
    request.put("/template-folder", data, {
      params: { "project-id": data.project_id },
    }),
  delete: ({ id, projectId }) =>
    request.delete(`/template-folder/${id}`, {
      params: { "project-id": projectId },
    }),
};

export const useTemplateFoldersListQuery = ({
  params = {},
  envId,
  queryParams,
} = {}) => {
  return useQuery(
    ["TEMPLATE_FOLDERS", { ...params, envId }],
    () => {
      return templateFolderService.getList(params, envId);
    },
    queryParams
  );
};

export const useTemplateFolderCreateMutation = (mutationSettings) => {
  return useMutation(
    (data) => templateFolderService.create(data),
    mutationSettings
  );
};

export const useTemplateFolderUpdateMutation = (mutationSettings) => {
  return useMutation(
    (data) => templateFolderService.update(data),
    mutationSettings
  );
};

export const useTemplateFolderDeleteMutation = (mutationSettings) => {
  return useMutation(
    ({ id, projectId }) => templateFolderService.delete({ id, projectId }),
    mutationSettings
  );
};
