// import { useBanner } from "../../context/BannerContext";
import axios from "axios";
import Button from "@mui/material/Button";

const ExportBanner: React.FC = () => {
  //   const { objects } = useBanner();

  const exportBannerToHTML = async () => {
    const bannerAreaElement = document.querySelector(".banner-area");
    if (!bannerAreaElement) {
      console.error("BannerArea element not found.");
      return;
    }

    const bannerClone = bannerAreaElement.cloneNode(true) as HTMLElement;

    const modeSwitchWrapper = bannerClone.querySelector(".mode-switch-wrapper");
    if (modeSwitchWrapper) {
      modeSwitchWrapper.remove();
    }

    const resizeHandles = bannerClone.querySelectorAll(".resize-handle");
    resizeHandles.forEach((handle) => handle.remove());

    const bannerHTML = bannerClone.outerHTML;

    const styleSheets = Array.from(document.styleSheets);
    let styles = "";
    styleSheets.forEach((styleSheet) => {
      try {
        if (styleSheet.cssRules) {
          Array.from(styleSheet.cssRules).forEach((rule) => {
            styles += rule.cssText;
          });
        }
      } catch (error) {
        console.warn("Could not access stylesheet rules: ", error);
      }
    });

    const fullHTML = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Exported Banner</title>
          <style>${styles}</style>
        </head>
        <body>${bannerHTML}</body>
        </html>
      `;

    try {
      const response = await axios.post(
        "https://example.com/api/upload",
        fullHTML,
        {
          headers: {
            "Content-Type": "text/html",
          },
        }
      );

      if (response.status === 200) {
        console.log("Banner successfully exported!");
      } else {
        console.error(
          "Failed to export banner. Server response:",
          response.statusText
        );
      }
    } catch (error) {
      console.error("Error while exporting banner:", error);
    }
  };

  return (
    <Button onClick={exportBannerToHTML} variant="contained" color="primary">
      Надіслати HTML на сервер
    </Button>
  );
};

export default ExportBanner;
