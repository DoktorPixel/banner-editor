import axios from "axios";
import { useCallback } from "react";
import { ProjectData } from "../types";

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
  // const createProject = useCallback(
  //   async (name: string, data?: ProjectData): Promise<Project> => {
  //     const response = await axios.post(`${API_BASE}/Project/create`, {
  //       name,
  //       templateConfig: data ? JSON.stringify(data) : "{}",
  //       templateHtml: "<div></div>",
  //     });
  //     return response.data;
  //   },
  //   []
  // );

  const createProject = useCallback(
    async (name: string, data?: ProjectData): Promise<Project> => {
      const requestBody = {
        name,
        templateConfig: JSON.stringify({
          objects: data?.objects || [],
          dynamicImgs: data?.dynamicImgs || [],
          config: data?.config || {},
        }),
        templateHtml: "<div></div>",
      };

      console.log("📤 Sending createProject request:", requestBody);

      const response = await axios.post(
        `${API_BASE}/Project/create`,
        requestBody,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    },
    []
  );

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
