import axios from "axios";
import { ProjectData } from "../types";

const API_BASE_URL = "https://api.feededify.app/client";

export const syncProjectWithFeededify = async (
  projectName: string,
  data: ProjectData
) => {
  try {
    // Проверка данных
    if (!data || !data.objects || !Array.isArray(data.objects)) {
      throw new Error("Invalid ProjectData: objects must be a valid array");
    }

    // Получение списка проектов
    const response = await axios.get(`${API_BASE_URL}/Project`, {
      params: {
        skip: 0,
        count: 1000,
      },
      headers: {
        Accept: "application/json",
      },
    });

    const projects: { items: { id: string; name: string }[] } = response.data;

    // Поиск проекта
    let project = projects.items.find((p) => p.name === projectName);

    if (!project) {
      // Подготовка тела запроса
      const requestBody = {
        name: projectName,
        templateConfig: JSON.stringify({
          objects: data.objects || [],
          dynamicImgs: data.dynamicImgs || [],
          config: data.config || {},
        }),
        templateHtml: "<div></div>",
      };

      console.log("📤 Sending request to create project:", requestBody);

      // Создание нового проекта
      const createResponse = await axios.post(
        `${API_BASE_URL}/Project/create`,
        requestBody,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );

      project = createResponse.data;
      console.log("📁 Created new project:", project);
    } else {
      console.log("📁 Found existing project:", project);
    }

    console.log("✅ Synced project with Feededify, Data:", data);
    return project;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.error("❌ API Error Response:", error.response.data);
      console.error("❌ Status:", error.response.status);
      console.error("❌ Headers:", error.response.headers);
    }
    console.error("❌ Failed to sync project with Feededify:", error);
    throw error;
  }
};
