import { useMutation, useQuery } from "react-query";
import requestWithoutProjectId from "../utils/requestWithoutProjectId";

const globalService = {
  getProjectList: (params) => {
    return requestWithoutProjectId.get(`/v1/global/projects`, {
      params,
    });
  },
  getEnvList: (params) => {
    return requestWithoutProjectId.get(`/v1/global/environment`, {
      params,
    });
  },
  getGlobalMenuList: (params) => {
    return requestWithoutProjectId.get(`/v1/global/template`, {
      params,
    });
  },
  getByID: (params, platformId) =>
    requestWithoutProjectId.get(`/v1/global/environment/${platformId}`, {
      params,
    }),

  create: (data) => requestWithoutProjectId.post(`/v2/copy-project`, data),
};

export const useProjectTemplateListQuery = ({
  params = {},
  queryParams,
} = {}) => {
  return useQuery(
    ["PROJECT_TEMPLATE_LIST", params],
    () => {
      return globalService.getProjectList(params);
    },
    queryParams
  );
};
export const useEnvTemplateListQuery = ({ params = {}, queryParams } = {}) => {
  return useQuery(
    ["ENVIRONMENT_TEMPLATE_LIST", params],
    () => {
      return globalService.getEnvList(params);
    },
    queryParams
  );
};
export const useGlobalMenuTemplateListQuery = ({
  params = {},
  queryParams,
} = {}) => {
  return useQuery(
    ["GLOBAL_MENU_TEMPLATE_LIST", params],
    () => {
      return globalService.getGlobalMenuList(params);
    },
    queryParams
  );
};

export const useTemplateGetByIdQuery = ({
  menuId,
  params = {},
  queryParams,
}) => {
  return useQuery(
    ["MENU_SETTING_GET_BY_ID", { ...params, menuId }],
    () => {
      return globalService.getByID(params, menuId);
    },
    queryParams
  );
};

export const useGlobalTemplateCreateMutation = (mutationSettings) => {
  return useMutation((data) => globalService.create(data), mutationSettings);
};

export default globalService;
