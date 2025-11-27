import { useMutation, useQuery } from "react-query";
import httpsRequestV2 from "../utils/httpsRequestV2";



const docxTemplateService = {
  getList: params => httpsRequestV2.get('/docx-template', { params }),
  getById: id => httpsRequestV2.get(`/docx-template/${id}`,),
  create: data => httpsRequestV2.post('/docx-template', data),
  udpate: data => httpsRequestV2.put('/docx-template', data),
  delete: id => httpsRequestV2.put(`/docx-template/${id}`),
  convertToPDF: ({data, link}) => httpsRequestV2.post('/docx-template/convert/pdf', data, { params: { link }, responseType: "blob" }),
  getVariables: (tableSlug) => httpsRequestV2.get(`/fields/${tableSlug}/with-relations`)
}

export const useDocxTemplatesQuery = ({ params, querySettings }) => {
  return useQuery(["DOCX_TEMPLATES", params], () => docxTemplateService.getList(params), querySettings)
}

export const useDocxTemplateByIdQuery = ({ id, querySettings }) => {
  return useQuery(["DOCX_TEMPLATE_BY_ID", {id}], () => docxTemplateService.getById(id), querySettings)
}

export const useDocxTemplateCreateMutation = (mutationSettings) => {
  return useMutation(docxTemplateService.create, mutationSettings)
}

export const useDocxTemplateUpdateMutation = (mutationSettings) => {
  return useMutation(docxTemplateService.udpate, mutationSettings)
}

export const useDocxTemplateDeleteMutation = (mutationSettings) => {
  return useMutation(docxTemplateService.delete, mutationSettings)
}


export const useDocxTemplateConvertToPDFMutation = (mutationSettings) => {
  return useMutation(docxTemplateService.convertToPDF, mutationSettings)
}

export const useDocxTemplateVariablesQuery = ({ tableSlug, querySettings }) => {
  return useQuery(["DOCX_TEMPLATES_VARIABLES", { tableSlug }], () => docxTemplateService.getVariables(tableSlug), querySettings)
}


export default docxTemplateService