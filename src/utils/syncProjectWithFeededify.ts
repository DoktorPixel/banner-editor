import axios from "axios";
import { ProjectData } from "../types";

const API_BASE_URL = "https://api.feededify.app/client";

export const syncProjectWithFeededify = async (
  projectName: string,
  data: ProjectData
) => {
  try {
    // Projec list
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
    // console.log("📁 Projects list:", projects);

    // Project search
    let project = projects.items.find((p) => p.name === projectName);

    //
    if (!project) {
      const createResponse = await axios.post(
        `${API_BASE_URL}/Project/create`,
        { name: projectName },
        {
          headers: {
            Accept: "application/json",
          },
        }
      );

      project = createResponse.data;
      console.log("📁 Created new project:", project);
    } else {
      console.log("📁 Found existing project:", project);
    }

    //  ProjectData loading
    /*
    await axios.post(`${API_BASE_URL}/Project/addObject`, {
      projectId: project.id,
      objects: data.objects,
      config: data.config || [],
    });
    */

    console.log("✅ Synced project with Feededify (name only), Data:", data);
    return project;
  } catch (error) {
    console.error("❌ Failed to sync project with Feededify:", error);
    throw error;
  }
};
