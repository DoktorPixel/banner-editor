import axios from "axios";
import { getToken } from "../utils/supabaseClient";
export const API_BASE_URL = "https://tgitxrjsbuimawihmkth.supabase.co/functions/v1/templates";
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
