import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useState } from "react";
const ConfigContext = createContext(undefined);
export const ConfigProvider = ({ children, }) => {
    const [config, setConfig] = useState({
        hiddenObjectIds: [],
        keyValuePairs: [
            { key: "title", value: "Назва продукту" },
            { key: "img", value: "https://placehold.co/300" },
            { key: "price", value: "1000" },
            { key: "sale_price", value: "800 UAH" },
        ],
        canvasSize: { width: 1080, height: 1080 },
        customFonts: [],
    });
    const toggleHiddenObject = (id) => {
        setConfig((prev) => {
            const alreadyHidden = prev.hiddenObjectIds.includes(id);
            const updatedIds = alreadyHidden
                ? prev.hiddenObjectIds.filter((i) => i !== id)
                : [...prev.hiddenObjectIds, id];
            return { ...prev, hiddenObjectIds: updatedIds };
        });
    };
    const updateCanvasSize = (width, height) => {
        setConfig((prev) => ({
            ...prev,
            canvasSize: { width, height },
        }));
    };
    const setCustomFonts = (fonts) => {
        setConfig((prev) => ({ ...prev, customFonts: fonts }));
    };
    const addCustomFont = (font) => {
        setConfig((prev) => ({
            ...prev,
            customFonts: [...(prev.customFonts ?? []), font],
        }));
    };
    const removeCustomFont = (fontId) => {
        setConfig((prev) => ({
            ...prev,
            customFonts: (prev.customFonts ?? []).filter((f) => f.id !== fontId),
        }));
    };
    return (_jsx(ConfigContext.Provider, { value: {
            config,
            setConfig,
            hiddenObjectIds: config.hiddenObjectIds,
            toggleHiddenObject,
            updateCanvasSize,
            canvasSize: config.canvasSize,
            setCustomFonts,
            addCustomFont,
            removeCustomFont,
        }, children: children }));
};
export const useConfig = () => {
    const context = useContext(ConfigContext);
    if (!context) {
        throw new Error("useConfig must be used within a ConfigProvider");
    }
    return context;
};
