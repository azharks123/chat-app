import axios from "axios";
import config from "./config";
import { getUserToken } from "../services/auth.services";
import { CONST } from "../utils/constants";
// import { ROUTES } from '../utls/router';

const apiGateway = axios.create({
  baseURL: config.apiserver,
});

apiGateway.interceptors.request.use(
  (config) => {
    const accessToken = getUserToken();
    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiGateway.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem(CONST.REFRESH);        
        if (refreshToken) {
          const res = await axios.post(`${config.apiserver}/token/refresh/`, {
            refresh: refreshToken,
          });
          
          const newAccessToken = res.data.access;
          localStorage.setItem(CONST.TOKEN, res?.data?.access);
          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
          return apiGateway(originalRequest);
        }
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        // localStorage.removeItem(CONST.REFRESH);
        // localStorage.removeItem(CONST.TOKEN);
        // window.location.href = "/login";
      }
    }
  }

  // if (error.response && error.response.status === 420) {
  //   return logout();
  // }

  // return Promise.reject(error);
  // }
);

export default apiGateway;
