import imageCompression from "browser-image-compression";

export interface CompressionOptions {
  maxSizeMB: number;
  maxWidthOrHeight: number;
  useWebWorker?: boolean;
  fileType?: string;
}

export const compressImage = async (
  file: File,
  options: CompressionOptions
): Promise<File> => {
  try {
    const compressedBlob = await imageCompression(file, {
      ...options,
      useWebWorker: options.useWebWorker ?? true,
    });
    return new File([compressedBlob], file.name, {
      type: options.fileType || file.type,
    });
  } catch (error) {
    console.error("⚠️ Image compression error:", error);
    return file;
  }
};
