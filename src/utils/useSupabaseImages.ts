import axios from "axios";
import { useCallback } from "react";
import { getToken } from "./supabaseClient";
import { v4 as uuidv4 } from "uuid";
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
  name?: string; // Добавлено для поддержки имени изображения
}
export const useSupabaseImages = () => {
  // const uploadImage = useCallback(
  //   async (file: File, templateId: string): Promise<SupabaseImageItem> => {
  //     const token = await getToken();

  //     const formData = new FormData();
  //     formData.append("file", file); // Только файл, без template_id

  //     const url = `${SUPABASE_IMAGE_API}?template_id=${encodeURIComponent(
  //       templateId
  //     )}`;

  //     const response = await axios.post(url, formData, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });

  //     console.log("✅ Image uploaded:", response.data);
  //     return response.data;
  //   },
  //   []
  // );

  // const uploadDynamicImage = useCallback(
  //   async (
  //     file: File,
  //     templateId: string,
  //     objectId?: string
  //   ): Promise<SupabaseImageItem> => {
  //     const token = await getToken();

  //     const formData = new FormData();
  //     formData.append("file", file);

  //     const finalObjectId = objectId ?? uuidv4();
  //     const url = `${SUPABASE_IMAGE_API}?template_id=${encodeURIComponent(
  //       templateId
  //     )}&object_id=${encodeURIComponent(finalObjectId)}`;

  //     const response = await axios.post(url, formData, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });

  //     console.log("✅ Image uploaded:", response.data);
  //     return response.data;
  //   },
  //   []
  // );

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
            // fileType: file.type,
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

      // console.log("✅ Image uploaded:", response.data);
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
            // fileType: "image/webp",
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

      // console.log("✅ Dynamic image uploaded:", response.data);
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

      // console.log("📦 Retrieved images:", response.data);
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

    // console.log("🗑️ Deleted image with id:", id);
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
          // object_id: "6820ac12-1377-4541-9812-160f7464fe6c",
          // object_id: "ca93c64d-3ce8-4697-b736-762f7998a2c1",
        },
      });

      // console.log("Retrieved Dynamic images:", response.data);
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
          // object_id: "6820ac12-1377-4541-9812-160f7464fe6c",
        },
      });

      // console.log("🗑️ Deleted dynamic image:", id);
    },
    []
  );

  return {
    uploadImage,
    getImages,
    deleteImage,
    generateObjectId: uuidv4,
    uploadDynamicImage,
    getDynamicImages,
    deleteDynamicImage,
  };
};
