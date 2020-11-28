import { post, get } from "./api";

export const getProfile = async () => {
  try {
    return await get("/users/profile");
  } catch (e) {
    console.log(e);
    return null;
  }
};

export const searchTransactions = async (startDate, endDate) => {
  try {
    return await post("/users/transactions", { startDate, endDate });
  } catch (e) {
    console.log(e);
    return null;
  }
};

export const getAllUsers = async () => {
  try {
    return await get("/users", {});
  } catch (e) {
    console.log(e);
    return null;
  }
};
