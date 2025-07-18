import { ConfigItem } from "../types";

export const generateCustomFontLinks = (config: ConfigItem): string => {
  if (!config.customFonts || config.customFonts.length === 0) return "";

  return config.customFonts
    .map((font) => {
      const { font_family, file_url, font_format } = font;
      const format = font_format.toLowerCase();
      const formatMap: Record<string, string> = {
        woff: "woff",
        woff2: "woff2",
        ttf: "truetype",
        otf: "opentype",
      };

      const resolvedFormat = formatMap[format] || "truetype";

      return `
        @font-face {
          font-family: '${font_family}';
          src: url('${file_url}') format('${resolvedFormat}');
          font-display: swap;
        }`;
    })
    .join("\n");
};
