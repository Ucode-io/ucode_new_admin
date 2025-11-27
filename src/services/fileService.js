import { useMutation, useQuery } from "react-query";
import request from "../utils/request";
import requestV2 from "../utils/requestV2";
import requestWithoutProjectId from "../utils/requestWithoutProjectId";

const fileService = {
  upload: (data, params) => request.post("/upload", data, { params }),
  folderUpload: (data, params) => requestWithoutProjectId.post(`/v1/files/folder_upload`, data, { params }),
  getMinioList: (params) => requestWithoutProjectId.get(`/v1/files`, { params }),
  delete: (data) => requestWithoutProjectId.delete(`/v1/files`, { data }),
  fileDelete: (id) => requestWithoutProjectId.delete(`/v1/files/${id}`),
  update: (data) => requestWithoutProjectId.put(`/v1/files`, data),
  getByID: (params, fileId) => {
    return requestWithoutProjectId.get(`/v1/files/${fileId}`, {
      params,
    });
  },
};

export const useMinioObjectListQuery = ({ params = {}, queryParams } = {}) => {
  return useQuery(
    ["MINIO_OBJECT", params],
    () => {
      return fileService.getMinioList(params);
    },
    queryParams
  );
};

export const useFileGetByIdQuery = ({ fileId, params = {}, queryParams }) => {
  return useQuery(
    ["FILE_GET_BY_ID", { ...params, fileId }],
    () => {
      return fileService.getByID(params, fileId);
    },
    queryParams
  );
};

export const useFileUpdateMutation = (mutationSettings) => {
  return useMutation((data) => fileService.update(data), mutationSettings);
};

export const useFilesDeleteMutation = (mutationSettings) => {
  return useMutation((data) => fileService.delete(data), mutationSettings);
};
export const useFileDeleteMutation = (mutationSettings) => {
  return useMutation((data) => fileService.fileDelete(data), mutationSettings);
};

export default fileService;
