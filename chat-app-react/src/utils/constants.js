import sha256 from "crypto-js/sha256";
import { logout } from "../api/api";

export const hashPassword = async (password) => {
  const hashedPassword = sha256(password).toString();
  return hashedPassword;
};

export const handleLogout = () => {
  logout()
    .then(() => {
      localStorage.clear();
    })
    .catch((err) => {
      console.error("Logout failed", err);
    });
  window.location.href = "/login";
};

export const CONST = {
  TOKEN: "token",
  REFRESH: "refresh",
  IS_ADMIN: "is_admin",
  USER_ID: "user_id",
  USER_NAME: "user_name",
  User_ROLE: "user_role",
};
