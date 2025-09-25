import axios from "axios";
import { getToken } from "../utils/supabaseClient";

export const API_IMAGE_URL = `${
  import.meta.env.VITE_SUPABASE_URL
}/functions/v1/images`;

// export const imageApiClient = axios.create({
//   baseURL: API_IMAGE_URL,
//   headers: {
//     Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_TEMP_ACCESS_TOKEN}`,
//   },
// });

export const imageApiClient = axios.create({
  baseURL: API_IMAGE_URL,
});

imageApiClient.interceptors.request.use(async (config) => {
  const token = await getToken();
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
