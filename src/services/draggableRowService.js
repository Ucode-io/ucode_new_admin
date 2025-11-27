import requestV2 from "../utils/requestV2";

const draggableRowService = {
  update: (tableSlug, data) =>
    requestV2.put(`/items/update-row/${tableSlug}`, data),
};

export default draggableRowService;
