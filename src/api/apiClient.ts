// apiClient.ts
import axios from "axios";
import { getToken } from "../utils/supabaseClient";

export const API_BASE_URL = `${
  import.meta.env.VITE_SUPABASE_URL
}/functions/v1/templates`;

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

apiClient.interceptors.request.use(async (config) => {
  const token = await getToken();
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// export const apiClient  = axios.create({
//   baseURL: API_BASE_URL,
//   headers: {
//     Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_TEMP_ACCESS_TOKEN}`,
//   },
// });
