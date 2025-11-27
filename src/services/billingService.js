import request from "../utils/request";
import requestNoProject from "../utils/requestNoProject";
import requestV2 from "../utils/requestV2";

const billingService = {
  getList: (id) => request.get(`/fare/${id}`),
  getTransactionList: (params) =>
    requestNoProject.get("/transaction", {params}),
  fillBalance: (data) => request.post("/transaction", data),
  paymentStatusUpdate: (data) => request.put("/transaction", data),
  getFaresList: () => request.get("/fare"),
  makeDateProject: (data) => request.put("/subscription", data),
  createTransaction: (data) => request.post("/transaction", data),
};

export default billingService;
