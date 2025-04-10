import { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemButton,
  CircularProgress,
} from "@mui/material";
import { fetchPresetsList, downloadPresetFromS3 } from "../../../S3/s3Storage";
import { useBanner } from "../../../context/BannerContext";
import { BannerObject, BannerChild } from "../../../types";

const ApplyPresetButton: React.FC = () => {
  const { objects, updateHistory } = useBanner();
  const [open, setOpen] = useState(false);
  const [presets, setPresets] = useState<
    { id: string; name: string; previewUrl: string }[]
  >([]);
  const [loading, setLoading] = useState(false);

  const fetchPresets = async () => {
    setLoading(true);
    const presetsList = await fetchPresetsList();
    setPresets(presetsList);
    setLoading(false);
  };

  useEffect(() => {
    if (open) fetchPresets();
  }, [open]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleApplyPreset = async (presetId: string) => {
    const preset = await downloadPresetFromS3(presetId);
    if (!preset) return;

    const updateObjectIds = <T extends BannerObject | BannerChild>(
      obj: T
    ): T => ({
      ...obj,
      id: Date.now() + Math.random(),
      // ...("abstractGroupId" in obj
      //   ? { abstractGroupId: Date.now() + Math.random() }
      //   : {}),
      children: obj.children ? obj.children.map(updateObjectIds) : undefined,
    });

    const updatedObjects = preset.objects.map(updateObjectIds<BannerObject>);

    updateHistory([...objects, ...updatedObjects]);

    handleClose();
  };

  return (
    <>
      <Button variant="contained" color="primary" onClick={handleOpen}>
        Add preset
      </Button>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Select a preset</DialogTitle>
        <DialogContent>
          {loading ? (
            <CircularProgress />
          ) : (
            <List>
              {presets.length > 0 ? (
                presets.map((preset) => (
                  <ListItem key={preset.id}>
                    <ListItemButton
                      onClick={() => handleApplyPreset(preset.id)}
                    >
                      {preset.previewUrl && preset.previewUrl.trim() !== "" && (
                        <img
                          src={preset.previewUrl}
                          alt="logo"
                          width="200rem"
                          height="auto"
                        />
                      )}
                      {preset.name}
                    </ListItemButton>
                  </ListItem>
                ))
              ) : (
                <p>No presets available</p>
              )}
            </List>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ApplyPresetButton;
