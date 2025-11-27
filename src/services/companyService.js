import { useMutation, useQuery } from "react-query";
import request from "../utils/request";
import requestAuth from "../utils/requestAuth";
import requestAuthV2 from "../utils/requestAuthV2";

const companyService = {
  getList: (params) => {
    return request.get(`/company`, {
      params,
    });
  },
  register: (data) => requestAuth.post(`/company`, data),
  getCompanyList: (data) =>
    requestAuthV2.post("/multi-company/one-login", data),
  getProjectList: (params) => {
    return request.get(`/company-project`, {
      params,
    });
  },
  getEnvironmentList: (params) => {
    return request.get(`/environment`, {
      params,
    });
  },
  getByID: (params, companyId) =>
    request.get(`/company/${companyId}`, {
      params,
    }),
  update: (data, company_id) => {
    return request.put(`/company/${company_id?.companyId}`, data);
  },
  create: (data) =>
    request.post(`/company`, data, {
      params: {
        "project-id": data.project_id,
      },
    }),
  delete: (id) => request.delete(`/company/${id}`),
};

export const useRegisterCompanyMutation = (mutationSettings) => {
  return useMutation((data) => companyService.register(data), mutationSettings);
};

export const useCompanyListQuery = ({ params = {}, queryParams } = {}) => {
  return useQuery(
    ["COMPANY", params],
    () => {
      return companyService.getList(params);
    },
    queryParams
  );
};
export const useProjectListQuery = ({ params = {}, queryParams } = {}) => {
  return useQuery(
    ["PROJECT", params],
    () => {
      return companyService.getProjectList(params);
    },
    queryParams
  );
};
export const useEnvironmentListQuery = ({ params = {}, queryParams } = {}) => {
  return useQuery(
    ["ENVIRONMENT", params],
    () => {
      return companyService.getEnvironmentList(params);
    },
    queryParams
  );
};

export const useCompanyGetByIdQuery = ({
  companyId,
  params = {},
  queryParams,
}) => {
  return useQuery(
    ["COMPANY_GET_BY_ID", { ...params, companyId }],
    () => {
      return companyService.getByID(params, companyId);
    },
    queryParams
  );
};

export const useCompanyUpdateMutation = (mutationSettings, company_id) => {
  return useMutation(
    (data) => companyService.update(data, company_id),
    mutationSettings
  );
};

export const useCompanyCreateMutation = (mutationSettings) => {
  return useMutation((data) => companyService.create(data), mutationSettings);
};

export const useCompanyDeleteMutation = (mutationSettings) => {
  return useMutation((id) => companyService.delete(id), mutationSettings);
};

export default companyService;
