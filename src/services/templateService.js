import { useMutation, useQuery } from "react-query";
import request from "../utils/request";

const templateService = {
  getList: (params, envId) =>
    request.get("/template", {
      params,
    }),
  getById: ({ id, params, envId }) =>
    request.get(`/template/${id}`, {
      params,
    }),
  create: (data) =>
    request.post("/template", data, {
      params: { "project-id": data.project_id },
    }),
  update: (data) =>
    request.put("/template", data, {
      params: { "project-id": data.project_id },
    }),
  delete: ({ id, projectId }) =>
    request.delete(`/template/${id}`, {
      params: { "project-id": projectId },
    }),
};

export const useTemplatesListQuery = ({
  params = {},
  envId,
  queryParams,
} = {}) => {
  return useQuery(
    ["TEMPLATES", { ...params, envId }],
    () => {
      return templateService.getList(params, envId);
    },
    queryParams
  );
};

export const useTemplateByIdQuery = ({
  params = {},
  id,
  envId,
  queryParams,
} = {}) => {
  return useQuery(
    ["TEMPLATE_BY_ID", { ...params, id, envId }],
    () => {
      return templateService.getById({ id, params, envId });
    },
    queryParams
  );
};

export const useTemplateCreateMutation = (mutationSettings) => {
  return useMutation((data) => templateService.create(data), mutationSettings);
};

export const useTemplateUpdateMutation = (mutationSettings) => {
  return useMutation((data) => templateService.update(data), mutationSettings);
};

export const useTemplateDeleteMutation = (mutationSettings) => {
  return useMutation(
    ({ id, projectId }) => templateService.delete({ id, projectId }),
    mutationSettings
  );
};

export default templateService;
