import axios from "axios";
import { ProjectData } from "../types";
import { ExportToHTML_3 } from "../components/UI/export-components/ExportToHTML_3";
import { ConfigItem } from "../types";
import { getToken } from "./supabaseClient";

const API_BASE_URL =
  "https://tgitxrjsbuimawihmkth.supabase.co/functions/v1/templates";

export const syncProjectWithSupabase = async (
  templateName: string,
  data: ProjectData,
  config: ConfigItem
) => {
  try {
    if (!data || !Array.isArray(data.objects)) {
      throw new Error("Invalid ProjectData: objects must be a valid array");
    }

    const htmlString = ExportToHTML_3(data.objects, config);
    const token = await getToken();

    let template = null;

    try {
      // Получаем шаблон по имени
      const response = await axios.get(
        `${API_BASE_URL}?name=${encodeURIComponent(templateName)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );
      template = response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        console.warn("⚠️ Template not found");

        // === логика создания нового шаблона ===
        /*
        const newTemplateId = crypto.randomUUID();
        template = {
          id: newTemplateId,
          html_dev: htmlString,
          config_dev: JSON.stringify({
            objects: data.objects || [],
            dynamicImgs: data.dynamicImgs || [],
            config: data.config || {},
          }),
          // name: templateName,
          // project_id: "default_project",
        };

        console.log("📁 Creating new template:", template);

        await axios.put(`${API_BASE_URL}/update`, template, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        console.log("✅ New template created:", template);
        return template;
        */

        // Если создание запрещено — выбрасываем ошибку
        throw new Error(
          "Template not found. Creating new templates is not allowed."
        );
      } else {
        throw error;
      }
    }

    // Обновляем существующий шаблон
    template.html_dev = htmlString;
    template.config_dev = JSON.stringify({
      objects: data.objects || [],
      dynamicImgs: data.dynamicImgs || [],
      config: data.config || {},
    });

    // console.log("📦 Updating template:", template);

    await axios.put(`${API_BASE_URL}/update`, template, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    console.log("✅ Template successfully updated:", template);
    return template;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.error("❌ API Error Response:", error.response.data);
      console.error("❌ Status:", error.response.status);
      console.error("❌ Headers:", error.response.headers);
      console.error("❌ Request Data:", error.config?.data);
    }
    console.error("❌ Failed to sync template with Supabase:", error);
    throw error;
  }
};
