import { useEffect } from "react";
import { generateCustomFontLinks } from "../utils/generateCustomFontLinks";
import { ConfigItem } from "../types";

export const useInjectCustomFonts = (config: ConfigItem) => {
  useEffect(() => {
    if (!config.customFonts || config.customFonts.length === 0) return;

    const styleTagId = "custom-fonts-style";

    const existing = document.getElementById(styleTagId);
    if (existing) {
      existing.remove();
    }

    const style = document.createElement("style");
    style.id = styleTagId;
    style.innerHTML = generateCustomFontLinks(config);

    document.head.appendChild(style);
  }, [config.customFonts]);
};
