import { useQuery, useMutation } from "@tanstack/react-query";
import { apiClient } from "../api/apiClient";
import { ExportToHTML } from "../components/UI/export-components/ExportToHTML";
export const useSupabaseProject = () => {
    const updateProject = useMutation({
        mutationFn: async ({ templateId, data, config, objects, dynamicImgs, }) => {
            const html = ExportToHTML(objects, config, dynamicImgs);
            const payload = {
                id: templateId,
                html_dev: html,
                config_dev: JSON.stringify({
                    objects: data.objects,
                    dynamicImgs: data.dynamicImgs || [],
                    config,
                }),
            };
            await apiClient.put("/update", payload);
            return true;
        },
    });
    const publishProject = useMutation({
        mutationFn: async (templateId) => {
            await apiClient.post(`/publish?id=${templateId}`, null);
            return true;
        },
    });
    const deployTemplate = useMutation({
        mutationFn: async (templateId) => {
            await apiClient.post(`/deploy?template_id=${templateId}`, {});
            return true;
        },
    });
    return {
        updateProject,
        publishProject,
        deployTemplate,
    };
};
export const useProject = (templateId) => useQuery({
    queryKey: ["project", templateId],
    queryFn: async () => {
        const res = await apiClient.get(`?template_id=${templateId}`);
        return res.data;
    },
    enabled: !!templateId,
});
