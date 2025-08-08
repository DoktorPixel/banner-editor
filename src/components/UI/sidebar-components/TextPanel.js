import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, Suspense } from "react";
import { Box, Button, TextField, Typography, Tooltip } from "@mui/material";
import { useBanner } from "../../../context/BannerContext";
import { useTranslation } from "react-i18next";
const TextPanel = () => {
    const [textContent, setTextContent] = useState("");
    const [disabledButton, setDisabledButton] = useState(null);
    const { addObject } = useBanner();
    const { t } = useTranslation();
    const handleAddText = () => {
        if (!textContent.trim())
            return;
        addObject({
            id: Date.now(),
            type: "text",
            x: 50,
            y: 50,
            width: 200,
            height: 50,
            content: textContent,
            fontSize: 16,
            fontFamily: "Roboto",
            color: "#000000",
            name: "",
        });
        setTextContent("");
    };
    const handleAddDynamicObject = (content, name) => {
        setDisabledButton(name);
        addObject({
            id: Date.now(),
            type: "text",
            x: 50,
            y: 50,
            width: 200,
            height: 50,
            content,
            fontSize: 16,
            fontFamily: "Roboto",
            color: "#000000",
            name,
        });
        setTimeout(() => setDisabledButton(null), 1000);
    };
    return (_jsx(Suspense, { fallback: _jsx("div", { children: "Loading translations..." }), children: _jsxs(Box, { sx: {
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                width: "100%",
            }, children: [_jsx(TextField, { label: t("textPanel.inputPlaceholder"), value: textContent, onChange: (e) => setTextContent(e.target.value), fullWidth: true, maxRows: 5, multiline: true }), _jsx(Button, { variant: "contained", onClick: handleAddText, disabled: !textContent.trim(), children: t("textPanel.addTextButton") }), _jsx("div", { className: "grey-line" }), _jsxs(Box, { sx: {
                        display: "flex",
                        flexDirection: "column",
                        width: "100%",
                        gap: "10px",
                    }, children: [_jsx(Typography, { variant: "subtitle2", mb: 1, children: t("textPanel.title") }), _jsx(Tooltip, { title: t("textPanel.dynamicPlaceholderTooltip"), placement: "right", arrow: true, children: _jsx("span", { children: _jsx(Button, { variant: "outlined", onClick: () => handleAddDynamicObject("{{...}}", "Dynamic Placeholder"), disabled: disabledButton === "Dynamic Placeholder", fullWidth: true, children: t("textPanel.dynamicPlaceholderButton") }) }) }), _jsx(Tooltip, { title: t("textPanel.formattedPriceTooltip"), placement: "right", arrow: true, children: _jsx("span", { children: _jsx(Button, { variant: "outlined", onClick: () => handleAddDynamicObject("{{format(price)}}", "Formatted Price"), disabled: disabledButton === "Formatted Price", fullWidth: true, children: t("textPanel.formattedPriceButton") }) }) }), _jsx(Tooltip, { title: t("textPanel.formattedSalePriceTooltip"), placement: "right", arrow: true, children: _jsx("span", { children: _jsx(Button, { variant: "outlined", onClick: () => handleAddDynamicObject("{{format(sale_price)}}", "Formatted Sale Price"), disabled: disabledButton === "Formatted Sale Price", fullWidth: true, children: t("textPanel.formattedSalePriceButton") }) }) }), _jsx(Tooltip, { title: t("textPanel.discountTooltip"), placement: "right", arrow: true, children: _jsx("span", { children: _jsx(Button, { variant: "outlined", onClick: () => handleAddDynamicObject("{{discount(price, sale_price)}} %", "Discount"), disabled: disabledButton === "Discount", fullWidth: true, children: t("textPanel.discountButton") }) }) }), _jsx(Tooltip, { title: t("textPanel.discountCurrencyTooltip"), placement: "right", arrow: true, children: _jsx("span", { children: _jsx(Button, { variant: "outlined", onClick: () => handleAddDynamicObject("{{discountCurrency(price, sale_price)}}", "DiscountCurrency"), disabled: disabledButton === "DiscountCurrency", fullWidth: true, children: t("textPanel.discountCurrencyButton") }) }) }), _jsx(Tooltip, { title: t("textPanel.actualPriceTooltip"), placement: "right", arrow: true, children: _jsx("span", { children: _jsx(Button, { variant: "outlined", onClick: () => handleAddDynamicObject("{{min(price, sale_price)}}", "Actual Price"), disabled: disabledButton === "Actual Price", fullWidth: true, children: t("textPanel.actualPriceButton") }) }) })] })] }) }));
};
export default TextPanel;
