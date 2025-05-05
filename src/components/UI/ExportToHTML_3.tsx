import { BannerObject, BannerChild } from "../../types/index";

export const ExportToHTML_3 = (objects: BannerObject[]): string => {
  // Функция для преобразования значений в пиксели, если это число
  const toPx = (value?: number | string): string => {
    if (value === undefined) return "";
    return typeof value === "number" ? `${value}px` : value;
  };

  // Функция для преобразования цвета в RGB, если это HEX
  const toRGB = (color?: string): string => {
    if (!color || !color.startsWith("#")) return color || "";
    const hex = color.replace("#", "");
    if (!/^[0-9A-Fa-f]{6}$/.test(hex)) return color;
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return `rgb(${r}, ${g}, ${b})`;
  };

  // Функция для генерации CSS-стилей для объекта
  const generateStyles = (
    obj: BannerObject | BannerChild,
    isChild: boolean = false,
    isText: boolean = false,
    isOuter: boolean = true,
    isGroupChild: boolean = false,
    excludeBorders: boolean = false
  ): string => {
    const styles: string[] = [];

    // Стили для внешнего контейнера (banner-object)
    if (isOuter) {
      if (!isChild) {
        styles.push(`position: absolute`);
        if (obj.x !== undefined) styles.push(`left: ${toPx(obj.x)}`);
        if (obj.y !== undefined) styles.push(`top: ${toPx(obj.y)}`);
        if (obj.zIndex !== undefined) styles.push(`z-index: ${obj.zIndex}`);
        if (obj.rotate !== undefined) {
          styles.push(`transform: rotate(${obj.rotate}deg)`);
        }
        if (obj.type === "image" || obj.type === "group") {
          // Для image и group размеры остаются во внешнем контейнере
          if (obj.width !== undefined && !obj.autoWidth)
            styles.push(`width: ${toPx(obj.width)}`);
          if (obj.height !== undefined && !obj.autoHeight)
            styles.push(`height: ${toPx(obj.height)}`);
          if (obj.autoWidth) styles.push(`width: auto`);
          if (obj.autoHeight) styles.push(`height: auto`);
        }
        if (obj.type === "image") {
          styles.push(`overflow: hidden`);
        }
        if (obj.type === "image" || obj.type === "figure") {
          styles.push(`cursor: move`);
        }
        // Flex-стили для группы
        if (obj.type === "group") {
          if (obj.display) styles.push(`display: ${obj.display}`);
          if (obj.flexDirection)
            styles.push(`flex-direction: ${obj.flexDirection}`);
          if (obj.justifyContent)
            styles.push(`justify-content: ${obj.justifyContent}`);
          if (obj.alignItems) styles.push(`align-items: ${obj.alignItems}`);
          if (obj.gap) styles.push(`gap: ${toPx(obj.gap)}`);
        }
      }
    } else {
      // Стили для внутреннего элемента
      if ((isText || obj.type === "figure") && !isGroupChild) {
        // Размеры только для text и figure, если не дочерний элемент группы
        if (obj.width !== undefined && !obj.autoWidth)
          styles.push(`width: ${toPx(obj.width)}`);
        if (obj.height !== undefined && !obj.autoHeight)
          styles.push(`height: ${toPx(obj.height)}`);
        if (obj.autoWidth) styles.push(`width: auto`);
        if (obj.autoHeight) styles.push(`height: auto`);
      }
      // Текстовые стили
      if (obj.fontSize) styles.push(`font-size: ${toPx(obj.fontSize)}`);
      if (obj.fontFamily) styles.push(`font-family: ${obj.fontFamily}`);
      if (obj.fontWeight) styles.push(`font-weight: ${obj.fontWeight}`);
      if (obj.fontStyle) styles.push(`font-style: ${obj.fontStyle}`);
      if (obj.textTransform)
        styles.push(`text-transform: ${obj.textTransform}`);
      if (obj.textDecoration)
        styles.push(`text-decoration: ${obj.textDecoration}`);
      if (obj.textAlign) styles.push(`text-align: ${obj.textAlign}`);
      if (obj.color) styles.push(`color: ${toRGB(obj.color)}`);
      if (obj.maxLines) {
        styles.push(`display: -webkit-box`);
        styles.push(`-webkit-box-orient: vertical`);
        styles.push(`overflow: hidden`);
        styles.push(`-webkit-line-clamp: ${obj.maxLines}`);
      }

      // Фон и границы
      if (obj.backgroundColor)
        styles.push(`background-color: ${toRGB(obj.backgroundColor)}`);
      if (obj.borderRadius)
        styles.push(`border-radius: ${toPx(obj.borderRadius)}`);
      if (obj.opacity) styles.push(`opacity: ${obj.opacity}`);

      // Отступы
      if (obj.paddingTop) styles.push(`padding-top: ${toPx(obj.paddingTop)}`);
      if (obj.paddingBottom)
        styles.push(`padding-bottom: ${toPx(obj.paddingBottom)}`);
      if (obj.paddingLeft)
        styles.push(`padding-left: ${toPx(obj.paddingLeft)}`);
      if (obj.paddingRight)
        styles.push(`padding-right: ${toPx(obj.paddingRight)}`);

      // Границы (исключаем, если excludeBorders = true)
      if (!excludeBorders) {
        const borders: { side: string; style: string }[] = [];
        if (obj.borderTopWidth && obj.borderTopStyle && obj.borderTopColor) {
          borders.push({
            side: "border-top",
            style: `${toPx(obj.borderTopWidth)} ${obj.borderTopStyle} ${toRGB(
              obj.borderTopColor
            )}`,
          });
        }
        if (
          obj.borderBottomWidth &&
          obj.borderBottomStyle &&
          obj.borderBottomColor
        ) {
          borders.push({
            side: "border-bottom",
            style: `${toPx(obj.borderBottomWidth)} ${
              obj.borderBottomStyle
            } ${toRGB(obj.borderBottomColor)}`,
          });
        }
        if (obj.borderLeftWidth && obj.borderLeftStyle && obj.borderLeftColor) {
          borders.push({
            side: "border-left",
            style: `${toPx(obj.borderLeftWidth)} ${obj.borderLeftStyle} ${toRGB(
              obj.borderLeftColor
            )}`,
          });
        }
        if (
          obj.borderRightWidth &&
          obj.borderRightStyle &&
          obj.borderRightColor
        ) {
          borders.push({
            side: "border-right",
            style: `${toPx(obj.borderRightWidth)} ${
              obj.borderRightStyle
            } ${toRGB(obj.borderRightColor)}`,
          });
        }

        if (borders.length > 0) {
          if (
            borders.length === 4 &&
            borders.every((b) => b.style === borders[0].style)
          ) {
            styles.push(`border: ${borders[0].style}`);
          } else {
            borders.forEach((border) => {
              styles.push(`${border.side}: ${border.style}`);
            });
          }
        }
      }

      // Для изображений (внутренний <img>)
      if (obj.objectFit)
        styles.push(`object-fit: ${obj.objectFit}; width: 100%; height: 100%`);
    }

    return styles.join("; ");
  };

  // Функция для генерации HTML для объекта или ребенка
  const generateObjectHTML = (
    obj: BannerObject | BannerChild,
    isChild: boolean = false,
    isGroupChild: boolean = false
  ): string => {
    const outerStyles = generateStyles(
      obj,
      isChild,
      obj.type === "text",
      true,
      isGroupChild
    );
    const innerStyles = generateStyles(
      obj,
      isChild,
      obj.type === "text",
      false,
      isGroupChild
    );
    const conditionAttr = obj.condition
      ? `data-condition='${JSON.stringify(obj.condition)}'`
      : "";
    const idAttr = `id="${obj.id}"`;
    const classAttr = isChild
      ? `class="banner-object-child"`
      : `class="banner-object"`;

    if (obj.type === "text") {
      const content = `<div ${
        isChild ? idAttr : ""
      } ${conditionAttr} class="text-field ${
        isChild ? "banner-object-child" : ""
      }" style="${innerStyles}; display: block">${obj.content || ""}</div>`;
      return isChild
        ? content
        : `<div ${idAttr} ${conditionAttr} ${classAttr} style="${outerStyles}">${content}</div>`;
    } else if (obj.type === "image") {
      const content = `<img ${isChild ? idAttr : ""} ${conditionAttr} src="${
        obj.src || ""
      }" alt="image" class="image-field ${
        isChild ? "banner-object-child" : ""
      }" style="${innerStyles}" />`;
      return isChild
        ? content
        : `<div ${idAttr} ${conditionAttr} ${classAttr} style="${outerStyles}">${content}</div>`;
    } else if (obj.type === "figure") {
      const content = `<div ${
        isChild ? idAttr : ""
      } ${conditionAttr} class="banner-figure ${
        isChild ? "banner-object-child" : ""
      }" style="${innerStyles}"></div>`;
      return isChild
        ? content
        : `<div ${idAttr} ${conditionAttr} ${classAttr} style="${outerStyles}">${content}</div>`;
    } else if (obj.type === "group" && obj.children) {
      const groupContent = obj.children
        .filter((child) => child && child.id)
        .map((child) => generateObjectHTML(child, true, true)) // Передаем isGroupChild: true
        .join("");
      return `<div ${idAttr} ${conditionAttr} ${classAttr} style="${outerStyles}">${groupContent}</div>`;
    }

    return "";
  };

  // Генерация HTML для всех объектов
  const objectsHTML = objects.map((obj) => generateObjectHTML(obj)).join("");

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
          width: 1080px;
          height: 1080px;
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
          width: 1080px;
          height: 1080px;
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
