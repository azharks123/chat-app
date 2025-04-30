import { CONST } from '../utils/constants';
import apiGateway from './axiosClient';

export const login = (credential) => {
  return apiGateway.post(`/token/`, credential);
};

export const logout = (refresh = localStorage.getItem(CONST.REFRESH)) => {
  return apiGateway.post(`/logout/`, {refresh});
};

export const register = (credential) => {
  return apiGateway.post(`users/register/`, credential);
};

export const getUserList = (username='') => {
  return apiGateway.get(`users/user/?search=${username}`);
};

export const deleteUser = (userId) => {
  console.log("calling delete");
  
  return apiGateway.delete(`users/user/${userId}/`);
};