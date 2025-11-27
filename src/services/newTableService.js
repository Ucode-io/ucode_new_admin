import requestV2 from "../utils/requestV2";

const newTableService = {
  getFolderList: (params) => requestV2.get("/folder-group", {params}),
  createFolder: (data) => requestV2.post("/folder-group", data),
  deleteFolder: (id) => requestV2.delete(`/folder-group/${id}`),
};

export default newTableService;
