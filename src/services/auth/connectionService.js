import {useMutation, useQuery} from "react-query";
import requestAuthV2 from "../../utils/requestAuthV2";

const connectionServiceV2 = {
  getList: (params, headers) =>
    requestAuthV2.get(`/connection`, {
      params: {limit: 10, offset: 0, ...params},
      headers,
    }),
  getById: (params, id) => requestAuthV2.get(`/connection/${id}`, {params}),
  create: (data) => requestAuthV2.post("/connection", data),
  update: (data) => requestAuthV2.put("/connection", data),
  delete: (id) => requestAuthV2.delete(`/connection/${id}`),
};

export const useConnectionGetByIdQuery = ({id, params = {}, queryParams}) => {
  return useQuery(
    ["CONNECTION_GET_BY_ID", {...params, id}],
    () => {
      return connectionServiceV2.getById(params, id);
    },
    queryParams
  );
};

export const useConnectionUpdateMutation = (mutationSettings) => {
  return useMutation(
    (data) => connectionServiceV2.update(data),
    mutationSettings
  );
};

export const useConnectionCreateMutation = (mutationSettings) => {
  return useMutation(
    (data) => connectionServiceV2.create(data),
    mutationSettings
  );
};

export const useConnectionDeleteMutation = (mutationSettings) => {
  return useMutation((id) => connectionServiceV2.delete(id), mutationSettings);
};

export default connectionServiceV2;
