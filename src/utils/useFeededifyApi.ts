import axios from "axios";
import { useCallback } from "react";

const API_BASE = "https://api.feededify.app/client";

export interface Project {
  id: string;
  name: string;
}

export interface ImageItem {
  id: string;
  url: string;
}

export const useFeededifyApi = () => {
  const createProject = useCallback(async (name: string): Promise<Project> => {
    const response = await axios.post(`${API_BASE}/Project/create`, { name });
    return response.data;
  }, []);

  const getProjects = useCallback(async (): Promise<Project[]> => {
    const response = await axios.get(`${API_BASE}/Project`);
    return response.data.items;
  }, []);

  const uploadImage = useCallback(
    async (file: File, projectId: string): Promise<ImageItem> => {
      const formData = new FormData();
      formData.append("file", file);
      const response = await axios.post(
        `${API_BASE}/Image/create?projectId=${projectId}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      console.log("uploadImage Ответ от сервера:", response.data);
      return response.data;
    },
    []
  );

  const getImages = useCallback(
    async (projectId: string): Promise<ImageItem[]> => {
      const response = await axios.get(`${API_BASE}/Image`, {
        params: {
          projectId,
          skip: 0,
          count: 100,
        },
      });
      console.log("getImages Ответ от сервера:", response.data);
      return response.data.items;
    },
    []
  );

  const deleteImage = useCallback(async (id: string): Promise<void> => {
    await axios.post(`${API_BASE}/Image/delete`, null, { params: { id } });
  }, []);

  return {
    createProject,
    getProjects,
    uploadImage,
    getImages,
    deleteImage,
  };
};
