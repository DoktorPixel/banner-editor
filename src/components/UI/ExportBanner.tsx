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

    const processFields = (html: string): string => {
      const container = document.createElement("div");
      container.innerHTML = html;

      // Text-field processing
      const textFields = container.querySelectorAll(".text-field");
      textFields.forEach((textField) => {
        const innerHTML = textField.innerHTML.trim();

        const matches = innerHTML.match(/{{(.*?)}}/);
        if (matches) {
          const variableName = matches[1];
          const mappedValue =
            config.find((item) => item.key === variableName)?.value ||
            variableName;

          textField.innerHTML = innerHTML.replace(
            matches[0],
            `{{${mappedValue}}}`
          );
          textField.classList.remove(variableName);
          textField.classList.add(mappedValue);
        }
      });

      // Image-field processing
      const imageFields = container.querySelectorAll(".image-field");
      imageFields.forEach((imageField) => {
        const src = imageField.getAttribute("src") || "";

        const matches = src.match(/{{(.*?)}}/);
        if (matches) {
          const variableName = matches[1];
          const mappedValue =
            config.find((item) => item.key === variableName)?.value ||
            variableName;

          imageField.setAttribute("src", `{{${mappedValue}}}`);
          imageField.classList.remove(variableName);
          imageField.classList.add(mappedValue);
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

      window.onload = function () {
        const props = window.props || {};
  
        ${config
          .map((item) => {
            if (item.function === "price") {
              return `
                const priceElement = document.querySelector(".${item.value}");
                if (props.${item.value}) {
                  const price = Math.floor(parseFloat(props.${item.value}.replace(" UAH", "")));
                  priceElement.textContent = price.toLocaleString("ru") + " грн";
                }
              `;
            }

            if (item.function === "sale_price") {
              return `
                const salePriceElement = document.querySelector(".${item.value}");
                if (props.${item.value}) {
                  const salePrice = Math.floor(parseFloat(props.${item.value}.replace(" UAH", "")));
                  salePriceElement.textContent = salePrice.toLocaleString("ru") + " грн";
                }
              `;
            }

            if (item.function === "discount") {
              return `
                const discountElement = document.querySelector(".${item.value}");
                const priceValue = props.price ? Math.floor(parseFloat(props.price.replace(" UAH", ""))) : null;
                const salePriceValue = props.sale_price ? Math.floor(parseFloat(props.sale_price.replace(" UAH", ""))) : null;
  
                if (priceValue && salePriceValue) {
                  const discount = Math.floor(((priceValue - salePriceValue) / priceValue) * 100);
                  discountElement.textContent ="-" + discount + "%";
                }
              `;
            }

            if (item.function === "dynamicImgs") {
              return `
                const ${item.value} = props.${item.value};
                  if (${item.value}) {
                    const imageElement = document.querySelector(".${item.value}");

                    imageElement.src = dynamicImgsObject[${item.value}];
                  }
              `;
            }

            return "";
          })
          .join("\n")}
      };
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
