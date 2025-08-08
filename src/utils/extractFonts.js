export function extractFontsFromObjects(objects) {
    const fonts = [];
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
