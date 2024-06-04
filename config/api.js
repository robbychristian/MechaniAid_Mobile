import axios from "axios";

                              // IP           :port
export const DEV_URL = "http://192.168.254.190:8000/api/";

export const api = axios.create({
  baseURL: DEV_URL,
});
