import requestV2 from "../utils/requestV2";

const constructorCustomEventService = {
  getList: (params, tableSlug) => requestV2.get(`/collections/${tableSlug}/automation`, { params }),
  getById: (id, tableSlug) => requestV2.get(`/collections/${tableSlug}/automation/${id}`),
  update: (data, tableSlug) => requestV2.put(`/collections/${tableSlug}/automation`, data),
  create: (data, tableSlug) => requestV2.post(`/collections/${tableSlug}/automation`, data),
  delete: (id, data, tableSlug) => requestV2.delete(`/collections/${tableSlug}/automation/${id}`, data),
}

export default constructorCustomEventService;