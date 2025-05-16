// import { BannerObject, BannerChild } from "../../../types";

// export const ExportToHTML_4 = (objects: BannerObject[]): string => {
//   // Helper function to convert properties to CSS styles
//   const getStyles = (obj) => {
//     const styles = [];

//     // Positioning and dimensions
//     if (obj.x !== undefined) styles.push(`left: ${obj.x}px`);
//     if (obj.y !== undefined) styles.push(`top: ${obj.y}px`);
//     if (obj.width !== undefined) {
//       styles.push(`width: ${obj.autoWidth ? "auto" : `${obj.width}px`}`);
//     }
//     if (obj.height !== undefined) {
//       styles.push(`height: ${obj.autoHeight ? "auto" : `${obj.height}px`}`);
//     }
//     if (obj.zIndex !== undefined) styles.push(`z-index: ${obj.zIndex}`);
//     if (obj.rotate !== undefined)
//       styles.push(`transform: rotate(${obj.rotate}deg)`);

//     // Display and flex properties
//     if (obj.display) styles.push(`display: ${obj.display}`);
//     if (obj.flexDirection) styles.push(`flex-direction: ${obj.flexDirection}`);
//     if (obj.justifyContent)
//       styles.push(`justify-content: ${obj.justifyContent}`);
//     if (obj.alignItems) styles.push(`align-items: ${obj.alignItems}`);
//     if (obj.gap) styles.push(`gap: ${obj.gap}`);

//     // Text properties
//     if (obj.fontSize) styles.push(`font-size: ${obj.fontSize}px`);
//     if (obj.fontFamily) styles.push(`font-family: ${obj.fontFamily}`);
//     if (obj.fontWeight) styles.push(`font-weight: ${obj.fontWeight}`);
//     if (obj.fontStyle) styles.push(`font-style: ${obj.fontStyle}`);
//     if (obj.textTransform) styles.push(`text-transform: ${obj.textTransform}`);
//     if (obj.textDecoration)
//       styles.push(`text-decoration: ${obj.textDecoration}`);
//     if (obj.textAlign) styles.push(`text-align: ${obj.textAlign}`);
//     if (obj.color) styles.push(`color: ${obj.color}`);

//     // Background and opacity
//     if (obj.backgroundColor)
//       styles.push(`background-color: ${obj.backgroundColor}`);
//     if (obj.opacity !== undefined) styles.push(`opacity: ${obj.opacity}`);

//     // Borders
//     const borderStyles = [];
//     if (obj.borderTopStyle && obj.borderTopWidth && obj.borderTopColor) {
//       borderStyles.push(
//         `top: ${obj.borderTopWidth} ${obj.borderTopStyle} ${obj.borderTopColor}`
//       );
//     }
//     if (
//       obj.borderBottomStyle &&
//       obj.borderBottomWidth &&
//       obj.borderBottomColor
//     ) {
//       borderStyles.push(
//         `bottom: ${obj.borderBottomWidth} ${obj.borderBottomStyle} ${obj.borderBottomColor}`
//       );
//     }
//     if (obj.borderLeftStyle && obj.borderLeftWidth && obj.borderLeftColor) {
//       borderStyles.push(
//         `left: ${obj.borderLeftWidth} ${obj.borderLeftStyle} ${obj.borderLeftColor}`
//       );
//     }
//     if (obj.borderRightStyle && obj.borderRightWidth && obj.borderRightColor) {
//       borderStyles.push(
//         `right: ${obj.borderRightWidth} ${obj.borderRightStyle} ${obj.borderRightColor}`
//       );
//     }
//     if (borderStyles.length > 0) {
//       styles.push(
//         `border-style: ${borderStyles.map((s) => s.split(" ")[1]).join(" ")}`
//       );
//       styles.push(
//         `border-width: ${borderStyles.map((s) => s.split(" ")[0]).join(" ")}`
//       );
//       styles.push(
//         `border-color: ${borderStyles.map((s) => s.split(" ")[2]).join(" ")}`
//       );
//     }

//     // Padding
//     if (obj.paddingTop) styles.push(`padding-top: ${obj.paddingTop}`);
//     if (obj.paddingBottom) styles.push(`padding-bottom: ${obj.paddingBottom}`);
//     if (obj.paddingLeft) styles.push(`padding-left: ${obj.paddingLeft}`);
//     if (obj.paddingRight) styles.push(`padding-right: ${obj.paddingRight}`);

