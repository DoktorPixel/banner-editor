import React, { useState } from "react";
import { Popover } from "@mui/material";

interface HoverZoomImageProps {
  src: string;
  alt?: string;
  previewSize?: number;
}

export const HoverZoomImage: React.FC<HoverZoomImageProps> = ({
  src,
  alt = "",
  previewSize = 250,
}) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleMouseEnter = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMouseLeave = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <>
      <img
        src={src}
        alt={alt}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          width: 64,
          height: 64,
          objectFit: "contain",
          borderRadius: 8,
          cursor: "zoom-in",
        }}
      />
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleMouseLeave}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        PaperProps={{
          onMouseLeave: handleMouseLeave,
          style: {
            background: "transparent",
            boxShadow: "none",
          },
        }}
        disableAutoFocus
        disableEnforceFocus
        disableRestoreFocus
      >
        <img
          src={src}
          alt={alt}
          style={{
            width: previewSize,
            height: previewSize,
            objectFit: "contain",
            borderRadius: 8,
            border: "2px solid #ddd",
          }}
        />
      </Popover>
    </>
  );
};
