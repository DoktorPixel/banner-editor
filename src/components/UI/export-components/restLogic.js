// window.onload = async function () {
async function loadData() {
  const props = window.props || {};
  const promises = [];

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
  let salePrice = undefined;
  if (
    props.sale_price !== undefined &&
    props.sale_price !== null &&
    props.sale_price !== ""
  ) {
    salePrice = normalize(props.sale_price);
    if (!isNaN(price) && !isNaN(salePrice)) {
      if (salePrice >= price) {
        delete props.sale_price;
      }
    }
  }

  // data-condition , abstract-data-condition
  function processConditionAttribute(attrName) {
    document.querySelectorAll(`[${attrName}]`).forEach((element) => {
      try {
        const raw = element.getAttribute(attrName);
        if (!raw) return;

        const {
          type,
          props: conditionProps = [],
          state,
          compareValue,
        } = JSON.parse(raw) || {};
        const isExpression = (prop) => /\{\{[\s\S]*\}\}/.test(prop);
        const evaluatePropValue = (prop) =>
          isExpression(prop)
            ? replaceDynamicText(prop, props) ?? ""
            : props[prop];

        if (state === "exist" || state === "noExist") {
          const propsExist = conditionProps.some((prop) =>
            isExpression(prop)
              ? (evaluatePropValue(prop) ?? "") !== ""
              : Object.prototype.hasOwnProperty.call(props, prop)
          );

          const shouldHide =
            state === "exist"
              ? (type === "hideIf" && propsExist) ||
                (type === "showIf" && !propsExist)
              : (type === "hideIf" && !propsExist) ||
                (type === "showIf" && propsExist);

          if (shouldHide) element.style.display = "none";
          return;
        }

        const propToCompareRaw = conditionProps[0];
        if (!propToCompareRaw) return;

        const actualValue = evaluatePropValue(propToCompareRaw);
        let shouldHide = false;

        if (actualValue === undefined || actualValue === "") {
          shouldHide = type === "showIf";
        } else {
          const targetValue = compareValue ?? "";
          const clean = (val) =>
            Number(
              String(val)
                .replace(/[^\d.,-]/g, "")
                .replace(",", ".")
            );

          const actualNum = clean(actualValue);
          const targetNum = clean(targetValue);
          const bothAreNumbers = !isNaN(actualNum) && !isNaN(targetNum);

          const doesComparisonHold = () => {
            switch (state) {
              case "eq":
                return actualValue === targetValue;
              case "not-eq":
                return actualValue !== targetValue;
              case "more-than":
                return bothAreNumbers
                  ? actualNum > targetNum
                  : actualValue > targetValue;
              case "less-than":
                return bothAreNumbers
                  ? actualNum < targetNum
                  : actualValue < targetValue;
              case "more-or-eq":
                return bothAreNumbers
                  ? actualNum >= targetNum
                  : actualValue >= targetValue;
              case "less-or-eq":
                return bothAreNumbers
                  ? actualNum <= targetNum
                  : actualValue <= targetValue;
              default:
                return false;
            }
          };

          const comparisonResult = doesComparisonHold();
          shouldHide = type === "hideIf" ? comparisonResult : !comparisonResult;
        }

        if (shouldHide) element.style.display = "none";
      } catch (error) {
        console.error(`Error parsing ${attrName}`, error);
      }
    });
  }

  ["data-condition", "abstract-data-condition"].forEach(
    processConditionAttribute
  );

  function replaceDynamicText(content, props, maxLines, approxCharsPerLine) {
    let result = content;

    const functionRegex = /\{\{\s*(\w+)\s*\(([^)]*?)\)\s*\}\}/g;
    result = result.replace(functionRegex, (match, funcName, args) => {
      const argKeys = args
        .split(",")
        .map((arg) => arg.trim())
        .filter((arg) => arg);
      const values = argKeys.map((key) => props?.[key] ?? "");

      const normalizeNumber = (value) => {
        if (typeof value !== "string") return "";
        return value.replace(/,/g, ".");
      };

      const toNumber = (value) => {
        if (!value) return NaN;
        return parseFloat(normalizeNumber(value).replace(/[^\d.]/g, ""));
      };

      switch (funcName) {
        case "format": {
          const num = toNumber(values[0]);
          if (isNaN(num)) return match;
          return Math.round(num).toLocaleString("ru", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          });
        }

        case "discount": {
          const price = toNumber(values[0]);
          const salePrice = toNumber(values[1]);
          if (isNaN(price) || isNaN(salePrice) || price === 0) return "0";
          const discount = ((price - salePrice) / price) * 100;
          return Math.round(discount).toString();
        }

        case "discountCurrency": {
          const price = toNumber(values[0]);
          const salePrice = toNumber(values[1]);
          if (isNaN(price) || isNaN(salePrice)) return "0";
          const difference = price - salePrice;
          return Math.round(difference).toString();
        }

        case "min": {
          const numericValues = values.map(toNumber).filter((n) => !isNaN(n));
          if (numericValues.length === 0) return "";
          const minValue = Math.min(...numericValues);
          return Math.round(minValue).toLocaleString("ru", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          });
        }

        default:
          return match;
      }
    });

    for (const key in props) {
      const dynamicKey = new RegExp(`{{\\s*${key}\\s*}}`, "g");
      result = result.replace(dynamicKey, props[key] ?? "");
    }

    if (
      typeof maxLines === "number" &&
      maxLines > 0 &&
      approxCharsPerLine > 0
    ) {
      const maxChars = maxLines * approxCharsPerLine;
      if (result.length > maxChars) {
        result = result.slice(0, maxChars) + "...";
      }
    }

    return result;
  }

  document.querySelectorAll(".text-field").forEach((element) => {
    try {
      const content = element.innerHTML || "";
      if (content) {
        const newContent = replaceDynamicText(content, props);
        if (newContent) {
          element.innerHTML = newContent;
        }
      }
    } catch (error) {
      console.error("Error replacing dynamic text:", error);
    }
  });

  function calculateApproxCharsPerLine(element) {
    const style = getComputedStyle(element);
    const font =
      style.fontWeight + " " + style.fontSize + " " + style.fontFamily;
    const widthPx = parseFloat(style.width);
    let letterSpacing = style.letterSpacing;
    let letterSpacingPx =
      letterSpacing === "normal" ? 0 : parseFloat(letterSpacing) || 0;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    ctx.font = font;
    const sampleText = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const textWidth = ctx.measureText(sampleText).width;
    const avgCharWidth = textWidth / sampleText.length;
    const avgCharTotalWidth = avgCharWidth + letterSpacingPx;
    if (avgCharTotalWidth <= 0) return 100;
    const approxCharsPerLine = Math.floor((widthPx / avgCharTotalWidth) * 0.97);
    return approxCharsPerLine;
  }

  document.querySelectorAll(".text-field").forEach((element) => {
    try {
      const content = element.innerHTML || "";
      const maxLinesAttr = element.getAttribute("data-max-lines");
      const maxLines = maxLinesAttr ? parseInt(maxLinesAttr, 10) : undefined;

      const approxCharsPerLine = calculateApproxCharsPerLine(element);

      const newContent = replaceDynamicText(
        content,
        props,
        maxLines,
        approxCharsPerLine
      );
      if (newContent) {
        element.innerHTML = newContent;
      }
    } catch (error) {
      console.error("Error replacing dynamic text:", error);
    }
  });

  //
  document.querySelectorAll("img[data-dynamic]").forEach((img) => {
    const p = new Promise((resolve) => {
      const hideImage = () => {
        const container = img.closest(".banner-object");
        if (container) container.style.display = "none";
        img.style.display = "none";
        img.src = fallbackUrl;
        img.onload = img.onerror = () => resolve();
      };

      try {
        const dataAttr = img.getAttribute("data-dynamic");
        if (!dataAttr) {
          hideImage();
          return;
        }

        const { object_id, logoName } = JSON.parse(dataAttr);

        if (!object_id || !logoName) {
          hideImage();
          return;
        }

        const filtered = dynamicImgs.filter((di) => di.object_id === object_id);

        if (filtered.length === 0) {
          hideImage();
          return;
        }

        const logoNameValue = props[logoName];
        if (typeof logoNameValue !== "string") {
          hideImage();
          return;
        }

        const matched = filtered.find((di) => di.name === logoNameValue);
        const finalSrc = matched?.file_url;

        if (!finalSrc) {
          hideImage();
          return;
        }

        img.onload = () => resolve();
        img.onerror = () => {
          hideImage();
          resolve();
        };
        img.src = finalSrc;
      } catch (e) {
        console.warn("Error processing dynamic img:", e);
        hideImage();
      }
    });

    promises.push(p);
  });

  await Promise.all(promises);
  window.allImagesLoaded = true;
  console.log("✅ All dynamic images loaded");

  (function waitForImages() {
    const imgs = document.querySelectorAll("img#replacing_img");
    if (!imgs.length) return;
    let loadedCount = 0;
    const total = imgs.length;
    function checkAllLoaded() {
      if (loadedCount >= total) {
        const evt = new CustomEvent("allImagesLoaded", {
          detail: { total },
        });
        window.dispatchEvent(evt);
      }
    }
    imgs.forEach((img) => {
      function onLoad() {
        if (img.naturalWidth > 0) {
          loadedCount++;
          checkAllLoaded();
        }
      }

      if (img.complete && img.naturalWidth > 0) {
        loadedCount++;
        checkAllLoaded();
      } else {
        img.addEventListener("load", onLoad, { once: true });
        img.addEventListener(
          "error",
          () => {
            console.warn("Error loading image:", img.src);
            loadedCount++;
            checkAllLoaded();
          },
          { once: true }
        );
      }
    });
  })();

  //
}
