import { post } from "./api";

export const userLogin = async (email, password) => {
  try {
    return await post("/auth/login/user", { email, password });
  } catch (e) {
    console.log(e);
    return null;
  }
};

export const userLogin2FA = async (key, code) => {
  try {
    return await post("/auth/login/user/2fa", { key, code });
  } catch (e) {
    console.log(e);
    return null;
  }
};

export const userRegisteration = async (firstName, lastName, email, password, phoneNumber, referralCode, username) => {
  try {
    return await post("/auth/register/user", { firstName, lastName, email, password, phoneNumber, referralCode, username });
  } catch (e) {
    console.log(e);
    return null;
  }
};

export const changePassword = async (oldPassword, newPassword) => {
  try {
    return await post("/auth/change-password/user", {oldPassword, newPassword});
  } catch (e) {
    console.log(e);
    return null;
  }
};

export const toggle2fa = async (password) => {
  try {
    return await post("/auth/toggle-2fa/user", {password});
  } catch (e) {
    console.log(e);
    return null;
  }
};

export const verifyPagaPhoneNumber = async (phoneNumber) => {
  try {
    return await post("/auth/register/verify-phone", {phoneNumber});
  } catch (e) {
    console.log(e);
    return null;
  }
};
