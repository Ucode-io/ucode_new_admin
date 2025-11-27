import { useMutation, useQuery } from "react-query";
import requestAuthV2 from "../utils/requestAuthV2";

const roleServiceV2 = {
  getList: (params) => requestAuthV2.get("/role", { params }),
  getById: (params, id) => requestAuthV2.get(`/role/${id}`, { params }),
  create: (data) => requestAuthV2.post("/role", data),
  update: (data) => requestAuthV2.put("/role", data),
  delete: (id) => requestAuthV2.delete(`/role/${id}`),
  addPermissionToRole: (data) =>
    requestAuthV2.post(`/role-permission/many`, data),
};
export const useRoleListQuery = ({
  params = {},
  headers = {},
  queryParams,
} = {}) => {
  return useQuery(
    ["ROLES", { params, headers }],
    () => {
      return roleServiceV2.getList(params, headers);
    },
    queryParams
  );
};

export const useRoleGetByIdQuery = ({ id, params = {}, queryParams }) => {
  return useQuery(
    ["ROLE_GET_BY_ID", { ...params, id }],
    () => {
      return roleServiceV2.getById(params, id);
    },
    queryParams
  );
};

export const useRoleUpdateMutation = (mutationSettings) => {
  return useMutation((data) => roleServiceV2.update(data), mutationSettings);
};

export const useRoleCreateMutation = (mutationSettings) => {
  return useMutation((data) => roleServiceV2.create(data), mutationSettings);
};

export const useRoleDeleteMutation = (mutationSettings) => {
  return useMutation((id) => roleServiceV2.delete(id), mutationSettings);
};

export default roleServiceV2;
