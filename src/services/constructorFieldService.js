import { useMutation, useQuery } from "react-query";
import request from "../utils/request";
import requestV2 from "../utils/requestV2";

const constructorFieldService = {
  getList: (params, tableSlug) =>
    requestV2.get(`/fields/${params.table_slug ?? tableSlug}`, { params }),
  getFieldPermission: ({ role_id, table_slug }) =>
    request.get(`field-permission/${role_id}/${table_slug}`),
  update: ({ data, tableSlug }) => requestV2.put(`/fields/${tableSlug}`, data),
  updateSearch: ({ data, tableSlug }) =>
    requestV2.put(`/fields/${tableSlug}/update-search`, data),
  create: ({ data, tableSlug }) => requestV2.post(`/fields/${tableSlug}`, data),
  delete: (id, tableSlug) => requestV2.delete(`/fields/${tableSlug}/${id}`),
};

export const useFieldsListQuery = ({
  params = {},
  tableSlug,
  queryParams,
} = {}) => {
  return useQuery(
    ["FIELDS", params],
    () => {
      return constructorFieldService.getList(params, tableSlug);
    },
    queryParams
  );
};

export const useFieldCreateMutation = (mutationSettings) => {
  return useMutation(
    ({ data, tableSlug }) =>
      constructorFieldService.create({ data, tableSlug }),
    mutationSettings
  );
};
export const useFieldUpdateMutation = (mutationSettings) => {
  return useMutation(
    ({ data, tableSlug }) =>
      constructorFieldService.update({ data, tableSlug }),
    mutationSettings
  );
};
export const useFieldSearchUpdateMutation = (mutationSettings) => {
  return useMutation(
    ({ data, tableSlug }) =>
      constructorFieldService.updateSearch({ data, tableSlug }),
    mutationSettings
  );
};

export default constructorFieldService;
