import request from "../utils/request";
import requestV2 from "../utils/requestV2";

const constructorViewService = {
  getList: (tableSlug, params) =>
    requestV2.get(`/views/${tableSlug}`, {params}),
  update: (tableSlug, data) => {
    return requestV2.put(`/views/${tableSlug}`, data);
  },
  create: (tableSlug, data) => requestV2.post(`/views/${tableSlug}`, data),
  getById: (id, tableSlug) => requestV2.get(`/views/${tableSlug}/${id}`),
  delete: (id, tableSlug) => requestV2.delete(`/views/${tableSlug}/${id}`),
  changeViewOrder: (data, tableSlug) =>
    requestV2.put(`/views/${tableSlug}/update-order`, data),
};

export default constructorViewService;
