import { useEffect, useState, useRef, useMemo, useCallback } from "react";
import { useBanner } from "../../../context/BannerContext";
import { useConfig } from "../../../context/ConfigContext";
import { uploadToS3 } from "../../../S3/s3Storage";
import { ProjectData } from "../../../types";
import { debounce } from "lodash";
import isEqual from "fast-deep-equal";
import { useSyncProjectWithSupabase } from "../../../utils/useSyncProjectWithSupabase";
import { captureAndUploadPreview } from "../export-components/PreviewUploader";

const AutoSaver: React.FC = () => {
  const { objects, dynamicImgs, currentProjectName } = useBanner();
  const { config } = useConfig();
  const { sync } = useSyncProjectWithSupabase();
  const [saved, setSaved] = useState(false);

  const lastDataRef = useRef<ProjectData>({
    objects: [],
    dynamicImgs: [],
    config: {
      keyValuePairs: [],
      hiddenObjectIds: [],
      canvasSize: { width: 1080, height: 1080 },
    },
  });

  useEffect(() => {
    lastDataRef.current = {
      objects: structuredClone(objects),
      dynamicImgs: structuredClone(dynamicImgs ?? []),
      config: structuredClone(config ?? []),
    };
  }, [currentProjectName]);

  const saveData = useCallback(async () => {
    if (!currentProjectName) return;

    const key = `projects/${currentProjectName}.json`;
    const projectData: ProjectData = {
      objects,
      dynamicImgs,
      config,
    };

    try {
      await captureAndUploadPreview(currentProjectName);
      await sync(currentProjectName, projectData);
      await uploadToS3(key, projectData);
      // console.log("✅ Auto-saved objects:", projectData.objects);
      lastDataRef.current = {
        objects: structuredClone(objects),
        dynamicImgs: structuredClone(dynamicImgs ?? []),
        config: structuredClone(config ?? []),
      };
      setSaved(true);
      setTimeout(() => setSaved(false), 1000);
    } catch (error) {
      console.error("Auto-save error:", error);
    }
  }, [objects, dynamicImgs, config, currentProjectName]);

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
      Saved
    </div>
  ) : null;
};

export default AutoSaver;
