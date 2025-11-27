import requestV2 from "../utils/requestV2";

const menuSettingsService = {
  getList: (params) => requestV2.get("/menus", { params }),
  update: (data) => requestV2.put("/menus", data),
  create: (data) => requestV2.post("/menus", data),
  getById: (id) => requestV2.get(`/menus/${id}`),
  delete: (id) => requestV2.delete(`/menus/${id}`),
};

export default menuSettingsService;
