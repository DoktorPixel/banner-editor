import { Button } from "@mui/material";
import { ConfigItem, BannerObject, DynamicImg } from "../../../types";
import { useSupabaseProject } from "../../../utils/useSupabaseProject";

type Props = {
  templateId: string;
  config?: ConfigItem;
  objects?: BannerObject[];
  dynamicImgs?: DynamicImg[];
  onSuccess?: (data?: unknown) => void;
};

export const DeployTemplateButton: React.FC<Props> = ({
  templateId,
  onSuccess,
}) => {
  const { deployTemplate, loading } = useSupabaseProject();

  const handleClick = async () => {
    try {
      await deployTemplate(templateId);
      onSuccess?.();
      console.log("✅ Template deployed");
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Button onClick={handleClick} disabled={loading}>
      {loading ? "Deploying..." : "Publish Template"}
    </Button>
  );
};
