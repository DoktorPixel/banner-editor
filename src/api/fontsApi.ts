import axios from "axios";
import { getToken } from "../utils/supabaseClient";

export const FONTS_API_BASE_URL =
  "https://tgitxrjsbuimawihmkth.supabase.co/functions/v1/fonts";

export const fontsApiClient = axios.create({
  baseURL: FONTS_API_BASE_URL,
});

fontsApiClient.interceptors.request.use(async (config) => {
  const token = await getToken();
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
