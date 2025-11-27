import { useSelector } from "react-redux";
import request from "../utils/request";
const resourceVariableService = {
  getList: () => request.get('company/project/resource-variable') , 
  getById: (id) =>
    request.get(`/company/project/resource-variable/single`, {params: {id: id}}),
  createVariable: (data) => request.post('/company/project/resource-variable', data),
  update: (data) =>
    request.put(`company/project/resource-variable`, data),
  delete: (id) =>
    request.delete(`company/project/resource-variable/${id}`),
};

export default resourceVariableService;
