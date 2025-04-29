// import Cookies from 'js-cookie';
// import jwt_decode from 'jwt-decode';
// import { useNavigate } from 'react-router-dom';
// import { useEffect } from 'react';
// import { ROUTES } from '../utls/router';
import { CONST } from '../utils/constants';
// import { logoutAPI } from '../api/api';

export const getUserToken = () => {
  let userToken = localStorage.getItem(CONST.TOKEN);
  return userToken;
};
// export const decodeToken = (token) => {
//   try {
//     if (token && token.length > 0) {
//       let decoded = jwt_decode(token);
//       const { exp, is_admin, full_name, uuid, image_url, email, role } = decoded;
//       Cookies.set(CONST.IS_ADMIN, is_admin);
//       localStorage.setItem(CONST.USER_UUID, uuid);
//       return { exp, full_name, uuid, image_url, email, role };
//     } else {
//       return {};
//     }
//   } catch (error) {
//     return {};
//   }
// };

// export const isAccessTokenExpired = (userToken) => {
//   let decoded = decodeToken(userToken);
//   let hasExpired = false;
//   try {
//     const { exp } = decoded;
//     if (exp) {
//       hasExpired = exp * 1000 < Date.now();
//     } else {
//       hasExpired = true;
//     }
//   } catch (error) {
//     hasExpired = true;
//   }
//   return hasExpired;
// };

// export const AuthVerifyByStatus = () => {
//   function ComponentAuthVerifyByStatus(props) {
//     let navigate = useNavigate();
//     useEffect(() => {
//       logout(navigate);
//     }, []);
//   }
//   return ComponentAuthVerifyByStatus;
// };

// export const deleteCooke = () => {
//   localStorage.removeItem(CONST.USER_PERMISSIONS);
//   localStorage.removeItem(CONST.USER_MENUS);
//   localStorage.removeItem(CONST.TOKEN);
//   localStorage.removeItem(CONST.PERMISSION_MODAL_UUID);
//   localStorage.removeItem(CONST.USER_UUID);
//   localStorage.removeItem(CONST.ROLE_MODAL_UUID);
//   localStorage.removeItem(CONST.LabelListView);
//   Cookies.remove(CONST.IS_ADMIN);
// };

// export const getUserName = () => {
//   const userToken = getUserToken();
//   let decoded = decodeToken(userToken);
//   const { full_name } = decoded;
//   return full_name;
// };

// export const getUuid = () => {
//   const userToken = getUserToken();
//   let decoded = decodeToken(userToken);
//   let { uuid } = decoded;
//   return uuid;
// };

// export const getLogedInUserDetails = () => {
//   const userToken = getUserToken();
//   return decodeToken(userToken);
// };

// export const logout = () => {
//   const uuid = getUuid();
//   const token = localStorage.getItem(CONST.TOKEN);
//   const logoutPayload = {
//     'token': token,
//     'uuid': uuid
//   }

//   if (uuid) {
//     logoutAPI(logoutPayload)
//     .then(() => {
//       window.location.replace(ROUTES.LOGIN)
//       deleteCooke();
//     })
//     .catch(() => { })
//     .finally(() => {
//       window.location.replace(ROUTES.LOGIN)
//       deleteCooke();
//      });
//   } else {
//     window.location.replace(ROUTES.LOGIN)
//     deleteCooke();
//   }

  
// };

// export const getUuid = (token) => {
//   try {
//     if (token && token.length > 0) {
//       let decoded = jwt_decode(token);
//       const { exp, is_admin, uuid } = decoded;
//       Cookies.set('is_admin', is_admin);
//       return { exp, uuid };
//     } else {
//       return {};
//     }
//   } catch (error) {
//     return {};
//   }
// };
