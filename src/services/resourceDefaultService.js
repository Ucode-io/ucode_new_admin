import { useMutation, useQuery } from "react-query";
import request from "../utils/request";

const resourceDefault = {
  getList: (params) =>
    request.get("/company/project/service-resource", {
      params,
    }),
  update: (data) =>
    request.put(
      `/company/project/service-resource?project-id=${data.project_id}`,
      data
    ),
};

export const useDefaultResourcesListQuery = ({
  params = {},
  envId,
  queryParams,
} = {}) => {
  return useQuery(
    ["RESOURCES", { ...params, envId }],
    () => {
      return resourceDefault.getList(params, envId);
    },
    queryParams
  );
};

export const useDefaultResourceMutation = (mutationSettings) => {
  return useMutation((data) => resourceDefault.update(data), mutationSettings);
};
