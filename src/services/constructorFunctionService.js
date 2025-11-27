import { useMutation } from "react-query";
import httpsRequestV2 from "../utils/httpsRequestV2";
import request from "../utils/request";

const constructorFunctionService = {
  getListV2: (params) => httpsRequestV2.get(`/function`, { params }),
  getList: (params) => request.get("/function", { params }),
  update: (data) => request.put("/function", data),
  create: (data) => request.post("/function", data),
  delete: (id, data) => request.delete(`/function/${id}`, data),
  invoke: (data, params) => request.post("/invoke_function", data, { params }),
};

export const useFunctionV1UpdateMutation = (mutationSettings) => {
  return useMutation(
    (data) => constructorFunctionService.update(data),
    mutationSettings
  );
};

export const useFunctionV1CreateMutation = (mutationSettings) => {
  return useMutation(
    (data) => constructorFunctionService.create(data),
    mutationSettings
  );
};

export default constructorFunctionService;
