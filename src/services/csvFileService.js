import requestV2 from "../utils/requestV2";

const csvFileService = {
  downloadCsv: (table_slug, data) =>
    requestV2.post(`/csv/${table_slug}/download`, data),
};

export default csvFileService;
