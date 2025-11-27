import { useQuery } from "react-query";
import request from "../utils/request";
import requestV2 from "../utils/requestV2";

const constructorTableService = {
  getList: (params, projectId) => request.get("/table", { params: { ...params, project_id: projectId } }),
  getTableInfo: (tableSlug, data, params) => request.post(`/table-details/${tableSlug}`, data, { params }),
  update: (data, projectId) => request.put("/table", data, { params: { project_id: projectId } }),
  create: (data, projectId) => request.post("/table", data, { params: { project_id: projectId } }),
  getByIdForQuery: (params, id) => request.get(`/table/${id}`, { params }),
  getById: (id) => request.get(`/table/${id}`),
  delete: (id, projectId) => request.delete(`/table/${id}`, { params: { project_id: projectId } }),
  getFolderList: (params) => requestV2.get("/table-folder", { params }),
  getFolderById: (id, appId) => requestV2.get(`/table-folder/${id}`, { params: { app_id: appId } }),
  createFolder: (data) => requestV2.post("/table-folder", data),
  updateFolder: (data) => requestV2.put("/table-folder", data),
  deleteFolder: (id) => requestV2.delete(`/table-folder/${id}`),
};

export const useTablesListQuery = ({ params = {}, queryParams } = {}) => {
  return useQuery(
    ["TABLES", params],
    () => {
      return constructorTableService.getList(params);
    },
    queryParams
  );
};
export const useTableFolderListQuery = ({ params = {}, queryParams } = {}) => {
  return useQuery(
    ["TABLE_FOLDER", params],
    () => {
      return constructorTableService.getFolderList(params);
    },
    queryParams
  );
};
export const useTableByIdQuery = ({ params = {}, id, queryParams } = {}) => {
  return useQuery(
    ["TABLE_BY_ID", { params, id }],
    () => {
      return constructorTableService.getByIdForQuery(params, id);
    },
    queryParams
  );
};

export default constructorTableService;
