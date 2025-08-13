import axios from "axios";
import { toast } from "react-toastify";

const BASE_URL = "https://7bf01075000c.ngrok-free.app/students"; // ✅ Use .env for flexibility

export const APIS = {

  // testdata: "/api/apis/275",
  studentDetailsData:"/getAllStudents?page=2&size=10"
  // add more endpoints here...
};

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
});

// ✅ Response Interceptor
axiosInstance.interceptors.response.use(
  (res) => res,
  async (error) => {
    let errRes = error?.response?.data;
    let err = errRes?.message || "Bad Request";
    toast.error(err); // ✅ Web toast
    return Promise.reject(error);
  }
);

const Axios = async ({
  method,
  path,
  data,
  params,
  header,
  pathParams = "",
  isFormData = false,
}) => {
  // ✅ Get token directly from localStorage instead of store.getState()
  const accessToken = localStorage.getItem("accessToken");

  const authHeader = accessToken
    ? { Authorization: `Bearer ${accessToken}` }
    : {};

  const response = await axiosInstance({
    method,
    url: path + pathParams,
    data,
    params,
    headers: isFormData
      ? {
          "Content-Type": "multipart/form-data",
          ...authHeader,
          ...header,
        }
      : {
          "Content-Type": "application/json",
          ...authHeader,
          ...header,
        },
  });

  return response;
};

export default Axios;
