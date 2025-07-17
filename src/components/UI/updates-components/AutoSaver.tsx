import { useEffect, useState, useRef, useMemo, useCallback } from "react";
import { useBanner } from "../../../context/BannerContext";
import { useConfig } from "../../../context/ConfigContext";
import { ProjectData } from "../../../types";
import { debounce } from "lodash";
import isEqual from "fast-deep-equal";
import { captureAndUploadPreview } from "../export-components/PreviewUploader";
import { useSupabaseProject } from "../../../utils/useSupabaseProject";
import { useTranslation } from "react-i18next";

const AutoSaver: React.FC = () => {
  const { objects, dynamicImgs, currentProjectName, currentProjectId } =
    useBanner();
  const { config } = useConfig();
  const [saved, setSaved] = useState(false);
  const { t } = useTranslation();
  const lastDataRef = useRef<ProjectData>({
    objects: [],
    dynamicImgs: [],
    config: {
      keyValuePairs: [],
      hiddenObjectIds: [],
      canvasSize: { width: 1080, height: 1080 },
    },
  });

  const { updateProject } = useSupabaseProject();

  useEffect(() => {
    lastDataRef.current = {
      objects: structuredClone(objects),
      dynamicImgs: structuredClone(dynamicImgs ?? []),
      config: structuredClone(config ?? []),
    };
  }, [currentProjectName]);

  const saveData = useCallback(async () => {
    if (!currentProjectId) return;

    const projectData: ProjectData = {
      objects,
      dynamicImgs,
      config,
    };

    try {
      await updateProject.mutateAsync({
        templateId: currentProjectId,
        data: projectData,
        config,
        objects,
        dynamicImgs: dynamicImgs ?? [],
      });

      console.log("Auto-saved project:", projectData);

      lastDataRef.current = {
        objects: structuredClone(objects),
        dynamicImgs: structuredClone(dynamicImgs ?? []),
        config: structuredClone(config ?? []),
      };

      setSaved(true);
      setTimeout(() => setSaved(false), 1000);

      if (currentProjectId) {
        await captureAndUploadPreview(currentProjectId);
      }
    } catch (error) {
      console.error("Auto-save error:", error);
    }
  }, [objects, dynamicImgs, config, currentProjectId, updateProject]);

  const debouncedSave = useMemo(
    () => debounce(saveData, 1000, { leading: false, trailing: true }),
    [saveData]
  );

  useEffect(() => {
    const objectsChanged = !isEqual(objects, lastDataRef.current.objects);
    const imgsChanged = !isEqual(
      dynamicImgs ?? [],
      lastDataRef.current.dynamicImgs ?? []
    );
    const configChanged = !isEqual(
      config ?? [],
      lastDataRef.current.config ?? []
    );

    const hasChanges = objectsChanged || imgsChanged || configChanged;

    if (hasChanges) {
      debouncedSave();
    }

    return () => {
      debouncedSave.cancel();
    };
  }, [objects, dynamicImgs, config, debouncedSave]);

  return saved ? (
    <div
      style={{
        position: "absolute",
        left: "120px",
        background: "#F1F1F1",
        borderRadius: "6px",
        padding: "2px 6px",
        boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
        fontSize: "14px",
        fontWeight: 500,
      }}
    >
      {t("saved")}
    </div>
  ) : null;
};

export default AutoSaver;
