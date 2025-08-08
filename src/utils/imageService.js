import { compressImage } from "./compressImage";
import { imageApiClient } from "../api/imageApiClient";
const addCacheBuster = (url) => `${url}?v=${Date.now()}`;
export const uploadImage = async (file, templateId, objectId, compress = true) => {
    const compressionSettings = objectId
        ? { maxSizeMB: 0.01, maxWidthOrHeight: 512 }
        : { maxSizeMB: 0.512, maxWidthOrHeight: 1600 };
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
export const getImages = async (templateId, objectId) => {
    const params = new URLSearchParams({ template_id: templateId });
    if (objectId) {
        params.append("object_id", objectId);
    }
    const response = await imageApiClient.get(`?${params.toString()}`);
    return response.data.map((img) => ({
        ...img,
        file_url: addCacheBuster(img.file_url),
    }));
};
export const deleteImage = async (id, objectId) => {
    const params = new URLSearchParams({ id });
    if (objectId) {
        params.append("object_id", objectId);
    }
    await imageApiClient.delete(`?${params.toString()}`);
};
