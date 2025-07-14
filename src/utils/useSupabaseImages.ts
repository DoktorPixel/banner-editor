import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadImage, getImages, deleteImage } from "../utils/imageService";

interface UploadImageArgs {
  file: File;
  templateId: string;
  objectId?: string;
  compress?: boolean;
}

interface DeleteImageArgs {
  id: string;
  objectId?: string;
}

export const useImages = (templateId: string, objectId?: string) =>
  useQuery({
    queryKey: ["images", templateId, objectId],
    queryFn: () => getImages(templateId, objectId),
    enabled: !!templateId,
  });

export const useUploadImage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ file, templateId, objectId, compress }: UploadImageArgs) =>
      uploadImage(file, templateId, objectId, compress),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["images"] });
    },
  });
};

export const useDeleteImage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, objectId }: DeleteImageArgs) =>
      deleteImage(id, objectId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["images"] });
    },
  });
};

export const useSupabaseImages = () => {
  const uploadMutation = useUploadImage();
  const deleteMutation = useDeleteImage();

  return {
    uploadImage: uploadMutation.mutateAsync,
    deleteImage: deleteMutation.mutateAsync,
    useImages,
  };
};
