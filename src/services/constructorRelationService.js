import { useQuery } from "react-query";
import requestV2 from "../utils/requestV2";

const constructorRelationService = {
  getList: (params, tableSlug) => requestV2.get(`/relations/${tableSlug}`, { params }),
  update: (data, tableSlug) => requestV2.put(`/relations/${tableSlug}`, data),
  create: (data, tableSlug) => requestV2.post(`/relations/${tableSlug}`, data),
  delete: (id, tableSlug) => requestV2.delete(`/relations/${tableSlug}/${id}`),
};

export const useRelationsListQuery = ({ params = {}, headers, queryParams, tableSlug } = {}) => {
  return useQuery(
    ["RELATIONS", params],
    () => {
      return constructorRelationService.getList(params, headers, tableSlug);
    },
    queryParams
  );
};

export default constructorRelationService;
