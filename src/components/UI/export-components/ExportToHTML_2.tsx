import { BannerObject, BannerChild } from "../../../types";
import React from "react";

const styleToString = (style: React.CSSProperties = {}): string => {
  return Object.entries(style)
    .filter(([, value]) => value !== undefined && value !== null)
    .map(([key, value]) => {
      const kebabKey = key.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);
      return `${kebabKey}:${value}`;
    })
    .join(";");
};

const objectToStyle = (
  obj: BannerObject | BannerChild
): React.CSSProperties => {
  const {
    x,
    y,
    width,
    height,
    zIndex,
    fontSize,
    fontFamily,
    fontWeight,
    fontStyle,
    textTransform,
    textDecoration,
    textAlign,
    color,
    display,
    flexDirection,
    justifyContent,
    alignItems,
    gap,
    backgroundColor,
    objectFit,
    rotate,
    opacity,
    paddingTop,
    paddingBottom,
    paddingLeft,
    paddingRight,
    borderTopStyle,
    borderTopColor,
    borderTopWidth,
    borderBottomStyle,
    borderBottomColor,
    borderBottomWidth,
    borderLeftStyle,
    borderLeftColor,
    borderLeftWidth,
    borderRightStyle,
    borderRightColor,
    borderRightWidth,
    borderRadius,
  } = obj;

  const style: React.CSSProperties = {
    position: "absolute",
    left: `${x}px`,
    top: `${y}px`,
    width: width ? `${width}px` : "auto",
    height: height ? `${height}px` : "auto",
    zIndex,
    fontSize,
    fontFamily,
    fontWeight,
    fontStyle,
    textTransform,
    textDecoration,
    textAlign,
    color,
    display,
    flexDirection,
    justifyContent,
    alignItems,
    gap,
    backgroundColor,
    objectFit,
    opacity,
    transform: rotate ? `rotate(${rotate}deg)` : undefined,
    paddingTop,
    paddingBottom,
    paddingLeft,
    paddingRight,
    borderTop: borderTopStyle
      ? `${borderTopWidth || 0}px ${borderTopStyle} ${borderTopColor || "#000"}`
      : undefined,
    borderBottom: borderBottomStyle
      ? `${borderBottomWidth || 0}px ${borderBottomStyle} ${
          borderBottomColor || "#000"
        }`
      : undefined,
    borderLeft: borderLeftStyle
      ? `${borderLeftWidth || 0}px ${borderLeftStyle} ${
          borderLeftColor || "#000"
        }`
      : undefined,
    borderRight: borderRightStyle
      ? `${borderRightWidth || 0}px ${borderRightStyle} ${
          borderRightColor || "#000"
        }`
      : undefined,
    borderRadius,
  };

  return style;
};

const renderChildren = (children: BannerChild[] = []): string => {
  return children.map((child) => renderElement(child)).join("");
};

const renderElement = (obj: BannerObject | BannerChild): string => {
  const style = objectToStyle(obj);
  const styleStr = styleToString(style);

  switch (obj.type) {
    case "text": {
      return `<div style="${styleStr}">${obj.content || ""}</div>`;
    }
    case "image": {
      return `<img src="${obj.src}" style="${styleStr}" />`;
    }
    case "figure": {
      return `<div style="${styleStr}"></div>`;
    }
    case "group": {
      const childrenHTML = renderChildren(obj.children || []);
      return `<div style="${styleStr}; position: absolute; ">${childrenHTML}</div>`;
    }
    default: {
      return "";
    }
  }
};

export const ExportToHTML_2 = (objects: BannerObject[]): string => {
  return `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Exported Banner</title>
    <style>
      body {
        margin: 0;
        padding: 0;
      }
    </style>
  </head>
  <body>
    <div class="banner-area" style="position: relative; width: 1080px; height: 1080px;">
      ${objects.map((obj) => renderElement(obj)).join("")}
    </div>
  </body>

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


</html>
  `.trim();
};
