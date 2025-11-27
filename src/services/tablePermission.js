import request from "../utils/request";

const tablePermissionService = {
  getList: (params) => request.get(`/table-permission`, {params}),
  update: (data) => request.put(`/table-permission`, data),
}

export default tablePermissionService


