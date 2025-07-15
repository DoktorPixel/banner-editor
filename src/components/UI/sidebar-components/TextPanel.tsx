import { useState, Suspense } from "react";
import { Box, Button, TextField, Typography, Tooltip } from "@mui/material";
import { useBanner } from "../../../context/BannerContext";
import { useTranslation } from "react-i18next";

const TextPanel: React.FC = () => {
  const [textContent, setTextContent] = useState("");
  const [disabledButton, setDisabledButton] = useState<string | null>(null);
  const { addObject } = useBanner();
  const { t } = useTranslation();

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
    <Suspense fallback={<div>Loading translations...</div>}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          width: "100%",
        }}
      >
        <TextField
          label={t("textPanel.inputPlaceholder")}
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
          {t("textPanel.addTextButton")}
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
            {t("textPanel.title")}
          </Typography>

          <Tooltip
            title={t("textPanel.dynamicPlaceholderTooltip")}
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
                {t("textPanel.dynamicPlaceholderButton")}
              </Button>
            </span>
          </Tooltip>

          <Tooltip
            title={t("textPanel.formattedPriceTooltip")}
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
                {t("textPanel.formattedPriceButton")}
              </Button>
            </span>
          </Tooltip>

          <Tooltip
            title={t("textPanel.formattedSalePriceTooltip")}
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
                {t("textPanel.formattedSalePriceButton")}
              </Button>
            </span>
          </Tooltip>

          <Tooltip
            title={t("textPanel.discountTooltip")}
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
                {t("textPanel.discountButton")}
              </Button>
            </span>
          </Tooltip>

          <Tooltip
            title={t("textPanel.discountCurrencyTooltip")}
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
                {t("textPanel.discountCurrencyButton")}
              </Button>
            </span>
          </Tooltip>

          <Tooltip
            title={t("textPanel.actualPriceTooltip")}
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
                {t("textPanel.actualPriceButton")}
              </Button>
            </span>
          </Tooltip>
        </Box>
      </Box>
    </Suspense>
  );
};

export default TextPanel;
