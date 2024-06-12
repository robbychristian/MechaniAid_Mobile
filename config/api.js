import axios from "axios";

                              // IP           :port
export const DEV_URL = "http://10.0.2.2:8000/api/";
export const PROD_URL = "http://mechaniaid.com/api/";

export const api = axios.create({
  baseURL: PROD_URL,
});
