// utils/useSyncProjectWithSupabase.ts
import { syncProjectWithSupabase } from "./syncProjectWithSupabase";
import { useBanner } from "../context/BannerContext";
import { ProjectData } from "../types";
import { useConfig } from "../context/ConfigContext";

export const useSyncProjectWithSupabase = () => {
  const { setCurrentProjectId } = useBanner();
  const { config } = useConfig();

  const sync = async (templateId: string, data: ProjectData) => {
    const template = await syncProjectWithSupabase(templateId, data, config);

    if (template?.id) {
      setCurrentProjectId(template.id);
      // console.log("Template id with Supabase:", template.id);
    } else {
      console.warn("Template not found or created.");
      setCurrentProjectId(null);
    }

    return template;
  };

  return { sync };
};
