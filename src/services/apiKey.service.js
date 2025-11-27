import { useSelector } from "react-redux";
import requestAuth from "../utils/requestAuth";


const apiKeyService = {
  getList: (projectId, params) =>
    requestAuth.get(`/v2/api-key/${projectId}`, {params}),
  getById: (projectId, id, params) =>
    requestAuth.get(`/v2/api-key/${projectId}/${id}`, { params }),
  create: (projectId, data) =>
    requestAuth.post(`/v2/api-key/${projectId}`, data),
  update: (projectId, id, data) =>
    requestAuth.put(`/v2/api-key/${projectId}/${id}`, data),
  delete: (projectId, id) =>
    requestAuth.delete(`/v2/api-key/${projectId}/${id}`),
};

export default apiKeyService;
