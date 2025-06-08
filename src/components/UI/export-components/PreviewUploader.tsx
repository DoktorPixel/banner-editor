import html2canvas from "html2canvas";
import axios from "axios";
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

          await axios.post(API_URL, formData, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            params: {
              template_id: templateId,
            }, // <-- 500 Internal Server Error
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

// export const captureAndUploadPreview1 = async (templateId: string) => {
//   const element = document.querySelector(".banner-area") as HTMLElement;

//   if (!element) {
//     console.error("Element .banner-area not found");
//     return;
//   }

//   const canvas = await html2canvas(element, {
//     backgroundColor: "#ffffff",
//     scale: 1,
//     useCORS: true,
//   });

//   const resizedCanvas = document.createElement("canvas");
//   resizedCanvas.width = 256;
//   resizedCanvas.height = 256;
//   const ctx = resizedCanvas.getContext("2d");

//   if (!ctx) {
//     console.error("Canvas context not available");
//     return;
//   }

//   ctx.drawImage(canvas, 0, 0, 256, 256);

//   return new Promise<void>((resolve, reject) => {
//     resizedCanvas.toBlob(
//       async (blob) => {
//         if (!blob) {
//           reject("Failed to convert canvas to Blob");
//           return;
//         }

//         const token = await getToken();

//         const formData = new FormData();
//         formData.append("file", blob, "preview.jpg");
//         // formData.append("template_id", templateId); // <-- 400 Bad Request

//         try {
//           await axios.post(`${API_URL}?template_id=${templateId}`, formData, {
//             // https://tgitxrjsbuimawihmkth.supabase.co/functions/v1/templates/uploadPreview?template_id=test1

//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           });

//           resolve();
//         } catch (error) {
//           console.error("❌ Error uploading preview:", error);
//           reject(error);
//         }
//       },
//       "image/jpeg",
//       0.9
//     );
//   });
// };
