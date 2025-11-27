import { useQuery } from "react-query";
import requestV3 from "../utils/requestV3";

const chatService = {
  getList: (headers, params) => requestV3.get(`/chat`, { headers, params }),
  getByID: (id) => requestV3.get(`/chat/${id}`),
};

export const useChatListQuery = ({
  headers = {},
  params = {},
  queryParams,
} = {}) => {
  return useQuery(
    ["CHAT_LIST", { ...headers, ...params }],
    () => {
      return chatService.getList(headers, params);
    },
    queryParams
  );
};

export const useChatGetByIdQuery = ({ headers = {}, id, queryParams }) => {
  return useQuery(
    ["CHAT_BY_ID", { id, ...headers }],
    () => {
      return chatService.getByID(id);
    },
    queryParams
  );
};

export default chatService;
