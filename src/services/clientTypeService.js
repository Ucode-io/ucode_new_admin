import {useMutation, useQuery} from "react-query";
import requestAuthV2 from "../utils/requestAuthV2";

const clientTypeService = {
  getList: (params, envId) =>
    requestAuthV2.get("/client-type", {
      params,
    }),
  getById: (id, params) =>
    requestAuthV2.get(`/client-type/${id}`, {
      params,
    }),
  create: ({data, params}) =>
    requestAuthV2.post("/client-type", data, {
      params,
    }),
  update: ({data, params}) =>
    requestAuthV2.put("/client-type", data, {
      params,
    }),
  delete: ({id, projectId}) =>
    requestAuthV2.delete(`/client-type/${id}`, {
      params: {"project-id": projectId},
    }),
};

export const useClientTypesListQuery = ({
  params = {},
  envId,
  queryParams,
} = {}) => {
  return useQuery(
    ["CLIENT_TYPES", {...params, envId}],
    () => {
      return clientTypeService.getList(params, envId);
    },
    queryParams
  );
};

export const useClientTypeByIdQuery = ({id, params = {}, quryParams}) => {
  return useQuery(
    ["CLIENT_TYPE_BY_ID", {id, ...params}],
    () => {
      return clientTypeService.getById(id, params);
    },
    quryParams
  );
};

export const useClientTypeCreateMutation = (mutationSettings) => {
  return useMutation(
    ({data, params}) => clientTypeService.create({data, params}),
    mutationSettings
  );
};

export const useClientTypeUpdateMutation = (mutationSettings) => {
  return useMutation(
    ({data, params}) => clientTypeService.update({data, params}),
    mutationSettings
  );
};

export const useClientTypeDeleteMutation = (mutationSettings) => {
  return useMutation((id) => clientTypeService.delete(id), mutationSettings);
};
