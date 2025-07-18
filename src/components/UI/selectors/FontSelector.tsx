import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import * as WebFont from "webfontloader";
import { fonts } from "../../../constants/fonts";
import { useTranslation } from "react-i18next";
import { useConfig } from "../../../context/ConfigContext";

interface FontSelectorProps {
  value: string;
  onChange: (font: string) => void;
}

const FontSelector: React.FC<FontSelectorProps> = ({ value, onChange }) => {
  const { t } = useTranslation();
  const { config } = useConfig();

  const customFontOptions = (config.customFonts || []).map((font) => ({
    label: font.font_name,
    value: font.font_family,
    category: "custom" as const,
  }));

  const allFonts = [...fonts, ...customFontOptions];

  const handleFontChange = (
    event: React.SyntheticEvent,
    selectedOption: { label: string; value: string; category: string } | null
  ) => {
    if (!selectedOption) return;

    const font = selectedOption.value;

    if (selectedOption.category !== "custom") {
      WebFont.load({
        google: {
          families: [font],
        },
      });
    }

    onChange(font);
  };

  return (
    <Autocomplete
      options={allFonts}
      getOptionLabel={(option) => option.label}
      value={allFonts.find((font) => font.value === value) || null}
      onChange={handleFontChange}
      style={{ marginTop: "30px" }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={t("sidebar.font")}
          variant="outlined"
          slotProps={{
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
          }}
        />
      )}
      renderOption={(props, option) => (
        <li {...props} style={{ fontFamily: option.value }}>
          {option.label}
        </li>
      )}
    />
  );
};

export default FontSelector;
