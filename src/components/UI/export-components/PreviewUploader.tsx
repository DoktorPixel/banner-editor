// shared/ui/PreviewUploader.tsx
import html2canvas from "html2canvas";
import axios from "axios";
import { Button } from "@mui/material";
import { getToken } from "../../../utils/supabaseClient";

const API_URL =
  "https://tgitxrjsbuimawihmkth.supabase.co/functions/v1/templates/uploadPreview";

export const captureAndUploadPreview = async (templateId: string) => {
  const element = document.querySelector(".banner-area") as HTMLElement;

  if (!element) {
    console.error("Element .banner-area not found");
    return;
  }

  const canvas = await html2canvas(element, {
    backgroundColor: "#ffffff",
    scale: 1,
    useCORS: true,
  });

  const resizedCanvas = document.createElement("canvas");
  resizedCanvas.width = 256;
  resizedCanvas.height = 256;
  const ctx = resizedCanvas.getContext("2d");

  if (!ctx) {
    console.error("Canvas context not available");
    return;
  }

  ctx.drawImage(canvas, 0, 0, 256, 256);

  return new Promise<void>((resolve, reject) => {
    resizedCanvas.toBlob(
      async (blob) => {
        if (!blob) {
          reject("Failed to convert canvas to Blob");
          return;
        }

        try {
          const token = await getToken();

          const formData = new FormData();
          formData.append("file", blob, "preview.jpg");
          formData.append("template_id", templateId); // <-- 400 Bad Request

          await axios.post(API_URL, formData, {
            // https://tgitxrjsbuimawihmkth.supabase.co/functions/v1/templates/uploadPreview

            headers: {
              Authorization: `Bearer ${token}`,
            },
            // params: {
            //   template_id: templateId,
            // }, // <-- 500 Internal Server Error
          });

          resolve();
        } catch (error) {
          console.error("❌ Error uploading preview:", error);
          reject(error);
        }
      },
      "image/jpeg",
      0.9
    );
  });
};

export const captureAndUploadPreview1 = async (templateId: string) => {
  const element = document.querySelector(".banner-area") as HTMLElement;

  if (!element) {
    console.error("Element .banner-area not found");
    return;
  }

  const canvas = await html2canvas(element, {
    backgroundColor: "#ffffff",
    scale: 1,
    useCORS: true,
  });

  const resizedCanvas = document.createElement("canvas");
  resizedCanvas.width = 256;
  resizedCanvas.height = 256;
  const ctx = resizedCanvas.getContext("2d");

  if (!ctx) {
    console.error("Canvas context not available");
    return;
  }

  ctx.drawImage(canvas, 0, 0, 256, 256);

  return new Promise<void>((resolve, reject) => {
    resizedCanvas.toBlob(
      async (blob) => {
        if (!blob) {
          reject("Failed to convert canvas to Blob");
          return;
        }

        const token = await getToken();

        const formData = new FormData();
        formData.append("file", blob, "preview.jpg");

        try {
          await axios.post(`${API_URL}?template_id=${templateId}`, formData, {
            // https://tgitxrjsbuimawihmkth.supabase.co/functions/v1/templates/uploadPreview?template_id=test1

            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          resolve();
        } catch (error) {
          console.error("❌ Error uploading preview:", error);
          reject(error);
        }
      },
      "image/jpeg",
      0.9
    );
  });
};

export const DownloadPreviewButton = () => {
  const handleDownload = async () => {
    const element = document.querySelector(".banner-area") as HTMLElement;

    if (!element) {
      console.error("Element .banner-area not found");
      return;
    }

    // 1. Скриншот
    const canvas = await html2canvas(element, {
      backgroundColor: "#ffffff",
      scale: 1,
      useCORS: true,
    });

    // 2. Сжатие до 256x256
    const resizedCanvas = document.createElement("canvas");
    resizedCanvas.width = 256;
    resizedCanvas.height = 256;
    const ctx = resizedCanvas.getContext("2d");

    if (!ctx) {
      console.error("Canvas context not available");
      return;
    }

    ctx.drawImage(canvas, 0, 0, 256, 256);

    // 3. Генерация ссылки и автоскачивание
    const dataUrl = resizedCanvas.toDataURL("image/jpeg", 0.9);
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = "preview.jpg";
    link.click();
  };

  return <Button onClick={handleDownload}>Download JPG</Button>;
};
