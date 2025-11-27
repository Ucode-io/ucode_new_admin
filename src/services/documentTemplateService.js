import request from "../utils/request";
import requestV2 from "../utils/requestV2";

const documentTemplateService = {
  getList: (params) => request.get("/html-template", { params }),
  update: (data) => request.put("/html-template", data),
  create: (data) => request.post("/html-template", data),
  delete: (id) => request.delete(`/html-template/${id}`),
  exportToPDF: (data, tableSlug) => requestV2.post(`/utils/export/${tableSlug}/html-to-pdf`, data),
  exportToHTML: (data, tableSlug) => requestV2.post(`/utils/export/${tableSlug}/template-to-html`, data),
};

export default documentTemplateService;
