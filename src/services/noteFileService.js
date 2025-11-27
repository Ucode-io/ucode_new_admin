import { useMutation } from "react-query";
import request from "../utils/request";

const noteFileService = {
  upload: (data) => request.post("/upload", data),
};

export const useUploadFileQuery = (mutationSettings) => {
  return useMutation((data) => noteFileService.upload(data), mutationSettings);
};

export default noteFileService;
