import { useMutation, useQuery } from "react-query";
import requestAuth from "../utils/requestAuth";

const userService = {
  getList: (params) =>
    requestAuth.get("v2/user", {
      params,
    }),
  getByID: (id, params) =>
    requestAuth.get(`v2/user/${id}`, {
      params,
    }),
  update: (data) => requestAuth.put("v2/user", data),
  delete: (id, params) =>
    requestAuth.delete(`v2/user/${id}`, {
      params,
    }),
  create: (data) => requestAuth.post("v2/user", data, {}),
  upsert: (data) =>
    requestAuth.post(`v2/upsert-user-info/${data.id}`, data, {}),
};

export const useUsersListQuery = ({ params = {}, queryParams } = {}) => {
  return useQuery(
    ["USERS", params],
    () => {
      return userService.getList(params);
    },
    queryParams
  );
};

export const useUserGetByIdQuery = ({ id, ...params }, queryParams) => {
  return useQuery(
    ["USER_GET_BY_ID", { id, ...params }],
    () => {
      return userService.getByID(id, params);
    },
    queryParams
  );
};

export const useUserUpsertMutation = (mutationSettings) => {
  return useMutation((data) => userService.upsert(data), mutationSettings);
};

export const useUserCreateMutation = (mutationSettings) => {
  return useMutation((data) => userService.create(data), mutationSettings);
};

export const useUserUpdateMutation = (mutationSettings) => {
  return useMutation((data) => userService.update(data), mutationSettings);
};

export const useUserDeleteMutation = (mutationSettings, params) => {
  return useMutation((id) => userService.delete(id, params), mutationSettings);
};

export default userService;
