import { useState } from "react";
import { useBanner } from "../../context/BannerContext";
import { useConfig } from "../../context/ConfigContext";
// import axios from "axios";
import LoadingButton from "@mui/lab/LoadingButton";
import SendIcon from "@mui/icons-material/Send";
import Typography from "@mui/material/Typography";

const ExportBanner: React.FC = () => {
  const { clearSelection, clearChildSelection } = useBanner();
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

    const processTextFields = (html: string): string => {
      const container = document.createElement("div");
      container.innerHTML = html;

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

      return container.innerHTML;
    };

    const updatedHTML = processTextFields(bannerHTML);

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

    // script
    const scriptContent = `
    <script>
      window.onload = function () {

        const name = document.querySelector(".${
          config.find((item) => item.key === "title")?.value || "undefined"
        }");
        if (props.${
          config.find((item) => item.key === "title")?.value || "undefined"
        }) {
          const maxLength = 60;
          const trimmedTitle =
            props.${
              config.find((item) => item.key === "title")?.value || "undefined"
            }.length > maxLength
              ? props.${
                config.find((item) => item.key === "title")?.value ||
                "undefined"
              }.substring(0, maxLength) + "…"
              : props.${
                config.find((item) => item.key === "title")?.value ||
                "undefined"
              };
          name.textContent = trimmedTitle;
        }
  
        if (props.${
          config.find((item) => item.key === "price")?.value || "undefined"
        }) {
          let price = Math.floor(
            parseFloat(
              props.${
                config.find((item) => item.key === "price")?.value ||
                "undefined"
              }.replace(" UAH", "")
            )
          );
  
          if (props.${
            config.find((item) => item.key === "sale_price")?.value ||
            "undefined"
          }) {
            let newPrice = Math.floor(
              parseFloat(
                props.${
                  config.find((item) => item.key === "sale_price")?.value ||
                  "undefined"
                }.replace(" UAH", "")
              )
            );
            let discount = Math.floor((newPrice / price - 1) * 100);
  
            document.querySelector(".discount").textContent = discount + "%";
            document.querySelector(".${
              config.find((item) => item.key === "sale_price")?.value ||
              "undefined"
            }").textContent = newPrice.toLocaleString("ru") + " грн";
            document.querySelector(".${
              config.find((item) => item.key === "price")?.value || "undefined"
            }").textContent = price.toLocaleString("ru") + " грн";
          } else {
            document.querySelector(".discount").style.display = "none";
            document.querySelector(".${
              config.find((item) => item.key === "price")?.value || "undefined"
            }").style.display = "none";
            document.querySelector(".${
              config.find((item) => item.key === "sale_price")?.value ||
              "undefined"
            }").textContent = price.toLocaleString("ru") + " грн";
          }
        }
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
      console.log("HTML скопійований у буфер обміну!");
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
