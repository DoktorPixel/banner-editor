import html2canvas from "html2canvas";
import axios from "axios";
import { getToken } from "../../../utils/supabaseClient";

const API_URL = `${
  import.meta.env.VITE_SUPABASE_URL
}/functions/v1/templates/uploadPreview`;

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

          await axios.post(API_URL, formData, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            params: {
              template_id: templateId,
            },
          });
          // const formData = new FormData();
          // formData.append("file", blob, "preview.jpg");
          // await axios.post(API_URL, formData, {
          //   headers: {
          //     Authorization: `Bearer ${
          //       import.meta.env.VITE_SUPABASE_TEMP_ACCESS_TOKEN
          //     }`,
          //   },
          //   params: {
          //     template_id: templateId,
          //   },
          // });

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
