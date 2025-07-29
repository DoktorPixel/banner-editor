import { BannerObject, BannerChild } from "../../../types/index";

export const GenerateObjectsHTML = (objects: BannerObject[]): string => {
  const escapeHTML = (str: unknown): string => {
    const safeStr = typeof str === "string" ? str : String(str || "");
    return safeStr
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  };

  const toPx = (value?: number | string): string => {
    if (value === undefined) return "";
    return typeof value === "number" ? `${value}px` : value;
  };

  const toRGB = (color?: string): string => {
    if (!color || !color.startsWith("#")) return color || "";
    const hex = color.replace("#", "");
    if (!/^[0-9A-Fa-f]{6}$/.test(hex)) return color;
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return `rgb(${r}, ${g}, ${b})`;
  };

  const generateBorderStyles = (obj: BannerObject | BannerChild): string => {
    if (obj.type !== "figure" && obj.type !== "group") return "";

    const borderProps = [
      {
        side: "top",
        width: obj.borderTopWidth,
        style: obj.borderTopStyle,
        color: obj.borderTopColor,
      },
      {
        side: "bottom",
        width: obj.borderBottomWidth,
        style: obj.borderBottomStyle,
        color: obj.borderBottomColor,
      },
      {
        side: "left",
        width: obj.borderLeftWidth,
        style: obj.borderLeftStyle,
        color: obj.borderLeftColor,
      },
      {
        side: "right",
        width: obj.borderRightWidth,
        style: obj.borderRightStyle,
        color: obj.borderRightColor,
      },
    ];

    const definedBorders = borderProps.filter(
      (b) => b.width && b.style && b.color
    );

    if (
      definedBorders.length === 4 &&
      definedBorders.every(
        (b) =>
          b.width === definedBorders[0].width &&
          b.style === definedBorders[0].style &&
          b.color === definedBorders[0].color
      )
    ) {
      const { width, style, color } = definedBorders[0];
      return `border: ${toPx(width)} ${style} ${toRGB(color)};`;
    }

    return definedBorders
      .map(
        (b) =>
          `border-${b.side}: ${toPx(b.width)} ${b.style} ${toRGB(b.color)};`
      )
      .join("");
  };

  const generateStyles = (
    obj: BannerObject | BannerChild,
    isChild: boolean = false,
    isText: boolean = false,
    isOuter: boolean = true,
    isGroupChild: boolean = false
  ): string => {
    const styles: string[] = [];

    if (isOuter) {
      if (!isChild) {
        styles.push(`position: absolute`);
        if (obj.x !== undefined) styles.push(`left: ${toPx(obj.x)}`);
        if (obj.y !== undefined) styles.push(`top: ${toPx(obj.y)}`);
        if (obj.zIndex !== undefined) styles.push(`z-index: ${obj.zIndex}`);
      }

      if (obj.type === "image" || obj.type === "group") {
        if (obj.width !== undefined && !obj.autoWidth)
          styles.push(`width: ${toPx(obj.width)}`);
        if (obj.height !== undefined && !obj.autoHeight)
          styles.push(`height: ${toPx(obj.height)}`);
        if (obj.autoWidth) styles.push(`width: auto`);
        if (obj.autoHeight) styles.push(`height: auto`);
      }

      if (obj.type === "image") styles.push(`overflow: hidden`);
      if (obj.type === "image" || obj.type === "figure")
        styles.push(`cursor: move`);

      if (obj.type === "group") {
        if (obj.display) styles.push(`display: ${obj.display}`);
        if (obj.flexDirection)
          styles.push(`flex-direction: ${obj.flexDirection}`);
        if (obj.justifyContent)
          styles.push(`justify-content: ${obj.justifyContent}`);
        if (obj.alignItems) styles.push(`align-items: ${obj.alignItems}`);
        if (obj.gap) styles.push(`gap: ${toPx(obj.gap)}`);
        styles.push(generateBorderStyles(obj)); // border for group (outer)
      }

      if (obj.rotate !== undefined)
        styles.push(`transform: rotate(${obj.rotate}deg)`);
    } else {
      if ((isText || obj.type === "figure") && !isGroupChild) {
        if (obj.width !== undefined && !obj.autoWidth)
          styles.push(`width: ${toPx(obj.width)}`);
        if (obj.height !== undefined && !obj.autoHeight)
          styles.push(`height: ${toPx(obj.height)}`);
        if (obj.autoWidth) styles.push(`width: auto`);
        if (obj.autoHeight) styles.push(`height: auto`);
      }

      if (obj.type === "text") {
        styles.push(`word-break: break-word`);
        styles.push(`overflow: hidden`);
      }

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
        styles.push(`white-space: normal`);
      } else {
        styles.push(`white-space: nowrap`);
      }

      if (obj.objectFit) styles.push(`object-fit: ${obj.objectFit}`);

      if (obj.type === "image" || obj.type === "figure") {
        styles.push(`width: ${toPx(obj.width)}; height: ${toPx(obj.height)};`);
      }

      if (obj.type === "figure") {
        styles.push(generateBorderStyles(obj)); // border for figure (inner)
      }
    }

    if (obj.backgroundColor)
      styles.push(`background-color: ${toRGB(obj.backgroundColor)}`);
    if (obj.borderRadius)
      styles.push(`border-radius: ${toPx(obj.borderRadius)}`);
    if (obj.opacity) styles.push(`opacity: ${obj.opacity}`);
    if (obj.paddingTop) styles.push(`padding-top: ${toPx(obj.paddingTop)}`);
    if (obj.paddingBottom)
      styles.push(`padding-bottom: ${toPx(obj.paddingBottom)}`);
    if (obj.paddingLeft) styles.push(`padding-left: ${toPx(obj.paddingLeft)}`);
    if (obj.paddingRight)
      styles.push(`padding-right: ${toPx(obj.paddingRight)}`);

    return styles.join("; ");
  };

  const generateObjectHTML = (
    obj: BannerObject | BannerChild,
    isChild = false,
    isGroupChild = false
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
    const dynamicAttr =
      obj.type === "image" &&
      (obj.dynamicsLogo || obj.object_id || obj.logoName)
        ? `data-dynamic='${JSON.stringify({
            dynamicsLogo: obj.dynamicsLogo ?? undefined,
            object_id: obj.object_id ?? undefined,
            logoName: obj.logoName ?? undefined,
          })}'`
        : "";
    const idAttr = `id="${obj.id}"`;
    const classAttr = isChild
      ? `class="banner-object-child"`
      : `class="banner-object"`;

    if (obj.type === "text") {
      const rawMaxLines = obj.maxLines;
      const maxLines =
        typeof rawMaxLines === "number" && rawMaxLines > 0 ? rawMaxLines : 20;
      let lines = String(obj.content || "").split("\n");
      const isTruncated = lines.length > maxLines;
      lines = lines.slice(0, maxLines);
      const processedContent =
        lines.map((line) => escapeHTML(line)).join("<br>") +
        (isTruncated ? "<br>" : "");
      const content = `<div ${
        isChild ? idAttr : ""
      } ${conditionAttr} class="text-field ${
        isChild ? "banner-object-child" : ""
      }" data-max-lines="${
        obj.maxLines || ""
      }" style="${innerStyles};">${processedContent}</div>`;
      return isChild
        ? content
        : `<div ${idAttr} ${conditionAttr} ${classAttr} style="${outerStyles}">${content}</div>`;
    }

    if (obj.type === "image") {
      if (!obj.src) return "";
      const content = `<img ${
        isChild ? idAttr : ""
      } ${conditionAttr} ${dynamicAttr} src="${obj.src}" alt="${
        obj.name || "image"
      }" loading="eager" class="image-field ${
        isChild ? "banner-object-child" : ""
      }" style="${innerStyles}; background: transparent;" />`;
      return isChild
        ? content
        : `<div ${idAttr} ${conditionAttr} ${classAttr} style="${outerStyles}">${content}</div>`;
    }

    if (obj.type === "figure") {
      const content = `<div ${
        isChild ? idAttr : ""
      } ${conditionAttr} class="banner-figure ${
        isChild ? "banner-object-child" : ""
      }" style="${innerStyles}"></div>`;
      return isChild
        ? content
        : `<div ${idAttr} ${conditionAttr} ${classAttr} style="${outerStyles}">${content}</div>`;
    }

    if (obj.type === "group" && obj.children) {
      const groupContent = obj.children
        .filter((child) => child && child.id && child.type)
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
        .map((child) => generateObjectHTML(child, true, true))
        .join("");
      return `<div ${idAttr} ${conditionAttr} ${classAttr} style="${outerStyles}">${groupContent}</div>`;
    }

    return "";
  };

  const generateTopLevelHTML = (obj: BannerObject): string => {
    const objectHTML = generateObjectHTML(obj, false, false);
    if (obj.conditionForAbstract) {
      const abstractConditionAttr = `abstract-data-condition='${JSON.stringify(
        obj.conditionForAbstract
      )}'`;
      return objectHTML.replace(/^<div/, `<div ${abstractConditionAttr}`);
    }
    return objectHTML;
  };

  return objects
    .sort((a, b) => (a.zIndex ?? 0) - (b.zIndex ?? 0))
    .map((obj) => generateTopLevelHTML(obj))
    .join("");
};
