import { compressImage } from "./compressImage";
import { imageApiClient } from "../api/imageApiClient";
import { SupabaseImageItem } from "../types";

const addCacheBuster = (url: string) => `${url}?v=${Date.now()}`;

export const uploadImage = async (
  file: File,
  templateId: string,
  objectId?: string,
  compress: boolean = true
): Promise<SupabaseImageItem> => {
  const compressionSettings = objectId
    ? { maxSizeMB: 0.05, maxWidthOrHeight: 512 }
    : { maxSizeMB: 1, maxWidthOrHeight: 1600 };

  const fileToUpload = compress
    ? await compressImage(file, { ...compressionSettings, useWebWorker: true })
    : file;

  const formData = new FormData();
  formData.append("file", fileToUpload);

  const params = new URLSearchParams({ template_id: templateId });
  if (objectId) {
    params.append("object_id", objectId);
  }

  const response = await imageApiClient.post(`?${params.toString()}`, formData);
  return response.data;
};

export const getImages = async (
  templateId: string,
  objectId?: string
): Promise<SupabaseImageItem[]> => {
  const params = new URLSearchParams({ template_id: templateId });
  if (objectId) {
    params.append("object_id", objectId);
  }

  const response = await imageApiClient.get(`?${params.toString()}`);
  return response.data.map((img: SupabaseImageItem) => ({
    ...img,
    file_url: addCacheBuster(img.file_url),
  }));
};

export const deleteImage = async (
  id: string,
  objectId?: string
): Promise<void> => {
  const params = new URLSearchParams({ id });
  if (objectId) {
    params.append("object_id", objectId);
  }
  await imageApiClient.delete(`?${params.toString()}`);
};
