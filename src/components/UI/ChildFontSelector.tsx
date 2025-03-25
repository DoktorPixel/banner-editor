import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import * as WebFont from "webfontloader";
import { fonts } from "../../constants/fonts";

interface FontSelectorProps {
  value: string;
  onChange: (font: string) => void;
}

const ChildFontSelector: React.FC<FontSelectorProps> = ({
  value,
  onChange,
}) => {
  const handleFontChange = (
    event: React.SyntheticEvent,
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
      style={{ marginTop: "30px" }}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Font"
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

export default ChildFontSelector;
