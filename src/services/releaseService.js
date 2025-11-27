import { useMutation, useQuery } from "react-query";
import request from "../utils/request";

const releaseService = {
  getList: ({ params, projectId }) =>
    request.get(`release/${projectId}`, {
      params,
    }),
  getByID: ({ id }) => request.get(`release/${id}`),
  update: (data) => request.put(`release`, data),
  create: (data) => request.post("release", data),
  delete: ({ id }) => request.delete(`release/${id}`),
  setCurrent: ({ data }) => request.post(`release/current`, data),
};

export const useReleasesListQuery = ({
  params = {},
  projectId,
  queryParams,
} = {}) => {
  return useQuery(
    ["RELEASES", { ...params, projectId }],
    () => {
      return releaseService.getList({ params, projectId });
    },
    queryParams
  );
};

export const useReleaseGetByIdQuery = ({ id, queryParams }) => {
  return useQuery(
    ["RELEASE_GET_BY_ID", { id }],
    () => {
      return releaseService.getByID({ id });
    },
    queryParams
  );
};

export const useReleaseUpdateMutation = (mutationSettings) => {
  return useMutation((data) => releaseService.update(data), mutationSettings);
};

export const useReleasesCreateMutation = (mutationSettings) => {
  return useMutation((data) => releaseService.create(data), mutationSettings);
};

export const useReleasesDeleteMutation = (mutationSettings) => {
  return useMutation(
    ({ id }) => releaseService.delete({ id }),
    mutationSettings
  );
};

export const useSetCurrentReleaseMutation = (mutationSettings) => {
  return useMutation(
    ({ data }) => releaseService.setCurrent({ data }),
    mutationSettings
  );
};

export default releaseService;
