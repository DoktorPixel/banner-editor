import imageCompression from "browser-image-compression";
export const compressImage = async (file, options) => {
    try {
        const compressedBlob = await imageCompression(file, {
            ...options,
            useWebWorker: options.useWebWorker ?? true,
        });
        return new File([compressedBlob], file.name, {
            type: options.fileType || file.type,
        });
    }
    catch (error) {
        console.error("⚠️ Image compression error:", error);
        return file;
    }
};
