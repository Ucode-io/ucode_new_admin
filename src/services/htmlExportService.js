import { useMutation, useQuery } from "react-query";
import request from "../utils/request";

const htmlExportService = {
  generate: (data) =>
    request.post(`/html-to-pdfV2?project-id=${data.projectId}`, { ...data }),
  setVariable: (data) =>
    request.post(`/template-to-htmlV2?project-id=${data.projectId}`, {
      ...data,
    }),
};

export const usePdfGenerator = (mutationSettings) => {
  return useMutation(
    (data) => htmlExportService.generate(data),
    mutationSettings
  );
};

export const useSetVariable = (mutationSettings) => {
  return useMutation(
    (data) => htmlExportService.setVariable(data),
    mutationSettings
  );
};

export default htmlExportService;
