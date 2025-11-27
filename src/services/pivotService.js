import request from "../utils/request";

const pivotService = {
  

  dynamicReport: (data, params) => request.post(`/dynamic-report`, data, { params }),

  dynamicReportFormula: (params) =>
    request.get(`/dynamic-report-formula`, {
      params,
    }),

  getListPivotTemplateSetting: (params) =>
    request.get(`/get-pivot-template-setting`, {
      params,
    }),

  getByIdPivotTemplateSetting: (id) => request.get(`/get-pivot-template-setting/${id}`),

  deletePivotTemplate: ({ id, projectId }) =>
    request.delete(`/remove-pivot-template/${id}`, {
      params: { "project-id": projectId },
    }),

  savePivotTemplate: (data) => {
    return request.post(`/save-pivot-template`, data, {
      params: {
        "project-id": data.project_id,
      },
    });
  },

  upsertPivotTemplate: (data) =>
    request.put(`/upsert-pivot-template`, data, {
      params: {
        "project-id": data.project_id,
      },
    }),

  deleteReportSetting: (id) => request.delete(`/delete-report-setting/${id}`),

  getListReportSetting: (params) =>
    request.get(`/get-report-setting`, {
      params,
    }),

  getByIdReportSetting: (id) => request.get(`/get-report-setting/${id}`),

  upsertReportSetting: (data) =>
    request.put(`/upsert-report-setting`, data, {
      params: {
        "project-id": data.project_id,
      },
    }),
  getReportLink: (id, params) => request(`/export/dynamic-report/excel/${id}`, { params }),
};

export default pivotService;
