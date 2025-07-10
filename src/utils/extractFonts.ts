import { BannerObject, BannerChild } from "../types";

export function extractFontsFromObjects(
  objects: (BannerObject | BannerChild)[]
): string[] {
  const fonts: string[] = [];

  for (const obj of objects) {
    if (typeof obj.fontFamily === "string") {
      fonts.push(obj.fontFamily);
    }

    if (Array.isArray(obj.children)) {
      fonts.push(...extractFontsFromObjects(obj.children));
    }
  }

  return Array.from(new Set(fonts));
}
