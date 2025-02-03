import { useState } from "react";
import { useBanner } from "../../context/BannerContext";
import { useConfig } from "../../context/ConfigContext";
// import axios from "axios";
import LoadingButton from "@mui/lab/LoadingButton";
import SendIcon from "@mui/icons-material/Send";
import Typography from "@mui/material/Typography";
import { DynamicImg } from "../../types";

const ExportBanner: React.FC = () => {
  const { clearSelection, clearChildSelection, dynamicImgs } = useBanner();
  const { config } = useConfig();
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const exportBannerToHTML = async () => {
    setIsLoading(true);
    const bannerAreaElement = document.querySelector(".banner-area");
    if (!bannerAreaElement) {
      console.error("BannerArea element not found.");
      setIsLoading(false);
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

    // text-field processing
    const processFields = (html: string): string => {
      const container = document.createElement("div");
      container.innerHTML = html;

      const textFields = container.querySelectorAll(".text-field");

      textFields.forEach((field) => {
        if (field instanceof HTMLElement) {
          const match = field.textContent?.match(/\{\{(\w+)\}\}/);

          if (match) {
            const dynamicClass = match[1];
            field.classList.add(dynamicClass);
          }
        }
      });

      // Image-field processing
      const imageFields = container.querySelectorAll(".image-field");
      imageFields.forEach((img) => {
        if (img instanceof HTMLImageElement) {
          const match = img.getAttribute("src")?.match(/\{\{(\w+)\}\}/);

          if (match) {
            const dynamicClass = match[1];
            img.classList.add(dynamicClass);
          }
        }
      });

      return container.innerHTML;
    };

    const updatedHTML = processFields(bannerHTML);

    // styles
    const styleSheets = Array.from(document.styleSheets);
    let styles = "";

    styleSheets.forEach((styleSheet) => {
      try {
        const rules = styleSheet.cssRules || [];
        Array.from(rules).forEach((rule) => {
          if (
            rule instanceof CSSStyleRule &&
            (bannerAreaElement.matches(rule.selectorText) ||
              bannerAreaElement.querySelector(rule.selectorText))
          ) {
            styles += rule.cssText;
          }
        });
      } catch (error) {
        console.warn("Could not access stylesheet rules: ", error);
      }
    });

    // Generate dynamicImgs object with dynamic name

    function convertToDynamicImgsObject(
      dynamicImgs: DynamicImg[]
    ): Record<string, string> {
      return dynamicImgs.reduce((acc, img) => {
        if (img.name && img.logoUrl) {
          acc[img.name] = img.logoUrl;
        } else {
          console.warn("Пропущено елемент із неприпустимими даними:", img);
        }
        return acc;
      }, {} as Record<string, string>);
    }

    const dynamicImgsObject = convertToDynamicImgsObject(dynamicImgs || []);

    // script
    const scriptContent = `
    <script>
      const dynamicImgsObject = ${JSON.stringify(dynamicImgsObject)};
  
      document.addEventListener("DOMContentLoaded", function () {
        const props = window.props || {};
  
        let price = 0;
        let salePrice = 0;
  
        ${config
          .map((item) => {
            if (item.function === "price" && item.key) {
              return `
                const priceElement = document.querySelector(".${item.key}");
                if (priceElement && props.${item.key}) {
                  price = Math.floor(parseFloat(props.${
                    item.key
                  }.replace(" UAH", "")));
                  priceElement.textContent = price.toLocaleString("ru") + " грн";
                }
  
                ${
                  item.value1
                    ? `
                  const salePriceElement = document.querySelector(".${item.value1}");
                  if (salePriceElement && props.${item.value1}) {
                    salePrice = Math.floor(parseFloat(props.${item.value1}.replace(" UAH", "")));
                    salePriceElement.textContent = salePrice.toLocaleString("ru") + " грн";
                  }`
                    : ""
                }
  
                ${
                  item.value1 && item.value2
                    ? `
                  const discountElement = document.querySelector(".${item.value2}");
                  if (discountElement && price > 0 && salePrice > 0) {
                    const discount = Math.floor(((price - salePrice) / price) * 100);
                    discountElement.textContent = "-" + discount + "%";
                  }`
                    : ""
                }
              `;
            }

            if (item.function === "dynamicImgs" && item.key) {
              return `
              const brandName = props.${item.key};
              if (brandName && dynamicImgsObject[brandName]) {
                const imageElement = document.querySelector(".${item.key}");
                if (imageElement) {
                  imageElement.src = dynamicImgsObject[brandName];
                }
              }
              `;
            }
            return "";

            // if (item.function === "dynamicImgs") {
            //   return
            //     const ${item.key} = props.${item.key};
            //       if (${item.key}) {
            //         const imageElement = document.querySelector(".${item.key}");

            //         imageElement.src = dynamicImgsObject[${item.key}];
            //       }
            //   ;
            // }

            // return "";
          })
          .join("\n")}
      });
    </script>
  `;

    const fullHTML = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Exported Banner</title>
          <style>${styles}</style>
        </head>
        <body>
          ${updatedHTML}  
          ${scriptContent}     
        </body>
        </html>

      `;

    try {
      await navigator.clipboard.writeText(fullHTML);
      setNotification("Дані успішно скопійовані в буфер обміну!");
    } catch (clipboardError) {
      console.error("Помилка при копіюванні в буфер обміну:", clipboardError);
      setNotification("Помилка при копіюванні в буфер обміну.");
    } finally {
      setTimeout(() => setNotification(null), 2000);
      setIsLoading(false);
    }

    // try {
    //   const response = await axios.post(
    //     "https://example.com/api/upload",
    //     fullHTML,
    //     {
    //       headers: {
    //         "Content-Type": "text/html",
    //       },
    //     }
    //   );

    //   if (response.status === 200) {
    //     console.log("Banner successfully exported!");
    //   } else {
    //     console.error(
    //       "Failed to export banner. Server response:",
    //       response.statusText
    //     );
    //   }
    // } catch (error) {
    //   console.error("Error while exporting banner:", error);
    //   alert("There was an error sending data.");
    // }
  };

  return (
    <>
      <LoadingButton
        onClick={() => {
          clearSelection();
          clearChildSelection();
          exportBannerToHTML();
        }}
        variant="contained"
        color="primary"
        loading={isLoading}
      >
        {isLoading ? (
          "Отправка..."
        ) : (
          <>
            Надіслати HTML <SendIcon sx={{ marginLeft: "10px" }} />
          </>
        )}
      </LoadingButton>

      {notification && (
        <Typography
          variant="body2"
          color="success.main"
          sx={{ fontWeight: "bold" }}
        >
          {notification}
        </Typography>
      )}
    </>
  );
};

export default ExportBanner;
