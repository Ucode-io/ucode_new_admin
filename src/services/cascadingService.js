import request from "../utils/request";
import requestV2 from "../utils/requestV2";

const cascadingService = {
  getList: ({ table_slug }) => requestV2.get(`/relations/${table_slug}/cascading`),
};

export default cascadingService;
