import { useMutation, useQuery } from "react-query";
import request from "../utils/request";
import requestAuth from "../utils/requestAuth";

const notificationService = {
  getList: (params, headers) =>
    request.get(`/notification`, { params, headers }),
  getUserList: (params, headers) =>
    requestAuth.get(`/user`, { params, headers }),
  getByID: ({ notificationId, projectId, envId, commitId }) =>
    request.get(`/notification/${notificationId}`, {
      headers: { "environment-id": envId },
      params: {
        "project-id": projectId,
        "commit-id": commitId,
      },
    }),
  update: (data) =>
    request.put(`/notification`, data, {
      headers: {
        "resource-id": data.resourceId,
      },
    }),
  create: (data) => {
    return request.post("/notification", data, {
      headers: {
        "resource-id": data.resourceId,
      },
    });
  },
  run: ({ data, projectId }) => {
    return request.post("/notification/run", data, {
      params: { "project-id": projectId },
      headers: {
        "resource-id": data.resourceId,
      },
    });
  },
  delete: ({ id, envId, projectId, resourceId }) =>
    request.delete(`/notification/dag/${id}`, {
      params: { "project-id": projectId },
      headers: { "resource-id": resourceId, "environment-id": envId },
    }),
  getHistory: ({ notificationId, projectId, envId }) =>
    request.get(`/notification/${notificationId}/history`, {
      headers: { "environment-id": envId },
      params: { "project-id": projectId },
    }),
  revertCommit: ({ data, projectId, envId }) =>
    request.post(`/notification/revert`, data, {
      headers: { "environment-id": envId },
      params: { "project-id": projectId },
    }),
  selectVersion: ({ notificationId, envId, projectId, data }) =>
    request.put(`/notification/${notificationId}/select-versions`, data, {
      headers: { "environment-id": envId },
      params: { "project-id": projectId },
    }),
};

export const useNotificationListQuery = ({
  params = {},
  headers = {},
  queryParams,
} = {}) => {
  return useQuery(
    ["NOTIFICATION", { ...params, ...headers }],
    () => {
      return notificationService.getList(params, headers);
    },
    queryParams
  );
};
export const useUserListQuery = ({
  params = {},
  headers = {},
  queryParams,
} = {}) => {
  return useQuery(
    ["USER", { ...params, ...headers }],
    () => {
      return notificationService.getUserList(params, headers);
    },
    queryParams
  );
};

export const useNotificationGetByIdQuery = ({
  notificationId,
  projectId,
  envId,
  commitId,
  queryParams,
}) => {
  return useQuery(
    ["NOTIFICATION_GET_BY_ID", { notificationId, projectId, envId, commitId }],
    () => {
      return notificationService.getByID({
        notificationId,
        projectId,
        envId,
        commitId,
      });
    },
    queryParams
  );
};

export const useNotificationUpdateMutation = (mutationSettings) => {
  return useMutation((data) => {
    return notificationService.update(data);
  }, mutationSettings);
};

export const useNotificationCreateMutation = (mutationSettings) => {
  return useMutation((data) => {
    return notificationService.create(data);
  }, mutationSettings);
};
export const useNotificationRunMutation = (mutationSettings) => {
  return useMutation((data) => {
    return notificationService.run(data);
  }, mutationSettings);
};

export const useNotificationDeleteMutation = (mutationSettings) => {
  return useMutation(
    ({ id, envId, projectId }) =>
      notificationService.delete({ id, envId, projectId }),
    mutationSettings
  );
};

export const useNotificationHistoryQuery = ({
  notificationId,
  projectId,
  envId,
  queryParams,
} = {}) => {
  return useQuery(
    ["NOTIFICATION_HISTORY", { notificationId, projectId, envId }],
    () => {
      return notificationService.getHistory({
        notificationId,
        projectId,
        envId,
      });
    },
    queryParams
  );
};

export const useNotificationRevertCommitMutation = (mutationSettings) => {
  return useMutation(
    ({ data, envId }) =>
      notificationService.revertCommit({
        data,
        projectId: mutationSettings.projectId,
        envId,
      }),
    mutationSettings
  );
};

export const useNotificationVersionSelectMutation = (mutationSettings) => {
  return useMutation(({ notificationId, data, envId }) => {
    return notificationService.selectVersion({
      notificationId,
      data,
      projectId: mutationSettings.projectId,
      envId,
    });
  }, mutationSettings);
};

export default notificationService;
