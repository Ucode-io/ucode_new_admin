import request from "../utils/request";
import requestAuth from "../utils/requestAuth";
import requestAuthV2 from "../utils/requestAuthV2";

const companyService = {
  getList: (params) => {
    return request.get(`/company`, {
      params,
    });
  },
  getCompaniesList: (params) => {
    return request.get(`/companies`, {
      params,
    });
  },
  getCompanyData: (id) => {
    return request.get(`companies/${id}/projects`);
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

export default companyService;
