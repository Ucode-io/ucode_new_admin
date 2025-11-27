import { useMutation, useQuery } from "react-query";
import requestAuth from "../utils/requestAuthV2";

const emailService = {
  getList: (params) =>
    requestAuth.get(`/email-settings`, {
      params,
    }),
  update: (data) => requestAuth.put(`/email-settings`, data),
  create: (data) => requestAuth.post(`/email-settings`, data),
  delete: (id) => requestAuth.delete(`/email-settings/${id}`),
};

export const useEmailListQuery = ({ params = {}, queryParams } = {}) => {
  return useQuery(
    ["EMAILS", { ...params }],
    () => {
      return emailService.getList(params);
    },
    queryParams
  );
};

export const useApiKeyGetByIdQuery = ({
  params = {},
  projectId,
  id,
  queryParams,
}) => {
  return useQuery(
    ["API_KEY_GET_BY_ID", { projectId, id, ...params }],
    () => {
      return emailService.getByID(projectId, id);
    },
    queryParams
  );
};

export const useEmailUpdateMutation = (mutationSettings) => {
  return useMutation((data) => emailService.update(data), mutationSettings);
};

export const useEmailCreateMutation = (mutationSettings) => {
  return useMutation((data) => emailService.create(data), mutationSettings);
};

export const useEmailDeleteMutation = (mutationSettings) => {
  return useMutation((id) => emailService.delete(id), mutationSettings);
};

export default emailService;
