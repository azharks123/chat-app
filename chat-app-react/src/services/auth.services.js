import { CONST } from '../utils/constants';

export const getUserToken = () => {
  let userToken = localStorage.getItem(CONST.TOKEN);
  return userToken;
};
