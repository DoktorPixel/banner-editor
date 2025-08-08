import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fontsApiClient } from "../api/fontsApi";
export const useFonts = (templateId) => {
    return useQuery({
        queryKey: ["fonts", templateId],
        queryFn: async () => {
            const res = await fontsApiClient.get(`?template_id=${templateId}`);
            return res.data;
        },
        enabled: !!templateId,
    });
};
export const useUploadFont = (templateId) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ file, font_name, font_family, }) => {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("font_name", font_name);
            formData.append("font_family", font_family);
            await fontsApiClient.post(`?template_id=${templateId}`, formData);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["fonts", templateId] });
        },
    });
};
export const useDeleteFont = (templateId) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (fontId) => {
            await fontsApiClient.delete(`?font_id=${fontId}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["fonts", templateId] });
        },
    });
};