//     // Image-specific
//     if (obj.objectFit) styles.push(`object-fit: ${obj.objectFit}`);
//     if (obj.borderRadius) styles.push(`border-radius: ${obj.borderRadius}`);

//     // Cursor and overflow for non-text elements
//     if (obj.type !== "text") {
//       styles.push("cursor: move");
//       styles.push("overflow: hidden");
//     }

//     return styles.join("; ");
//   };

//   // Helper function to generate HTML for an object or child
//   const generateObjectHTML = (obj, isChild = false) => {
//     const conditionAttr = obj.condition
//       ? `data-condition='${JSON.stringify(obj.condition)}'`
//       : "";
//     const idAttr = `id="${obj.id}"`;
//     const classAttr = isChild
//       ? 'class="banner-object-child"'
//       : 'class="banner-object"';
//     let styles = getStyles(obj);
//     let content = "";

//     if (obj.type === "group") {
//       const groupStyles = getStyles({
//         ...obj,
//         x: undefined,
//         y: undefined,
//         zIndex: undefined,
//       });
//       content = `
//         <div style="${groupStyles}">
//           ${obj.children
//             ?.map((child) => generateObjectHTML(child, true))
//             .join("")}
//         </div>
//       `;
//     } else if (obj.type === "text") {
//       const textClass = isChild
//         ? "text-field banner-object-child"
//         : "text-field";
//       styles += "; display: block; white-space: pre-wrap";
//       if (!obj.content) return "";
//       content = `
//         <div ${idAttr} class="${textClass}" style="${styles}">
//           ${obj.content}
//         </div>
//       `;
//     } else if (obj.type === "image") {
//       content = `
//         <img ${idAttr} class="image-field" src="${obj.src}" alt="img" style="width: 100%; height: 100%" />`;
//     } else if (obj.type === "figure") {
//       content = `
//         <div ${idAttr} class="banner-figure" style="${styles}"></div>
//       `;
//     }

//     if (isChild) return content;

//     return `
//       <div ${idAttr} ${conditionAttr} ${classAttr} style="position: absolute; ${styles}">
//         ${content}
//       </div>
//     `;
//   };

//   // Base HTML template
//   return `
// <!DOCTYPE html>
// <html lang="en">
//   <head>
//     <meta charset="UTF-8" />
//     <meta name="viewport" content="width=device-width, initial-scale=1.0" />
//     <title>Exported Banner</title>
//     <style>
//       * {
//         box-sizing: border-box;
//         font-family: Inter, sans-serif;
//       }
//       *,
//       ::before,
//       ::after {
//         box-sizing: border-box;
//         margin: 0px;
//         padding: 0px;
//         border: 0px;
//       }
//       img {
//         max-inline-size: 100%;
//         max-block-size: 100%;
//       }
//       .banner-area {
//         position: relative;
//         top: 20px;
//         background: rgb(255, 255, 255);
//         width: 1080px;
//         min-width: 1080px;
//         height: 1080px;
//         min-height: 1080px;
//         z-index: -100;
//       }
//     </style>
//   </head>
//   <body>
//     <div class="banner-area">
//       ${objects.map((obj) => generateObjectHTML(obj)).join("")}
//     </div>

//     <script>
//       document.addEventListener("DOMContentLoaded", function () {
//         const props = window.props || {};

//         document.querySelectorAll("[data-condition]").forEach((element) => {
//           try {
//             const condition = JSON.parse(
//               element.getAttribute("data-condition")
//             );
//             const { type, props: conditionProps, state } = condition;

//             const propsExist = conditionProps.some(
//               (prop) => props[prop] !== undefined
//             );

//             let shouldHide = false;

//             if (state === "exist") {
//               shouldHide =
//                 (type === "hideIf" && propsExist) ||
//                 (type === "showIf" && !propsExist);
//             } else if (state === "noExist") {
//               shouldHide =
//                 (type === "hideIf" && !propsExist) ||
//                 (type === "showIf" && propsExist);
//             }

//             if (shouldHide) {
//               element.style.display = "none";
//             }
//           } catch (error) {
//             console.error("Ошибка при разборе data-condition:", error);
//           }
//         });
//       });
//     </script>
//   </body>
// </html>
//   `;
// };
