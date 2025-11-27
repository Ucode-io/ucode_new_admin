import { useMutation, useQuery } from "react-query";
import request from "../utils/request";

const noteService = {
  getList: (params, envId) =>
    request.get("/note", {
      params,
    }),
  getById: ({ id, params, envId }) =>
    request.get(`/note/${id}`, {
      params,
    }),
  create: (data) =>
    request.post("/note", data, {
      params: { "parent-id": data.parent_id },
    }),
  update: (data) =>
    request.put("/note", data, {
      params: { "parent-id": data.parent_id },
    }),
  delete: ({ id, projectId }) =>
    request.delete(`/note/${id}`, {
      params: { "project-id": projectId },
    }),
};

export const useNotesListQuery = ({ params = {}, envId, queryParams } = {}) => {
  return useQuery(
    ["NOTES", { ...params, envId }],
    () => {
      return noteService.getList(params, envId);
    },
    queryParams
  );
};

export const useNoteByIdQuery = ({
  params = {},
  id,
  envId,
  queryParams,
} = {}) => {
  return useQuery(
    ["NOTE_BY_ID", { ...params, id, envId }],
    () => {
      return noteService.getById({ id, params, envId });
    },
    queryParams
  );
};

export const useNoteCreateMutation = (mutationSettings) => {
  return useMutation((data) => noteService.create(data), mutationSettings);
};

export const useNoteUpdateMutation = (mutationSettings) => {
  return useMutation((data) => noteService.update(data), mutationSettings);
};

export const useNoteDeleteMutation = (mutationSettings) => {
  return useMutation(
    ({ id, projectId }) => noteService.delete({ id, projectId }),
    mutationSettings
  );
};

export default noteService;
