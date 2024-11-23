import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useState } from "react";
const BannerContext = createContext(undefined);
export const BannerProvider = ({ children, }) => {
    const [history, setHistory] = useState([[]]);
    const [currentStep, setCurrentStep] = useState(0);
    const objects = history[currentStep] || [];
    const addObject = (object) => {
        const newObjects = [
            ...objects,
            { ...object, width: object.width || 300, height: object.height || 300 },
        ];
        updateHistory(newObjects);
    };
    const updateObject = (id, updates) => {
        const newObjects = objects.map((obj) => obj.id === id ? { ...obj, ...updates } : obj);
        updateHistory(newObjects);
    };
    const deleteObject = (id) => {
        const newObjects = objects.filter((obj) => obj.id !== id);
        updateHistory(newObjects);
    };
    const updateHistory = (newObjects) => {
        const newHistory = [...history.slice(0, currentStep + 1), newObjects];
        setHistory(newHistory);
        setCurrentStep(newHistory.length - 1);
    };
    const undo = () => {
        if (canUndo)
            setCurrentStep((prev) => prev - 1);
    };
    const redo = () => {
        if (canRedo)
            setCurrentStep((prev) => prev + 1);
    };
    const canUndo = currentStep > 0;
    const canRedo = currentStep < history.length - 1;
    return (_jsx(BannerContext.Provider, { value: {
            objects,
            addObject,
            updateObject,
            deleteObject,
            undo,
            redo,
            canUndo,
            canRedo,
        }, children: children }));
};
export const useBanner = () => {
    const context = useContext(BannerContext);
    if (!context) {
        throw new Error("useBanner must be used within a BannerProvider");
    }
    return context;
};
