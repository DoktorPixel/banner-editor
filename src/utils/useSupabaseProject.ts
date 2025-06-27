import { useCallback, useState } from "react";
import axios from "axios";
import { ProjectData, ConfigItem, BannerObject, DynamicImg } from "../types";
// import { ExportToHTML_3 } from "../components/UI/export-components/ExportToHTML_3";
import { ExportToHTML_5 } from "../components/UI/export-components/ExportToHTML_5";
import { getToken } from "./supabaseClient";

const API_BASE_URL =
  "https://tgitxrjsbuimawihmkth.supabase.co/functions/v1/templates";

export const useSupabaseProject = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<null | string>(null);

  const getProject = useCallback(async (templateId: string) => {
    setLoading(true);
    setError(null);
    try {
      const token = await getToken();
      const response = await axios.get(`${API_BASE_URL}?id=${templateId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
      return response.data;
    } catch (err: unknown) {
      console.error("❌ Failed to load project:", err);
      setError("Failed to load project.");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProject = useCallback(
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
        const token = await getToken();
        // const html = ExportToHTML_3(data.objects, config);
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

        await axios.put(`${API_BASE_URL}/update`, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        return true;
      } catch (err: unknown) {
        console.error("❌ Failed to update project:", err);
        setError("Failed to update project.");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const publishProject = useCallback(async (templateId: string) => {
    setLoading(true);
    setError(null);
    try {
      const token = await getToken();

      await axios.post(`${API_BASE_URL}/publish?id=${templateId}`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return true;
    } catch (err: unknown) {
      console.error("❌ Failed to publish project:", err);
      setError("Failed to publish project.");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    getProject,
    updateProject,
    publishProject,
    loading,
    error,
  };
};
