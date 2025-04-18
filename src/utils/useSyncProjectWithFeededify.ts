import { syncProjectWithFeededify } from "./syncProjectWithFeededify";
import { useBanner } from "../context/BannerContext";
import { ProjectData } from "../types";

export const useSyncProjectWithFeededify = () => {
  const { setCurrentProjectId } = useBanner();

  const sync = async (projectName: string, data: ProjectData) => {
    const project = await syncProjectWithFeededify(projectName, data);

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
