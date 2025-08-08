import { jsx as _jsx } from "react/jsx-runtime";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import * as WebFont from "webfontloader";
import { fonts } from "../../../constants/fonts";
import { useTranslation } from "react-i18next";
import { useConfig } from "../../../context/ConfigContext";
const ChildFontSelector = ({ value, onChange, }) => {
    const { config } = useConfig();
    const customFontOptions = (config.customFonts || []).map((font) => ({
        label: font.font_name,
        value: font.font_family,
        category: "custom",
    }));
    const allFonts = [...fonts, ...customFontOptions];
    const handleFontChange = (event, selectedOption) => {
        if (!selectedOption)
            return;
        const font = selectedOption.value;
        WebFont.load({
            google: {
                families: ["Roboto", "Open Sans"],
                text: "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZа бвгдеёжзийклмнопрстуфхцчшщыьэюя",
            },
        });
        onChange(font);
    };
    const { t } = useTranslation();
    return (_jsx(Autocomplete, { options: allFonts, getOptionLabel: (option) => option.label, value: allFonts.find((font) => font.value === value) || null, onChange: handleFontChange, style: { marginTop: "30px" }, renderInput: (params) => (_jsx(TextField, { ...params, label: t("sidebar.font"), variant: "outlined", slotProps: {
                input: {
                    ...params.InputProps,
                    style: {
                        fontFamily: value,
                        padding: "0px 6px",
                        marginBottom: 8,
                        border: "1px solid #E4E4E4",
                        backgroundColor: "white",
                    },
                },
            } })), renderOption: (props, option) => (_jsx("li", { ...props, style: { fontFamily: option.value }, children: option.label })) }));
};
export default ChildFontSelector;
