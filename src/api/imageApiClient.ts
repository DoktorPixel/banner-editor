import axios from "axios";
import { getToken } from "../utils/supabaseClient";

export const API_IMAGE_URL =
  "https://tgitxrjsbuimawihmkth.supabase.co/functions/v1/images";

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
