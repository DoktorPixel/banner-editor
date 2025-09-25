// src/api/feedApiClient.ts
import axios from "axios";
import { getToken } from "../utils/supabaseClient";

export const API_FEED_URL = `${
  import.meta.env.VITE_SUPABASE_URL
}/functions/v1/feed-proxy`;

export const feedApiClient = axios.create({
  baseURL: API_FEED_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

feedApiClient.interceptors.request.use(async (config) => {
  const token = await getToken();
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
