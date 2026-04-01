// src/services/api.js
import axios from "axios";
import { backLogIn } from "../utils";
import useStoreAuth from "../zustand_store/storeAuth";

const API = axios.create({
  baseURL: import.meta.env.VITE_REACT_APP_SERVICE_URL,
  timeout: 10000,
  withCredentials: true,
});

API.defaults.headers.post["Content-Type"] = "application/json";
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = "Bearer " + token;
  }
  return config;
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

API.interceptors.response.use(
  (response) => response, // Trả về response nếu thành công
  async (error) => {
    const originalRequest = error.config;
    // Kiểm tra nếu lỗi 401 và request này chưa từng được thử lại
    if (
      error.response.status === 401 &&
      error.response.data.message === "TokenExpiredError" &&
      !originalRequest._retry
    ) {
      if (isRefreshing) {
        // Nếu đang trong quá trình refresh token, đẩy request này vào hàng đợi
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = "Bearer " + token;
            return API(originalRequest);
          })
          .catch(() => {
            backLogIn();
            new Promise((resolve, reject) => {
              reject(error);
            });
          });
      }
      originalRequest._retry = true;
      isRefreshing = true;
      return new Promise((resolve, reject) => {
        // Gọi API refresh token của Node.js backend
        API.post("/auth/refresh-token")
          .then(({ data: { data } }) => {
            console.log("data", data);
            const newToken = data.token;
            // cập nhật key permission vào zustand
            const encryptPermission = data.encryptPermission;
            useStoreAuth.getState().setPermissions(encryptPermission);

            localStorage.setItem("token", newToken);

            // Cập nhật token cho các request tiếp theo
            API.defaults.headers.common["Authorization"] = "Bearer " + newToken;
            originalRequest.headers["Authorization"] = "Bearer " + newToken;

            processQueue(null, newToken);
            resolve(API(originalRequest)); // Thực thi lại request hiện tại
          })
          .catch((err) => {
            processQueue(err, null);
            // Nếu refresh thất bại (vô hiệu), logout người dùng
            backLogIn();
            reject(error);
          })
          .finally(() => {
            isRefreshing = false;
          });
      });
    }
    if (error.response.status === 401) {
      backLogIn();
    }
    return new Promise((resolve, reject) => {
      reject(error);
    });
  },
);

export default API;
