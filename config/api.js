import axios from "axios";

                              // IP           :port
export const DEV_URL = "http://192.168.1.13:8000/api/";
export const PROD_URL = "https://mechaniaid.com/api/";

export const api = axios.create({
  baseURL: PROD_URL,
});
