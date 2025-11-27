import { useMutation, useQuery } from "react-query";
import request from "../utils/request";

const fieldService = {
  getList: (params, headers) => request.get("/field", { params, headers }),
  getByID: ({ resourceId, fieldId }) =>
    request.get(`/field/${fieldId}`, {
      headers: { "resource-id": resourceId },
    }),
  update: (data) =>
    request.put(`/field`, data, {
      headers: { "resource-id": data.resourceId },
    }),
  create: (data) =>
    request.post("/field", data, {
      headers: { "resource-id": data.resourceId },
    }),
  delete: ({ id, resourceId }) =>
    request.delete(`/field/${id}`, {
      headers: { "resource-id": resourceId },
    }),
};

export const useFieldsListQuery = ({
  params = {},
  headers,
  queryParams,
} = {}) => {
  return useQuery(
    ["FIELDS", params],
    () => {
      return fieldService.getList(params, headers);
    },
    queryParams
  );
};

export const useFieldGetByIdQuery = ({
  fieldId,
  resourceId,
  envId,
  queryParams,
}) => {
  return useQuery(
    ["FIELD_GET_BY_ID", { fieldId, resourceId, envId }],
    () => {
      return fieldService.getByID({ resourceId, fieldId, envId });
    },
    queryParams
  );
};

export const useFieldUpdateMutation = (mutationSettings) => {
  return useMutation((data) => fieldService.update(data), mutationSettings);
};

export const useFieldsCreateMutation = (mutationSettings) => {
  return useMutation((data) => fieldService.create(data), mutationSettings);
};

export const useFieldsDeleteMutation = (mutationSettings) => {
  return useMutation(
    ({ id, resourceId, envId }) =>
      fieldService.delete({ id, resourceId, envId }),
    mutationSettings
  );
};

export default fieldService;
