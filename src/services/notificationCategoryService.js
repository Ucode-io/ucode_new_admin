import { useMutation, useQuery } from "react-query";
import request from "../utils/request";

const notificationCategory = {
  getList: (params, headers) =>
    request.get("/notification/category", { params, headers }),
  getByID: ({ resourceId, fieldId, envId }) =>
    request.get(`/notification/category/${fieldId}`, {
      headers: { "resource-id": resourceId, "environment-id": envId },
    }),
  update: (data) =>
    request.put(`/notification/category`, data, {
      params: { "project-id": data.project_id },
      headers: { "resource-id": data.resourceId, "environment-id": data.envId },
    }),
  create: (data) =>
    request.post("/notification/category", data, {
      params: { "project-id": data.project_id },
      headers: { "resource-id": data.resourceId, "environment-id": data.envId },
    }),
  delete: ({ id, envId, projectId }) =>
    request.delete(`/notification/category/${id}`),
};

export const useNotificationCategoryListQuery = ({
  params = {},
  headers = {},
  queryParams,
} = {}) => {
  return useQuery(
    ["NOTIFICATION_CATEGORIES", { ...params, ...headers }],
    () => {
      return notificationCategory.getList(params, headers);
    },
    queryParams
  );
};

export const useNotificationCategoryGetByIdQuery = ({
  fieldId,
  envId,
  queryParams,
}) => {
  return useQuery(
    ["NOTIFICATION_CATEGORIES_GET_BY_ID", { fieldId, envId }],
    () => {
      return notificationCategory.getByID({ fieldId, envId });
    },
    queryParams
  );
};

export const useNotificationCategoryUpdateMutation = (mutationSettings) => {
  return useMutation(
    (data) => notificationCategory.update(data),
    mutationSettings
  );
};

export const useNotificationCategoryCreateMutation = (mutationSettings) => {
  return useMutation(
    (data) => notificationCategory.create(data),
    mutationSettings
  );
};

export const useNotificationCategoryDeleteMutation = (mutationSettings) => {
  return useMutation(
    ({ id, envId, projectId }) =>
      notificationCategory.delete({ id, envId, projectId }),
    mutationSettings
  );
};

export default notificationCategory;
