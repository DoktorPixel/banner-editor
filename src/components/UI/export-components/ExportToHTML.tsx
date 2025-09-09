import { BannerObject, ConfigItem, DynamicImg } from "../../../types/index";
import { GenerateObjectsHTML } from "./GeneateObjectsHTML";
import { generateGoogleFontsLinks } from "../../../utils/generateGoogleFonts";
import { extractFontsFromObjects } from "../../../utils/extractFonts";
import { generateCustomFontLinks } from "../../../utils/generateCustomFontLinks";
import restLogic from "./restLogic.js?raw";

export const ExportToHTML = (
  objects: BannerObject[],
  config: ConfigItem,
  dynamicImgs: DynamicImg[] = []
): string => {
  const objectsHTML = GenerateObjectsHTML(objects);
  const width = config.canvasSize?.width || 1080;
  const height = config.canvasSize?.height || 1080;
  const usedFonts = extractFontsFromObjects(objects);
  const fontLinks = generateGoogleFontsLinks(usedFonts);
  const fontFaceCSS = generateCustomFontLinks(config);

  return `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Exported Banner</title>
      ${fontLinks}
      <style>
      ${fontFaceCSS}
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
       const fallbackUrl = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/xcAAgMBgDgmIwUAAAAASUVORK5CYII=";
          ${restLogic}
      </script>
    </body>
  </html>`;
};
