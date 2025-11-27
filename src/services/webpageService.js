import { useMutation, useQuery } from "react-query";
import request from "../utils/request";
import { store } from "../store";
const authStore = store.getState().auth;

const webPageService = {
  getList: (params, envId) =>
    request.get("webpageV2", {
      params,
      headers: { "environment-id": envId },
    }),
  getById: (params, pageId) =>
    request.get(`webpageV2/${pageId}`, {
      params,
      headers: { "environment-id": authStore.environmentId },
    }),
  update: (data) =>
    request.put("webpageV2", data, {
      headers: { "environment-id": authStore.environmentId },
      params: { "project-id": data.project_id },
    }),
  create: (data) =>
    request.post("webpageV2", data, {
      headers: { "environment-id": authStore.environmentId },
      params: { "project-id": data.project_id },
    }),
  delete: ({ pageId, projectId }) =>
    request.delete(`webpageV2/${pageId}`, {
      headers: { "environment-id": authStore.environmentId },
      params: { "project-id": projectId },
    }),
};

export const useWebPagesListQuery = ({
  params = {},
  envId,
  queryParams,
} = {}) => {
  return useQuery(
    ["WEB_PAGES", { params, envId }],
    () => {
      return webPageService.getList(params, envId);
    },
    queryParams
  );
};

export const useWebPageByIdQuery = ({
  params = {},
  pageId,
  queryParams,
} = {}) => {
  return useQuery(
    ["WEB_PAGE_BY_ID", { params, pageId }],
    () => {
      return webPageService.getById(params, pageId);
    },
    queryParams
  );
};

export const useWebPageUpdateMutation = (mutationSettings) => {
  return useMutation((data) => webPageService.update(data), mutationSettings);
};

export const useWebPageCreateMutation = (mutationSettings) => {
  return useMutation((data) => webPageService.create(data), mutationSettings);
};

export const useWebPageDeleteMutation = (mutationSettings) => {
  return useMutation(
    ({ pageId, projectId }) => webPageService.delete({ pageId, projectId }),
    mutationSettings
  );
};

export default webPageService;
