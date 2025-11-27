import requestV2 from "../utils/requestV2";

const constructorFunctionServiceV2 = {
  getListV2: (function_path, data,  params) => requestV2.get(`/function/${function_path}`, { params }),
};

export default constructorFunctionServiceV2;
