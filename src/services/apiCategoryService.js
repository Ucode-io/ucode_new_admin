import { useMutation, useQuery } from "react-query";
import request from "../utils/request";

const apiCategory = {
  getList: (params, headers) => request.get("/category", { params, headers }),
  getByID: ({ resourceId, fieldId, envId, projectId }) =>
    request.get(`/category/${fieldId}`, {
      headers: { "resource-id": resourceId },
    }),
  update: (data) =>
    request.put(`/category`, data, {
      headers: { "resource-id": data.resourceId },
    }),
  create: (data) =>
    request.post("/category", data, {
      headers: { "resource-id": data.resourceId },
    }),
  delete: (id) => request.delete(`/category/${id}`),
};

export const useApiCategoryListQuery = ({
  params = {},
  headers = {},
  queryParams,
} = {}) => {
  return useQuery(
    ["API_CATEGORIES", { ...params, ...headers }],
    () => {
      return apiCategory.getList(params, headers);
    },
    queryParams
  );
};

export const useApiCategoryGetByIdQuery = ({
  fieldId,
  envId,
  queryParams,
  projectId,
}) => {
  return useQuery(
    ["API_CATEGORIES_GET_BY_ID", { fieldId, envId, projectId }],
    () => {
      return apiCategory.getByID({ fieldId, envId, projectId });
    },
    queryParams
  );
};

export const useApiCategoryUpdateMutation = (mutationSettings) => {
  return useMutation((data) => apiCategory.update(data), mutationSettings);
};

export const useApiCategoryCreateMutation = (mutationSettings) => {
  return useMutation((data) => apiCategory.create(data), mutationSettings);
};

export const useApiCategoryDeleteMutation = (mutationSettings) => {
  return useMutation((id) => apiCategory.delete(id), mutationSettings);
};

export default apiCategory;
