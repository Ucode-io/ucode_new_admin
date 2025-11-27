import {useMutation, useQuery} from "react-query";
import requestV2 from "../utils/requestV2";

const menuService = {
  getList: (params) => {
    return requestV2.get(`/menus`, {
      params,
    });
  },
  getByID: ({menuId, params}) =>
    requestV2.get(`/menus/${menuId}`, {
      params,
    }),
  update: (data) =>
    requestV2.put(`/menus`, data, {
      params: {
        "project-id": data.project_id,
      },
    }),
  updateOrder: (data) =>
    requestV2.put(`/menus/menu-order`, data, {
      params: {
        "project-id": data.project_id,
      },
    }),
  create: (data) =>
    requestV2.post(`/menus`, data, {
      params: {
        "project-id": data.project_id,
      },
    }),
  delete: ({id, projectId}) =>
    requestV2.delete(`/menus/${id}`, {
      params: {"project-id": projectId},
    }),
};

export const useMenuListQuery = ({params = {}, queryParams} = {}) => {
  return useQuery(
    ["MENU", params],
    () => {
      return menuService.getList(params);
    },
    {
      ...queryParams,
    }
  );
};

export const useMenuGetByIdQuery = ({menuId, params = {}, queryParams}) => {
  return useQuery(
    ["MENU_GET_BY_ID", {menuId, ...params}],
    () => {
      return menuService.getByID({menuId, params});
    },
    queryParams
  );
};

export const useMenuUpdateMutation = (mutationSettings) => {
  return useMutation((data) => menuService.update(data), mutationSettings);
};

export const useMenuCreateMutation = (mutationSettings) => {
  return useMutation((data) => menuService.create(data), mutationSettings);
};

export const usePlatformDeleteMutation = ({projectId, mutationSettings}) => {
  return useMutation(
    (id) => menuService.delete({id, projectId}),
    mutationSettings
  );
};

export default menuService;
