import { useQuery } from "react-query";
import httpRequestLogin from "../utils/httpRequestLogin";




const loginMicrofrontendService = {
  get: (params) => httpRequestLogin.get('v1/login-microfront', { params })
}

export const useLoginMicrofrontendQuery = ({ params = {}, queryParams }) => {
  
  return useQuery(["GET_LOGIN_MICROFRONTEND", params], () => {
    return loginMicrofrontendService.get(params)
  }, queryParams)
}