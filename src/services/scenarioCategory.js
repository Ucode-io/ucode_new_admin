import { useMutation, useQuery } from "react-query";
import request from "../utils/request";

const scenarioCategory = {
  getList: (params, headers) =>
    request.get("/scenario/category", { params, headers }),
  getByID: ({ resourceId, fieldId, envId }) =>
    request.get(`/scenario/category/${fieldId}`, {
      headers: { "resource-id": resourceId, "environment-id": envId },
    }),
  update: (data) =>
    request.put(`/scenario/category`, data, {
      headers: { "resource-id": data.resourceId, "environment-id": data.envId },
    }),
  create: (data) =>
    request.post("/scenario/category", data, {
      headers: { "resource-id": data.resourceId, "environment-id": data.envId },
    }),
  delete: ({ id, resourceId, envId, projectId }) =>
    request.delete(`/scenario/category/${id}`, {
      headers: { "resource-id": resourceId, "environment-id": envId },
    }),
};

export const useScenarioCategoryListQuery = ({
  params = {},
  headers = {},
  queryParams,
} = {}) => {
  return useQuery(
    ["SCENARIO_CATEGORIES", { ...params, ...headers }],
    () => {
      return scenarioCategory.getList(params, headers);
    },
    queryParams
  );
};

export const useScenarioCategoryGetByIdQuery = ({
  fieldId,
  envId,
  queryParams,
}) => {
  return useQuery(
    ["SCENARIO_CATEGORIES_GET_BY_ID", { fieldId, envId }],
    () => {
      return scenarioCategory.getByID({ fieldId, envId });
    },
    queryParams
  );
};

export const useScenarioCategoryUpdateMutation = (mutationSettings) => {
  return useMutation((data) => scenarioCategory.update(data), mutationSettings);
};

export const useScenarioCategoryCreateMutation = (mutationSettings) => {
  return useMutation((data) => scenarioCategory.create(data), mutationSettings);
};

export const useScenarioCategoryDeleteMutation = (mutationSettings) => {
  return useMutation(
    ({ id, resourceId, envId, projectId }) =>
      scenarioCategory.delete({ id, resourceId, envId, projectId }),
    mutationSettings
  );
};

export default scenarioCategory;
