import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import * as WebFont from "webfontloader";
import { fonts } from "../../constants/fonts";

interface FontSelectorProps {
  value: string;
  onChange: (font: string) => void;
}

const FontSelector: React.FC<FontSelectorProps> = ({ value, onChange }) => {
  const handleFontChange = (
    event: React.SyntheticEvent<Element, Event>,
    selectedOption: { label: string; value: string } | null
  ) => {
    if (!selectedOption) return;

    const font = selectedOption.value;

    WebFont.load({
      google: {
        families: ["Roboto", "Open Sans"],
        text: "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZа бвгдеёжзийклмнопрстуфхцчшщыьэюя",
      },
    });

    onChange(font);
  };

  return (
    <Autocomplete
      options={fonts}
      getOptionLabel={(option) => option.label}
      value={fonts.find((font) => font.value === value) || null}
      onChange={handleFontChange}
      style={{ marginTop: 16 }}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Виберіть шрифт..."
          variant="outlined"
          InputProps={{
            ...params.InputProps,
            style: {
              fontFamily: value,
              padding: "0px 6px",
              marginBottom: 8,
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
