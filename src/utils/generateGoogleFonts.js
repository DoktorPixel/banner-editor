const weights = "300;400;500;600;700";
export const generateGoogleFontsLinks = (fontList) => {
    const uniqueFonts = Array.from(new Set(fontList));
    return uniqueFonts
        .map((font) => {
        const encodedFont = font.trim().replace(/ /g, "+");
        return `<link href="https://fonts.googleapis.com/css2?family=${encodedFont}:wght@${weights}&display=swap" rel="stylesheet">`;
    })
        .join("\n");
};
