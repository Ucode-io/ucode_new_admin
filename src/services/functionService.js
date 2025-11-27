import { useMutation, useQuery } from "react-query";
import httpsRequestV2 from "../utils/httpsRequestV2";

const functionService = {
  getList: (params) =>
    httpsRequestV2.get("/function", {
      params,
    }),
  getById: (functionId) => httpsRequestV2.get(`/function/${functionId}`),
  update: (data) => httpsRequestV2.put("/function", data, {}),
  create: (data) => httpsRequestV2.post("/function", data, {}),
  delete: (functionId) => httpsRequestV2.delete(`/function/${functionId}`, {}),
};

export const useFunctionsListQuery = ({ params = {}, queryParams } = {}) => {
  return useQuery(
    ["FUNCTIONS", { params }],
    () => {
      return functionService.getList(params);
    },
    queryParams
  );
};

export const useFunctionByIdQuery = ({ functionId, queryParams } = {}) => {
  return useQuery(
    ["FUNCTION_BY_ID", { functionId }],
    () => {
      return functionService.getById(functionId);
    },
    queryParams
  );
};

export const useFunctionUpdateMutation = (mutationSettings) => {
  return useMutation((data) => functionService.update(data), mutationSettings);
};

export const useFunctionCreateMutation = (mutationSettings) => {
  return useMutation((data) => functionService.create(data), mutationSettings);
};

export const useFunctionDeleteMutation = (mutationSettings) => {
  return useMutation(
    (functionId) => functionService.delete(functionId),
    mutationSettings
  );
};

export default functionService;
