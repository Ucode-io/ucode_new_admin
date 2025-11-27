import requestV2 from "../utils/requestV2";

const sendToGptService = {
  sendText: (data, params) => requestV2.post(`/send-to-gpt`, data, params),
};

export default sendToGptService;
