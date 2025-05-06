import { syncProjectWithFeededify } from "./syncProjectWithFeededify";
import { useBanner } from "../context/BannerContext";
import { ProjectData } from "../types";
import { useConfig } from "../context/ConfigContext";

export const useSyncProjectWithFeededify = () => {
  const { setCurrentProjectId } = useBanner();
  const { config } = useConfig();

  const sync = async (projectName: string, data: ProjectData) => {
    const project = await syncProjectWithFeededify(projectName, data, config);

    if (project?.id) {
      setCurrentProjectId(project.id);
    } else {
      console.warn("Project not found or created.");
      setCurrentProjectId(null);
    }

    return project;
  };

  return { sync };
};
