import { useState } from "react";
import { Box, Button, TextField, Typography, Tooltip } from "@mui/material";
import { useBanner } from "../../../context/BannerContext";
import { useT } from "../../../i18n/useT";

const TextPanel: React.FC = () => {
  const [textContent, setTextContent] = useState("");
  const [disabledButton, setDisabledButton] = useState<string | null>(null);
  const { addObject } = useBanner();
  const t = useT();

  const handleAddText = () => {
    if (!textContent.trim()) return;

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

  const handleAddDynamicObject = (content: string, name: string) => {
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

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        width: "100%",
      }}
    >
      <TextField
        label="Type text here"
        value={textContent}
        onChange={(e) => setTextContent(e.target.value)}
        fullWidth
        maxRows={5}
        multiline
      />
      <Button
        variant="contained"
        onClick={handleAddText}
        disabled={!textContent.trim()}
      >
        Add Text
      </Button>
      <div className="grey-line"></div>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          gap: "10px",
        }}
      >
        <Typography variant="subtitle2" mb={1}>
          {t("textPanel").title}
        </Typography>
        <Tooltip
          title="{{...}} instead of ... insert a dynamic value"
          placement="right"
          arrow
        >
          <span>
            <Button
              variant="outlined"
              onClick={() =>
                handleAddDynamicObject("{{...}}", "Dynamic Placeholder")
              }
              disabled={disabledButton === "Dynamic Placeholder"}
              fullWidth
            >
              Dynamic Placeholder
            </Button>
          </span>
        </Tooltip>

        <Tooltip
          title="{{format(price)}} formats the price, without currency"
          placement="right"
          arrow
        >
          <span>
            <Button
              variant="outlined"
              onClick={() =>
                handleAddDynamicObject("{{format(price)}}", "Formatted Price")
              }
              disabled={disabledButton === "Formatted Price"}
              fullWidth
            >
              Formatted Price
            </Button>
          </span>
        </Tooltip>

        <Tooltip
          title="{{format(sale_price)}} formats the sale_price, without currency"
          placement="right"
          arrow
        >
          <span>
            <Button
              variant="outlined"
              onClick={() =>
                handleAddDynamicObject(
                  "{{format(sale_price)}}",
                  "Formatted Sale Price"
                )
              }
              disabled={disabledButton === "Formatted Sale Price"}
              fullWidth
            >
              Formatted Sale Price
            </Button>
          </span>
        </Tooltip>

        <Tooltip
          title="{{discount(price, sale_price)}} Calculate discount in %"
          placement="right"
          arrow
        >
          <span>
            <Button
              variant="outlined"
              onClick={() =>
                handleAddDynamicObject(
                  "{{discount(price, sale_price)}} %",
                  "Discount"
                )
              }
              disabled={disabledButton === "Discount"}
              fullWidth
            >
              Discount in %
            </Button>
          </span>
        </Tooltip>

        <Tooltip
          title="{{discountCurrency(price, sale_price)}}  Calculate discount in Currency"
          placement="right"
          arrow
        >
          <span>
            <Button
              variant="outlined"
              onClick={() =>
                handleAddDynamicObject(
                  "{{discountCurrency(price, sale_price)}}",
                  "DiscountCurrency"
                )
              }
              disabled={disabledButton === "DiscountCurrency"}
              fullWidth
            >
              Discount in Currency
            </Button>
          </span>
        </Tooltip>

        <Tooltip
          title="{{min(price, sale_price)}} returns the minimum of two values"
          placement="right"
          arrow
        >
          <span>
            <Button
              variant="outlined"
              onClick={() =>
                handleAddDynamicObject(
                  "{{min(price, sale_price)}}",
                  "Actual Price"
                )
              }
              disabled={disabledButton === "Actual Price"}
              fullWidth
            >
              Actual Price
            </Button>
          </span>
        </Tooltip>
      </Box>
    </Box>
  );
};

export default TextPanel;
