import { useCallback, useState } from "react";
import axios from "axios";
import { ProjectData, ConfigItem, BannerObject, DynamicImg } from "../types";
import { ExportToHTML_5 } from "../components/UI/export-components/ExportToHTML_5";

const API_KEY = "jessica2010";

const API_GET_TEMPLATE =
  "https://tgitxrjsbuimawihmkth.supabase.co/functions/v1/template-api";

const API_DEPLOY_TEMPLATE =
  "https://tgitxrjsbuimawihmkth.supabase.co/functions/v1/template-deploy";

export const useSupabaseTemplate = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<null | string>(null);

  // Получить шаблон
  const getTemplate = useCallback(async (templateId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_GET_TEMPLATE}?id=${templateId}`, {
        headers: {
          "X-API-Key": API_KEY,
          Accept: "application/json",
        },
      });
      return response.data; // возвращаем данные шаблона
    } catch (err: unknown) {
      console.error("❌ Failed to load template:", err);
      setError("Failed to load template.");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Обновить (dev) шаблон
  const updateTemplate = useCallback(
    async (
      templateId: string,
      data: ProjectData,
      config: ConfigItem,
      objects: BannerObject[],
      dynamicImgs: DynamicImg[]
    ) => {
      setLoading(true);
      setError(null);
      try {
        // Генерируем HTML из редактора
        const html = ExportToHTML_5(objects, config, dynamicImgs);

        const payload = {
          id: templateId,
          html_dev: html,
          config_dev: JSON.stringify({
            objects: data.objects,
            dynamicImgs: data.dynamicImgs || [],
            config,
          }),
        };

        await axios.put(
          "https://tgitxrjsbuimawihmkth.supabase.co/functions/v1/templates/update",
          payload,
          {
            headers: {
              "X-API-Key": API_KEY,
              "Content-Type": "application/json",
            },
          }
        );

        return true;
      } catch (err: unknown) {
        console.error("❌ Failed to update template:", err);
        setError("Failed to update template.");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Опубликовать (deploy)
  const deployTemplate = useCallback(async (templateId: string) => {
    setLoading(true);
    setError(null);
    try {
      const payload = {
        templateId, // в body
      };

      await axios.post(API_DEPLOY_TEMPLATE, payload, {
        headers: {
          "X-API-Key": API_KEY,
          "Content-Type": "application/json",
        },
      });

      return true;
    } catch (err: unknown) {
      console.error("❌ Failed to deploy template:", err);
      setError("Failed to deploy template.");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    getTemplate,
    updateTemplate,
    deployTemplate,
    loading,
    error,
  };
};
