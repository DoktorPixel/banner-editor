import React from "react";
import { ButtonGroup, Button, Box, InputLabel } from "@mui/material";
import { useTranslation } from "react-i18next";
import {
  // TextLineThrough,
  // TextOverline,
  TextDecorationNone,
  // TextUnderline,
} from "../../../assets/icons";

interface TextTransformSelectorProps {
  value: React.CSSProperties["textTransform"];
  onChange: (value: React.CSSProperties["textTransform"]) => void;
}

export const TextTransformSelector: React.FC<TextTransformSelectorProps> = ({
  value,
  onChange,
}) => {
  const { t } = useTranslation();

  return (
    <Box>
      <InputLabel sx={{ mb: "5px", fontSize: "12px" }}>
        {t("sidebar.textTransformTitle")}
      </InputLabel>
      <ButtonGroup color="primary" size="small" sx={{ boxShadow: "none" }}>
        <Button
          onClick={() => onChange("none")}
          sx={{
            height: "36px",
            padding: "0 10px",
            backgroundColor: value === "none" ? "white" : "#F1F1F1",
            border: "2px solid #F1F1F1",
            color: value === "none" ? "black" : "inherit",
            "&:hover": {
              backgroundColor: value === "none" ? "white" : "#E8E8E8",
            },
          }}
        >
          <TextDecorationNone width="24px" height="24px" />
        </Button>
        <Button
          onClick={() => onChange("uppercase")}
          sx={{
            height: "36px",
            padding: "0 10px",
            backgroundColor: value === "uppercase" ? "white" : "#F1F1F1",
            border: "2px solid #F1F1F1",
            color: value === "uppercase" ? "black" : "inherit",
            "&:hover": {
              backgroundColor: value === "uppercase" ? "white" : "#E8E8E8",
            },
          }}
        >
          {/* <TextUnderline width="24px" height="24px" /> */}
          <p className="text-transform-buttons">AA</p>
        </Button>
        <Button
          onClick={() => onChange("lowercase")}
          sx={{
            height: "36px",
            padding: "0 10px",
            backgroundColor: value === "lowercase" ? "white" : "#F1F1F1",
            border: "2px solid #F1F1F1",
            color: value === "lowercase" ? "black" : "inherit",
            "&:hover": {
              backgroundColor: value === "lowercase" ? "white" : "#E8E8E8",
            },
          }}
        >
          {/* <TextOverline width="24px" height="24px" /> */}
          <p className="text-transform-buttons">aa</p>
        </Button>
        <Button
          onClick={() => onChange("capitalize")}
          variant={value === "capitalize" ? "contained" : "outlined"}
          sx={{
            height: "36px",
            padding: "0 10px",
            backgroundColor: value === "capitalize" ? "white" : "#F1F1F1",
            border: "2px solid #F1F1F1",
            color: value === "capitalize" ? "black" : "inherit",
            "&:hover": {
              backgroundColor: value === "capitalize" ? "white" : "#E8E8E8",
            },
          }}
        >
          {/* <TextLineThrough width="24px" height="24px" /> */}
          <p className="text-transform-buttons">Aa</p>
        </Button>
      </ButtonGroup>
    </Box>
  );
};
