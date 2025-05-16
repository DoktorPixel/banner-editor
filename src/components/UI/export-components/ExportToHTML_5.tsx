import { BannerObject } from "../../../types/index";
import { ConfigItem } from "../../../types/index";
import { GenerateObjectsHTML } from "./GeneateObjectsHTML";

export const ExportToHTML_5 = (
  objects: BannerObject[],
  config: ConfigItem
): string => {
  // Генерация HTML для всех объектов
  const objectsHTML = GenerateObjectsHTML(objects);

  const width = config.canvasSize?.width || 1080;
  const height = config.canvasSize?.height || 1080;

  // Полный HTML шаблон
  return `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Exported Banner</title>
      <style>
        * {
          box-sizing: border-box;
          font-family: Inter, sans-serif;
        }
        *,
        ::before,
        ::after {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
          border: 0;
        }
        body {
          width: ${width}px;
          height: ${height}px;
          margin: 0;
          padding: 0;
          overflow: hidden;
        }
        img {
          max-inline-size: 100%;
          max-block-size: 100%;
        }
        .banner-area {
          position: relative;
          width: ${width}px;
          height: ${height}px;
          background: rgb(255, 255, 255);
          overflow: hidden;
        }
      </style>
    </head>
    <body>
      <div class="banner-area">
        ${objectsHTML}
      </div>
      <script>
        document.addEventListener("DOMContentLoaded", function () {
          const props = window.props || {};

          // data-condition
          document.querySelectorAll("[data-condition]").forEach((element) => {
            try {
              const condition = JSON.parse(element.getAttribute("data-condition"));
              const { type, props: conditionProps, state } = condition;
              const propsExist = conditionProps.some((prop) => props[prop] !== undefined);
              let shouldHide = false;
              if (state === "exist") {
                shouldHide = (type === "hideIf" && propsExist) || (type === "showIf" && !propsExist);
              } else if (state === "noExist") {
                shouldHide = (type === "hideIf" && !propsExist) || (type === "showIf" && propsExist);
              }
              if (shouldHide) {
                element.style.display = "none";
              }
            } catch (error) {
              console.error("Error parsing data-condition", error);
            }
          });

          // abstract-data-condition
          document.querySelectorAll("[abstract-data-condition]").forEach((element) => {
            try {
              const condition = JSON.parse(element.getAttribute("abstract-data-condition"));
              const { type, props: conditionProps, state } = condition;
              const propsExist = conditionProps.some((prop) => props[prop] !== undefined);
              let shouldHide = false;
              if (state === "exist") {
                shouldHide = (type === "hideIf" && propsExist) || (type === "showIf" && !propsExist);
              } else if (state === "noExist") {
                shouldHide = (type === "hideIf" && !propsExist) || (type === "showIf" && propsExist);
              }
              if (shouldHide) {
                element.style.display = "none";
              }
            } catch (error) {
              console.error("Error parsing abstract-data-condition", error);
            }
          });

          function replaceDynamicText(content, props) {
            let result = content;

            const functionRegex = /\\{\\{\\s*(\\w+)\\s*\\(([^)]*?)\\)\\s*\\}\\}/g;
            result = result.replace(functionRegex, (match, funcName, args) => {
              const argKeys = args.split(",").map(arg => arg.trim()).filter(arg => arg);
              const values = argKeys.map(key => props[key] || "");

              const normalizeNumber = (value) => {
                if (!value) return value;
                return value.replace(/,/g, ".");
              };

              switch (funcName) {
                case "format": {
                  const value = normalizeNumber(values[0]);
                  if (!value) return match;
                  const numericValue = parseFloat(value.replace(/[^\\d.]/g, ""));
                  if (!isNaN(numericValue)) {
                    return numericValue.toLocaleString("ru", {
                      minimumFractionDigits: value.includes(".") ? 1 : 0,
                      maximumFractionDigits: 2
                    }) + " грн";
                  }
                  return value;
                }
                case "discount": {
                  const [priceStr, saleStr] = values.map(normalizeNumber);
                  if (!priceStr || !saleStr) return match;
                  const price = parseFloat(priceStr.replace(/[^\\d.]/g, ""));
                  const salePrice = parseFloat(saleStr.replace(/[^\\d.]/g, ""));
                  if (!isNaN(price) && !isNaN(salePrice) && price !== 0) {
                    const discount = ((price - salePrice) / price) * 100;
                    return Math.round(discount).toString();
                  }
                  return "0";
                }
                default:
                  return match;
              }
            });

            for (const key in props) {
              const dynamicKey = new RegExp("\\\\{\\\\{\\\\s*" + key + "\\\\s*\\\\}\\\\}", "g");
              result = result.replace(dynamicKey, props[key] || "");
            }

            return result;
          }

          document.querySelectorAll(".text-field").forEach((element) => {
            try {
              const content = element.textContent || "";
              if (content) {
                const newContent = replaceDynamicText(content, props);
                if (newContent) {
                  element.textContent = newContent;
                }
              }
            } catch (error) {
              console.error("Error replacing dynamic text:", error);
            }
          });
        });
      </script>
    </body>
  </html>`;
};
