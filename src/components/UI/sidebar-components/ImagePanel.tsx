import { useState } from "react";
import { Box, Button } from "@mui/material";
import { useBanner } from "../../../context/BannerContext";
import ImageDialog from "../dialogs/ImageDialog";
import ManageDynamicImgsModal from "../dialogs/ManageDynamicImgsModal";
import SavePresetButton from "../s3-components/SavePresetButton";
import ApplyPresetButton from "../s3-components/ApplyPresetButton";
import ImageUploader from "./ImageUploader";
import ImageGallery from "./ImageGallery";

const ImagePanel: React.FC = () => {
  const { addObject, currentProjectName } = useBanner();
  const [dialogState, setDialogState] = useState({
    isImageDialogOpen: false,
  });
  const [imageSrc, setImageSrc] = useState("");
  const [isDynamicImgsModalOpen, setIsDynamicImgsModalOpen] = useState(false);
  // const openDialog = (type: keyof typeof dialogState) =>
  //   setDialogState((prev) => ({ ...prev, [type]: true }));

  const closeDialog = (type: keyof typeof dialogState) =>
    setDialogState((prev) => ({ ...prev, [type]: false }));
  const handleAddImage = (src: string) => {
    addObject({
      id: Date.now(),
      type: "image",
      width: 250,
      height: 250,
      x: 50,
      y: 50,
      src,
      name: "",
    });
    setImageSrc("");
    closeDialog("isImageDialogOpen");
  };

  const handleAddDynamicsImage = (url: string) => {
    addObject({
      id: Date.now(),
      type: "image",
      width: 250,
      height: 250,
      x: 50,
      y: 50,
      src: url,
      name: "",
      dynamics: true,
    });
  };

  const handleAddFigure = () => {
    addObject({
      id: Date.now(),
      type: "figure",
      x: 50,
      y: 50,
      width: 200,
      height: 200,
      backgroundColor: "#f0f0f0",
      name: "",
    });
  };
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      {/* <Button
        variant="contained"
        color="primary"
        onClick={() => openDialog("isImageDialogOpen")}
      >
        Add Image
      </Button> */}
      <ImageUploader />

      <Button
        variant="contained"
        color="primary"
        onClick={() => handleAddDynamicsImage("{{img}}")}
      >
        Add Dynamic Image
      </Button>

      <Button
        variant="contained"
        color="primary"
        onClick={() => handleAddFigure()}
      >
        Add Figure
      </Button>

      <SavePresetButton />
      <ApplyPresetButton />
      <Button
        variant="contained"
        color="primary"
        onClick={() => setIsDynamicImgsModalOpen(true)}
      >
        Add Dynamic Image (Modal)
      </Button>
      <ImageDialog
        open={dialogState.isImageDialogOpen}
        imageSrc={imageSrc}
        onChange={(e) => setImageSrc(e.target.value)}
        onClose={() => closeDialog("isImageDialogOpen")}
        onAdd={(src) => handleAddImage(src)}
      />

      <ManageDynamicImgsModal
        open={isDynamicImgsModalOpen}
        onClose={() => setIsDynamicImgsModalOpen(false)}
        projectId={currentProjectName}
      />

      <div className="grey-line"></div>

      <ImageGallery />
    </Box>
  );
};

export default ImagePanel;
