import request from "../utils/request";
import requestV2 from "../utils/requestV2";

const objectDocumentService = {
  getList: (params) => request.get("/document", { params }),
  update: (data) => request.put("/document", data),
  create: (data) => request.post("/document", data),
  delete: (id) => request.delete(`/document/${id}`),
  upload: (tableSlug, objectId, data) => requestV2.post(`/files/${tableSlug}/${objectId}`, data),
};

export default objectDocumentService;
