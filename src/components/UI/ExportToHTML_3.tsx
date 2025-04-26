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
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return `rgb(${r}, ${g}, ${b})`;
  };

  // Функция для генерации CSS-стилей для объекта
  const generateStyles = (obj: BannerObject | BannerChild): string => {
    const styles: string[] = [];

    // Позиционирование
    if (obj.x !== undefined) styles.push(`left: ${toPx(obj.x)}`);
    if (obj.y !== undefined) styles.push(`top: ${toPx(obj.y)}`);
    if (obj.width !== undefined && !obj.autoWidth)
      styles.push(`width: ${toPx(obj.width)}`);
    if (obj.height !== undefined && !obj.autoHeight)
      styles.push(`height: ${toPx(obj.height)}`);
    if (obj.autoWidth) styles.push(`width: auto`);
    if (obj.autoHeight) styles.push(`height: auto`);
    if (obj.zIndex !== undefined) styles.push(`z-index: ${obj.zIndex}`);
    if (obj.rotate !== undefined)
      styles.push(`transform: rotate(${obj.rotate}deg)`);

    // Текстовые стили
    if (obj.fontSize) styles.push(`font-size: ${toPx(obj.fontSize)}`);
    if (obj.fontFamily) styles.push(`font-family: ${obj.fontFamily}`);
    if (obj.fontWeight) styles.push(`font-weight: ${obj.fontWeight}`);
    if (obj.fontStyle) styles.push(`font-style: ${obj.fontStyle}`);
    if (obj.textTransform) styles.push(`text-transform: ${obj.textTransform}`);
    if (obj.textDecoration)
      styles.push(`text-decoration: ${obj.textDecoration}`);
    if (obj.textAlign) styles.push(`text-align: ${obj.textAlign}`);
    if (obj.color) styles.push(`color: ${toRGB(obj.color)}`);

    // Flex стили
    if (obj.display) styles.push(`display: ${obj.display}`);
    if (obj.flexDirection) styles.push(`flex-direction: ${obj.flexDirection}`);
    if (obj.justifyContent)
      styles.push(`justify-content: ${obj.justifyContent}`);
    if (obj.alignItems) styles.push(`align-items: ${obj.alignItems}`);
    if (obj.gap) styles.push(`gap: ${toPx(obj.gap)}`);

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
    if (obj.paddingLeft) styles.push(`padding-left: ${toPx(obj.paddingLeft)}`);
    if (obj.paddingRight)
      styles.push(`padding-right: ${toPx(obj.paddingRight)}`);

    // Границы
    const borderStyles: string[] = [];
    if (obj.borderTopWidth && obj.borderTopStyle && obj.borderTopColor) {
      borderStyles.push(
        `top: ${toPx(obj.borderTopWidth)} ${obj.borderTopStyle} ${toRGB(
          obj.borderTopColor
        )}`
      );
    }
    if (
      obj.borderBottomWidth &&
      obj.borderBottomStyle &&
      obj.borderBottomColor
    ) {
      borderStyles.push(
        `bottom: ${toPx(obj.borderBottomWidth)} ${
          obj.borderBottomStyle
        } ${toRGB(obj.borderBottomColor)}`
      );
    }
    if (obj.borderLeftWidth && obj.borderLeftStyle && obj.borderLeftColor) {
      borderStyles.push(
        `left: ${toPx(obj.borderLeftWidth)} ${obj.borderLeftStyle} ${toRGB(
          obj.borderLeftColor
        )}`
      );
    }
    if (obj.borderRightWidth && obj.borderRightStyle && obj.borderRightColor) {
      borderStyles.push(
        `right: ${toPx(obj.borderRightWidth)} ${obj.borderRightStyle} ${toRGB(
          obj.borderRightColor
        )}`
      );
    }
    if (borderStyles.length > 0) {
      styles.push(`border: none`); // Отключаем общую границу
      if (
        borderStyles.length === 4 &&
        borderStyles.every((s) => s === borderStyles[0])
      ) {
        // Если все границы одинаковые, используем shorthand
        styles.push(`border: ${borderStyles[0]}`);
      } else {
        // Иначе задаем каждую границу отдельно
        if (obj.borderTopWidth && obj.borderTopStyle && obj.borderTopColor) {
          styles.push(
            `border-top: ${toPx(obj.borderTopWidth)} ${
              obj.borderTopStyle
            } ${toRGB(obj.borderTopColor)}`
          );
        }
        if (
          obj.borderBottomWidth &&
          obj.borderBottomStyle &&
          obj.borderBottomColor
        ) {
          styles.push(
            `border-bottom: ${toPx(obj.borderBottomWidth)} ${
              obj.borderBottomStyle
            } ${toRGB(obj.borderBottomColor)}`
          );
        }
        if (obj.borderLeftWidth && obj.borderLeftStyle && obj.borderLeftColor) {
          styles.push(
            `border-left: ${toPx(obj.borderLeftWidth)} ${
              obj.borderLeftStyle
            } ${toRGB(obj.borderLeftColor)}`
          );
        }
        if (
          obj.borderRightWidth &&
          obj.borderRightStyle &&
          obj.borderRightColor
        ) {
          styles.push(
            `border-right: ${toPx(obj.borderRightWidth)} ${
              obj.borderRightStyle
            } ${toRGB(obj.borderRightColor)}`
          );
        }
      }
    }

    // Для изображений
    if (obj.objectFit) styles.push(`object-fit: ${obj.objectFit}`);
    if (obj.type === "image") styles.push(`overflow: hidden`);

    return styles.join("; ");
  };

  // Функция для генерации HTML для объекта или ребенка
  const generateObjectHTML = (
    obj: BannerObject | BannerChild,
    isChild: boolean = false
  ): string => {
    const styles = generateStyles(obj);
    const conditionAttr = obj.condition
      ? `data-condition='${JSON.stringify(obj.condition)}'`
      : "";
    const idAttr = `id="${obj.id}"`;
    const classAttr = isChild
      ? `class="banner-object-child"`
      : `class="banner-object"`;
    const positionStyles = isChild ? "" : `position: absolute; ${styles}`;
    let innerContent = "";

    if (obj.type === "text") {
      innerContent = `<div ${idAttr} class="text-field ${
        isChild ? "banner-object-child" : ""
      }" style="${styles}; 
      // white-space: pre-wrap;  
      display: block">${obj.content || ""}</div>`;
    } else if (obj.type === "image") {
      innerContent = `<img ${idAttr} ${conditionAttr} src="${
        obj.src || ""
      }" alt="image" class="image-field ${
        isChild ? "banner-object-child" : ""
      }" style="${styles}; width: 100%; height: 100%" />`;
    } else if (obj.type === "figure") {
      innerContent = `<div ${idAttr} ${conditionAttr} class="banner-figure ${
        isChild ? "banner-object-child" : ""
      }" style="${styles}"></div>`;
    } else if (obj.type === "group" && obj.children) {
      const groupStyles = generateStyles(obj);
      innerContent = `<div ${idAttr} ${conditionAttr} style="${groupStyles}">${obj.children
        .map((child) => generateObjectHTML(child, true))
        .join("")}</div>`;
    }

    if (isChild && obj.type === "group") {
      return innerContent;
    }

    return `<div ${idAttr} ${conditionAttr} ${classAttr} style="${positionStyles}">${innerContent}</div>`;
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
        margin: 0px;
        padding: 0px;
        border: 0px;
      }
      img {
        max-inline-size: 100%;
        max-block-size: 100%;
      }
      .banner-area {
        position: relative;
        top: 20px;
        background: rgb(255, 255, 255);
        width: 1080px;
        min-width: 1080px;
        height: 1080px;
        min-height: 1080px;
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
            console.error("Ошибка при разборе data-condition:", error);
          }
        });
      });
    </script>
  </body>
</html>`;
};
