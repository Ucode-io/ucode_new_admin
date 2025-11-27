import requestV2 from "../utils/requestV2";

const erdService = {
  upload: (data, params) => requestV2.post(`/erd`, data, params),
};

export default erdService;
