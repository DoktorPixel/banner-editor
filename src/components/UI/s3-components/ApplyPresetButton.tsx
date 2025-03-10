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

const ApplyPresetButton: React.FC = () => {
  const { objects, updateHistory } = useBanner();
  const [open, setOpen] = useState(false);
  const [presets, setPresets] = useState<{ id: string; name: string }[]>([]);
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
    if (preset) {
      updateHistory([...objects, ...preset.objects]);
    }
    handleClose();
  };

  return (
    <>
      <Button variant="contained" color="primary" onClick={handleOpen}>
        Додати пресет
      </Button>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Виберіть пресет</DialogTitle>
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
                      {preset.name}
                    </ListItemButton>
                  </ListItem>
                ))
              ) : (
                <p>Немає доступних пресетів</p>
              )}
            </List>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ApplyPresetButton;
