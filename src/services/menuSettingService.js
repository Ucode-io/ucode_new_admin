import { useMutation, useQuery } from "react-query";
import request from "../utils/request";
import requestV2 from "../utils/requestV2";

const menuSettingService = {
  getList: (params) => {
    return request.get(`/menu-settings`, {
      params,
    });
  },
  getByID: (params, platformId) =>
    requestV2.get(`user/${platformId}/menu-settings`, {
      params,
    }),
  update: (data) =>
    request.put(`/menu-settings`, data, {
      params: {
        "project-id": data.project_id,
      },
    }),
  create: (data) =>
    request.post(`/menu-settings`, data, {
      params: {
        "project-id": data.project_id,
      },
    }),
  delete: (id) => request.delete(`/menu-settings/${id}`),
};

export const useMenuSettingListQuery = ({ params = {}, queryParams } = {}) => {
  return useQuery(
    ["MENU_SETTING", params],
    () => {
      return menuSettingService.getList(params);
    },
    queryParams
  );
};

export const useMenuSettingGetByIdQuery = ({
  menuId,
  params = {},
  queryParams,
}) => {
  return useQuery(
    ["MENU_SETTING_GET_BY_ID", { ...params, menuId }],
    () => {
      return menuSettingService.getByID(params, menuId);
    },
    queryParams
  );
};

export const useMenuSettingUpdateMutation = (mutationSettings) => {
  return useMutation(
    (data) => menuSettingService.update(data),
    mutationSettings
  );
};

export const useMenuSettingCreateMutation = (mutationSettings) => {
  return useMutation(
    (data) => menuSettingService.create(data),
    mutationSettings
  );
};

export const useMenuSettingDeleteMutation = (mutationSettings) => {
  return useMutation((id) => menuSettingService.delete(id), mutationSettings);
};

export default menuSettingService;
