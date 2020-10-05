import axios from "axios";

const baseURL = "http://localhost:3000/api/v1";
// const baseURL = "https://secure-thicket-83876.herokuapp.com/api/v1";

const post = async (url, body, recursive = true) => {
  const keys = Object.keys(body);
  keys.forEach((key) => {
    const val = body[key];
    if (val === undefined || val === null || val === "") {
      delete body[key];
    }
  });

  console.log(body);

  let response;

  try {
    response = await axios.post(
      baseURL + url,
      { ...body },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: await getToken(),
        },
      }
    );
    response = response.data;
  } catch (error) {
    console.log(error);
    response = { code: 10, message: "There was an error connecting to the server" };
  }

  if (recursive && response.code === 20 && (await generateToken(getRefreshToken()))) {
    response = post(url, body, false);
  }

  console.log(response);
  return response;
};

const get = async (url, recursive = true) => {
  let response;
  try {
    response = await axios.get(baseURL + url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: await getToken(),
      },
    });
    response = response.data;
  } catch (error) {
    console.log(error);
    response = { code: 10, message: "There was an error connecting to the server" };
  }

  if (recursive && response.code === 20 && (await generateToken(getRefreshToken()))) {
    response = get(url, false);
  }

  console.log(response);
  return response;
};

const generateToken = async (refreshToken) => {
  try {
    const api = await axios.post(baseURL + "/auth/access-token/user", { refreshToken: refreshToken });
    if (api.data && api.data.code === 0) {
      // Save new access token
      setToken(api.data.data.accessToken);
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
};

const getToken = async () => {
  try {
    const value = await sessionStorage.getItem("accessToken");
    if (value !== null) {
      return value;
    }
  } catch (e) {
    console.log(e);
    return "emptyToken";
  }
};

const setToken = async (token) => {
  try {
    return sessionStorage.setItem("accessToken", token);
  } catch (e) {
    return null;
  }
};

const getRefreshToken = () => {
  return sessionStorage.getItem("rToken");
};

export { post, get };
