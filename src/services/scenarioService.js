import { useMutation, useQuery } from "react-query";
import request from "../utils/request";

const scenarioService = {
  getList: (params, headers) =>
    request.get(`/scenario/dag`, { params, headers }),
  getByID: ({ dagId, projectId, envId, commitId }) =>
    request.get(`/scenario/dag-step`, {
      headers: { "environment-id": envId },
      params: {
        "dag-id": dagId,
        "project-id": projectId,
        "commit-id": commitId,
      },
    }),
  update: ({ data, projectId }) =>
    request.put(`/scenario`, data, {
      headers: {
        "resource-id": data.resourceId,
      },
      params: { "project-id": projectId },
    }),
  create: ({ data, projectId }) => {
    return request.post("/scenario", data, {
      params: { "project-id": projectId },
      headers: {
        "resource-id": data.resourceId,
      },
    });
  },
  run: ({ data, projectId }) => {
    return request.post("/scenario/run", data, {
      params: { "project-id": projectId },
      headers: {
        "resource-id": data.resourceId,
      },
    });
  },
  delete: ({ id, envId, projectId, resourceId }) =>
    request.delete(`/scenario/dag/${id}`, {
      params: { "project-id": projectId },
      headers: { "resource-id": resourceId, "environment-id": envId },
    }),
  getHistory: ({ scenarioId, projectId, envId }) =>
    request.get(`/scenario/${scenarioId}/history`, {
      headers: { "environment-id": envId },
      params: { "project-id": projectId },
    }),
  revertCommit: ({ data, projectId, envId }) =>
    request.post(`/scenario/revert`, data, {
      headers: { "environment-id": envId },
      params: { "project-id": projectId },
    }),
  selectVersion: ({ scenarioId, envId, projectId, data }) =>
    request.put(`/scenario/${scenarioId}/select-versions`, data, {
      headers: { "environment-id": envId },
      params: { "project-id": projectId },
    }),
};

export const useScenarioListQuery = ({
  params = {},
  headers = {},
  queryParams,
} = {}) => {
  return useQuery(
    ["SCENARIO", { ...params, ...headers }],
    () => {
      return scenarioService.getList(params, headers);
    },
    queryParams
  );
};

export const useScenarioGetByIdQuery = ({
  dagId,
  projectId,
  envId,
  commitId,
  queryParams,
}) => {
  return useQuery(
    ["SCENARIO_GET_BY_ID", { dagId, projectId, envId, commitId }],
    () => {
      return scenarioService.getByID({ dagId, projectId, envId, commitId });
    },
    queryParams
  );
};

export const useScenarioUpdateMutation = (mutationSettings) => {
  return useMutation((data) => {
    return scenarioService.update({
      data,
      projectId: mutationSettings.projectId,
    });
  }, mutationSettings);
};

export const useScenarioCreateMutation = (mutationSettings) => {
  return useMutation((data) => {
    return scenarioService.create({
      data,
      projectId: mutationSettings.projectId,
    });
  }, mutationSettings);
};
export const useScenarioRunMutation = (mutationSettings) => {
  return useMutation((data) => {
    return scenarioService.run({
      data,
      projectId: mutationSettings.projectId,
    });
  }, mutationSettings);
};

export const useScenarioDeleteMutation = (mutationSettings) => {
  return useMutation(
    ({ id, envId, projectId }) =>
      scenarioService.delete({ id, envId, projectId }),
    mutationSettings
  );
};

export const useScenarioHistoryQuery = ({
  scenarioId,
  projectId,
  envId,
  queryParams,
} = {}) => {
  return useQuery(
    ["SCENARIO_HISTORY", { scenarioId, projectId, envId }],
    () => {
      return scenarioService.getHistory({ scenarioId, projectId, envId });
    },
    queryParams
  );
};

export const useScenarioRevertCommitMutation = (mutationSettings) => {
  return useMutation(
    ({ data, envId }) =>
      scenarioService.revertCommit({
        data,
        projectId: mutationSettings.projectId,
        envId,
      }),
    mutationSettings
  );
};

export const useScenarioVersionSelectMutation = (mutationSettings) => {
  return useMutation(({ scenarioId, data, envId }) => {
    return scenarioService.selectVersion({
      scenarioId,
      data,
      projectId: mutationSettings.projectId,
      envId,
    });
  }, mutationSettings);
};

export default scenarioService;
