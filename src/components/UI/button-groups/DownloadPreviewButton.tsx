import html2canvas from "html2canvas";
import { Button } from "@mui/material";

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
