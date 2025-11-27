import requestV2 from "../utils/requestV2";

const layoutService = {
  getList: (params, tableSlug) => requestV2.get(`/collections/${tableSlug}/layout`, { params }),
  update: (data, tableSlug) => requestV2.put(`/collections/${tableSlug}/layout`, data),
  getLayout: (tableSlug, menuId, params) => requestV2.get(`/collections/${tableSlug}/layout/${menuId}`, { params }),
  remove: (tableSlug, id) => requestV2.delete(`/collections/${tableSlug}/layout/${id}`),
};

export default layoutService;
