import axios from "axios";

export const localUrl = "http://localhost:5050";
export const productionUrl = "https://chat-app-sn3m.onrender.com";

const baseUrl = axios.create({
  baseURL: `${
    process.env.NODE_ENV === "production" ? productionUrl : localUrl
  }/api/v1`,
  headers: {
    "Content-type": "application/json",
    ...(typeof window !== "undefined" &&
      localStorage.getItem("chat-app-token") && {
        Authorization: `Bearer ${localStorage.getItem("chat-app-token")}`,
      }),
  },
});

axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    window.alert(error.response.data.message);
    console.log(error.response.data.message);
    return error;
  }
);

export default baseUrl;
