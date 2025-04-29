// import axios from 'axios';
import apiGateway from './axiosClient';
// import config from './config';
// import { CONST } from '../utls/constants';

export const login = (credential) => {
  return apiGateway.post(`/token/`, credential);
};

export const register = (credential) => {
  return apiGateway.post(`users/register/`, credential);
};

export const getUserList = (username='') => {
  return apiGateway.get(`users/get-user/?search=${username}`);
};