import axios from "axios";
import { useCallback } from "react";
import { getToken } from "./supabaseClient";
import { compressImage } from "./compressImage";

const SUPABASE_IMAGE_API =
  "https://tgitxrjsbuimawihmkth.supabase.co/functions/v1/images";

export interface SupabaseImageItem {
  id: string;
  file_url: string;
  object_id?: string;
  template_id?: string;
  user_id?: string;
  created_at?: string;
  name?: string;
}
export const useSupabaseImages = () => {
  const uploadImage = useCallback(
    async (
      file: File,
      templateId: string,
      compress: boolean = true
    ): Promise<SupabaseImageItem> => {
      const token = await getToken();

      const fileToUpload = compress
        ? await compressImage(file, {
            maxSizeMB: 0.512,
            maxWidthOrHeight: 1600,
            useWebWorker: true,
          })
        : file;

      const formData = new FormData();
      formData.append("file", fileToUpload);

      const url = `${SUPABASE_IMAGE_API}?template_id=${encodeURIComponent(
        templateId
      )}`;

      const response = await axios.post(url, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    },
    []
  );

  const uploadDynamicImage = useCallback(
    async (
      file: File,
      templateId: string,
      objectId: string,
      compress: boolean = true
    ): Promise<SupabaseImageItem> => {
      const token = await getToken();

      const fileToUpload = compress
        ? await compressImage(file, {
            maxSizeMB: 0.01,
            maxWidthOrHeight: 512,
            useWebWorker: true,
          })
        : file;

      const formData = new FormData();
      formData.append("file", fileToUpload);

      const url = `${SUPABASE_IMAGE_API}?template_id=${encodeURIComponent(
        templateId
      )}&object_id=${encodeURIComponent(objectId)}`;

      const response = await axios.post(url, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    },
    []
  );

  const addCacheBuster = (url: string) => `${url}?v=${Date.now()}`;

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

      return response.data.map((img: SupabaseImageItem) => ({
        ...img,
        file_url: addCacheBuster(img.file_url),
      }));
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
  }, []);

  const getDynamicImages = useCallback(
    async (
      templateId: string,
      objectId: string
    ): Promise<SupabaseImageItem[]> => {
      const token = await getToken();

      const response = await axios.get(SUPABASE_IMAGE_API, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          template_id: templateId,
          object_id: objectId,
        },
      });
      return response.data.map((img: SupabaseImageItem) => ({
        ...img,
        file_url: addCacheBuster(img.file_url),
      }));
    },
    []
  );

  const deleteDynamicImage = useCallback(
    async (id: string, objectId: string): Promise<void> => {
      const token = await getToken();

      await axios.delete(SUPABASE_IMAGE_API, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          id,
          object_id: objectId,
        },
      });
    },
    []
  );

  return {
    uploadImage,
    getImages,
    deleteImage,
    uploadDynamicImage,
    getDynamicImages,
    deleteDynamicImage,
  };
};
