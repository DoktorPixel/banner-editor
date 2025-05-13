import axios from "axios";
import { useCallback } from "react";
import { getToken } from "./supabaseClient";

const SUPABASE_IMAGE_API =
  "https://tgitxrjsbuimawihmkth.supabase.co/functions/v1/images";

export interface SupabaseImageItem {
  id: string;
  file_url: string;
}

export const useSupabaseImages = () => {
  const uploadImage = useCallback(
    async (file: File, templateId: string): Promise<SupabaseImageItem> => {
      const token = await getToken();
      console.log("🗝️ Token:", token);

      const formData = new FormData();
      formData.append("file", file); // Только файл, без template_id

      const url = `${SUPABASE_IMAGE_API}?template_id=${encodeURIComponent(
        templateId
      )}`;

      const response = await axios.post(url, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          // Не указываем Content-Type при использовании FormData — Axios сделает это сам
        },
      });

      console.log("✅ Image uploaded:", response.data);
      return response.data;
    },
    []
  );

  const getImages = useCallback(
    async (templateId: string): Promise<SupabaseImageItem[]> => {
      const token = await getToken();
      const response = await axios.get(SUPABASE_IMAGE_API, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          template_id: templateId,
        },
      });

      console.log("📦 Retrieved images:", response.data);
      return response.data;
    },
    []
  );

  const deleteImage = useCallback(async (id: string): Promise<void> => {
    const token = await getToken();
    await axios.delete(SUPABASE_IMAGE_API, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: { id },
    });
    console.log("🗑️ Deleted image with id:", id);
  }, []);

  return {
    uploadImage,
    getImages,
    deleteImage,
  };
};
