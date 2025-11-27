import requestV2 from "../utils/requestV2";

const versionService = {
  getVersonsList: (params) => requestV2.get(`/version`, {params}),
  create: (data, params) => requestV2.post(`/version`, data, {params}),
  publish: (data) => requestV2.post("/version/publish", data),
};

export default versionService;
