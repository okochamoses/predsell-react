import jwt from "jsonwebtoken";

const isUserAuthenticated = () => {
  return !!sessionStorage.getItem("accessToken");
};

/**
 * Returns the logged in user
 */
const getLoggedInUser = () => {
  const token = sessionStorage.getItem("accessToken");
  const userObj = jwt.decode(token);
  // console.log("ACCESS OBJ", userObj);
  // userObj.role = "EXCHANGER";
  console.log(userObj)
  return userObj;
};

const getUserType = () => {
  return getLoggedInUser().role;
}

const removeToken = () => {
  sessionStorage.removeItem("accessToken");
  sessionStorage.removeItem("rToken");
};

export { isUserAuthenticated, getLoggedInUser, removeToken, getUserType };
