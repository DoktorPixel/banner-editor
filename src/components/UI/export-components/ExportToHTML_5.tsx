import { BannerObject, ConfigItem, DynamicImg } from "../../../types/index";
import { GenerateObjectsHTML } from "./GeneateObjectsHTML";
import { generateGoogleFontsLinks } from "../../../utils/generateGoogleFonts";
import { extractFontsFromObjects } from "../../../utils/extractFonts";

export const ExportToHTML_5 = (
  objects: BannerObject[],
  config: ConfigItem,
  dynamicImgs: DynamicImg[] = []
): string => {
  // Генерация HTML для всех объектов
  const objectsHTML = GenerateObjectsHTML(objects);

  const width = config.canvasSize?.width || 1080;
  const height = config.canvasSize?.height || 1080;

  // Сбор всех шрифтов
  const usedFonts = extractFontsFromObjects(objects);

  // Генерация @import для используемых шрифтов
  const fontLinks = generateGoogleFontsLinks(usedFonts);

  // Полный HTML шаблон
  return `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Exported Banner</title>
      ${fontLinks}
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
          z-index: -100;
        }
      </style>
    </head>
    <body>
      <div class="banner-area">
        ${objectsHTML}
      </div>
      <script>
       const dynamicImgs = ${JSON.stringify(dynamicImgs)};

        // window.onload = function () {
        function loadData() {
            const props = window.props || {};

              const normalize = (value) => {
                if (typeof value === "string") {
                  const clean = value
                    .replace(/[^0-9,. ]/g, "")
                    .trim()
                    .replace(/ +/g, "")
                    .replace(",", ".");
                  return parseFloat(clean);
                }
                return typeof value === "number" ? value : NaN;
              };
              const price = normalize(props.price);
              const salePrice = normalize(props.sale_price);
              if (!isNaN(price) && !isNaN(salePrice)) {
                if (salePrice >= price) {
                  delete props.sale_price;
                }
              }

            // data-condition
            document.querySelectorAll("[data-condition]").forEach((element) => {
              try {
                const condition = JSON.parse(element.getAttribute("data-condition"));
                const { type, props: conditionProps, state, compareValue } = condition;

                const evaluate = () => {
                  for (let prop of conditionProps) {
                    const value = props[prop];

                    switch (state) {
                      case "exist":
                        if (value !== undefined) return true;
                        break;
                      case "noExist":
                        if (value === undefined) return true;
                        break;
                      case "eq":
                        if (value == compareValue) return true;
                        break;
                      case "not-eq":
                        if (value != compareValue) return true;
                        break;
                      case "more-than":
                        if (parseFloat(value) > parseFloat(compareValue)) return true;
                        break;
                      case "less-than":
                        if (parseFloat(value) < parseFloat(compareValue)) return true;
                        break;
                      case "more-or-eq":
                        if (parseFloat(value) >= parseFloat(compareValue)) return true;
                        break;
                      case "less-or-eq":
                        if (parseFloat(value) <= parseFloat(compareValue)) return true;
                        break;
                      default:
                        break;
                    }
                  }

                  return false;
                };

                const match = evaluate();
                const shouldHide =
                  (type === "hideIf" && match) || (type === "showIf" && !match);

                if (shouldHide) {
                  element.style.display = "none";
                } 
              } catch (error) {
                console.error("Error parsing data-condition", error);
              }
            });

            // abstract-data-condition
            document
              .querySelectorAll("[abstract-data-condition]")
              .forEach((element) => {
                try {
                  const condition = JSON.parse(
                    element.getAttribute("abstract-data-condition")
                  );
                  const {
                    type,
                    props: conditionProps,
                    state,
                    compareValue,
                  } = condition;

                  const evaluate = () => {
                    for (let prop of conditionProps) {
                      const value = props[prop];

                      switch (state) {
                        case "exist":
                          if (value !== undefined) return true;
                          break;
                        case "noExist":
                          if (value === undefined) return true;
                          break;
                        case "eq":
                          if (value == compareValue) return true;
                          break;
                        case "not-eq":
                          if (value != compareValue) return true;
                          break;
                        case "more-than":
                          if (parseFloat(value) > parseFloat(compareValue)) return true;
                          break;
                        case "less-than":
                          if (parseFloat(value) < parseFloat(compareValue)) return true;
                          break;
                        case "more-or-eq":
                          if (parseFloat(value) >= parseFloat(compareValue)) return true;
                          break;
                        case "less-or-eq":
                          if (parseFloat(value) <= parseFloat(compareValue)) return true;
                          break;
                        default:
                          break;
                      }
                    }

                    return false;
                  };

                  const match = evaluate();
                  const shouldHide =
                    (type === "hideIf" && match) || (type === "showIf" && !match);

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
                    return (
                        Math.round(numericValue).toLocaleString("ru", {
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                        }) + " грн"
                      );
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

                  case "min": {
                    const numericValues = values
                      .map(v => parseFloat(normalizeNumber(v).replace(/[^0-9.]/g, "")))
                      .filter(n => !isNaN(n));

                    if (numericValues.length === 0) return match;

                    const minValue = Math.min(...numericValues);
                    return (
                      Math.round(minValue).toLocaleString("ru", {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      }) + " грн"
                    );
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

            // 
              document.querySelectorAll("img[data-dynamic]").forEach((img) => {
                try {
                  const { object_id, logoName } = JSON.parse(
                    img.getAttribute("data-dynamic")
                  );

                  if (!object_id || !logoName) {
                    img.src = fallbackUrl;
                    return;
                  }

                  const filtered = dynamicImgs.filter(
                    (di) => di.object_id === object_id
                  );
                  if (filtered.length === 0) {
                    img.src = fallbackUrl;
                    return;
                  }

                  const logoNameValue = props[logoName];
                  if (typeof logoNameValue !== "string") {
                    img.src = fallbackUrl;
                    return;
                  }

                  const matched = filtered.find((di) => di.name === logoNameValue);
                  img.src =
                    matched && matched.file_url ? matched.file_url : fallbackUrl;
                } catch (e) {
                  console.warn("Error processing dynamic img:", e);
                  img.src = fallbackUrl;
                }
              });
            // 
          };
      </script>
    </body>
  </html>`;
};
