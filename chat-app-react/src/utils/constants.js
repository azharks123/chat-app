import sha256 from 'crypto-js/sha256';

export const hashPassword = async (password) => {
    const hashedPassword = sha256(password).toString();
    return hashedPassword;
  };

  export const CONST = {
    TOKEN: 'token',
    REFRESH: 'refresh',
    IS_ADMIN: 'is_admin',
    USER_ID: 'user_id',
    USER_NAME: 'user_name',
  }  