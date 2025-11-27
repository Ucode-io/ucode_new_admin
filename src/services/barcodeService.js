import request from "../utils/request";

const barcodeService = {
  getNumber: (table_slug) => request.get(`/barcode-generator/${table_slug}`,),
  getCodebar: (table_slug, field_id) => request.get(`/code-generator/${table_slug}/${field_id}`,),
}

export default barcodeService;