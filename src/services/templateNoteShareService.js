import { useMutation, useQuery } from "react-query";
import request from "../utils/request";

const templateNoteShareService = {
  updateShareDocument: (data) =>
    request.put("/template-note/share", data, {
      params: { "project-id": data.project_id },
    }),
  createShareDocument: (data) =>
    request.post("/template-note/share", data, {
      params: { "project-id": data.project_id },
    }),
  getListUserDocument: (params) =>
    request.get("/template-note/users", {
      params,
    }),
  updateUserDocument: (data) =>
    request.put("/template-note/users", data, {
      params: { "project-id": data.project_id },
    }),
  createUserDocument: (params, data) =>
    request.post("/template-note/users", data, {
      params,
    }),
  getSingleUserDocument: ({ data, permissionId }) =>
    request.get(`/template-note/users/${permissionId}`, data, {
      params: { "project-id": data.project_id },
    }),
  deleteUserDocument: ({ projectId, permissionId }) =>
    request.delete(`/template-note/users/${permissionId}`, {
      params: { "project-id": projectId },
    }),
  getSingleObjectDocument: (data) =>
    request.post("/template-note/share-get", data, {
      params: { "project-id": data.project_id },
    }),
};

export const useUpdateShareDocumentMutation = (mutationSettings) => {
  return useMutation(
    (data) => templateNoteShareService.updateShareDocument(data),
    mutationSettings
  );
};

export const useCreateShareDocumentMutation = ({
  data = {},
  queryParams,
} = {}) => {
  return useQuery(
    ["CREATE_SHARE_DOCUMENT", data],
    () => {
      return templateNoteShareService.createShareDocument(data);
    },
    queryParams
  );
};

export const useUserListDocumentQuery = ({
  params = {},
  envId,
  queryParams,
} = {}) => {
  return useQuery(
    ["USER_LIST_DOCUMENT", { ...params, envId }],
    () => {
      return templateNoteShareService.getListUserDocument(params, envId);
    },
    queryParams
  );
};

export const useUpdateUserDocumentMutation = (mutationSettings) => {
  return useMutation(
    (data) => templateNoteShareService.updateUserDocument(data),
    mutationSettings
  );
};

export const useCreateUserDocumentMutation = (mutationSettings) => {
  return useMutation(
    ({ params, data }) =>
      templateNoteShareService.createUserDocument(params, data),
    mutationSettings
  );
};

export const useGetSingleUserDocumentQuery = ({
  params = {},
  envId,
  queryParams,
} = {}) => {
  return useQuery(
    ["USER_LIST_DOCUMENT", { ...params, envId }],
    () => {
      return templateNoteShareService.getSingleUserDocument(params, envId);
    },
    queryParams
  );
};

export const useDeleteUserDocumentMutation = (mutationSettings) => {
  return useMutation(
    ({ projectId, permissionId }) =>
      templateNoteShareService.deleteUserDocument({ projectId, permissionId }),
    mutationSettings
  );
};

export const useGetSingleObjectDocumentQuery = ({
  data = {},
  queryParams,
} = {}) => {
  return useQuery(
    ["SINGLE_OBJECT_DOCUMENT", data],
    () => {
      return templateNoteShareService.getSingleObjectDocument(data);
    },
    queryParams
  );
};
