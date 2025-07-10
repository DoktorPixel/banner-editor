import {
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  S3ServiceException,
  ListObjectsV2Command,
} from "@aws-sdk/client-s3";
import { s3Client } from "./s3Client";
import { ProjectData, DynamicImg, PresetData } from "../types";

const BUCKET_NAME = "my-banner-editor-bucket";

export const uploadToS3 = async (key: string, data: ProjectData) => {
  try {
    const params = {
      Bucket: BUCKET_NAME,
      Key: key,
      Body: JSON.stringify(data),
      ContentType: "application/json",
      CacheControl: "no-cache",
    };

    await s3Client.send(new PutObjectCommand(params));
  } catch (error) {
    console.error("Помилка завантаження даних S3:", error);
  }
};

export const downloadFromS3 = async (
  key: string
): Promise<ProjectData | null> => {
  try {
    const params = {
      Bucket: BUCKET_NAME,
      Key: key,
      CacheControl: "no-cache",
    };

    const command = new GetObjectCommand(params);
    const response = await s3Client.send(command);

    const body = await response.Body?.transformToString();
    return body ? (JSON.parse(body) as ProjectData) : null;
  } catch (error: unknown) {
    if (error instanceof S3ServiceException && error.name === "NoSuchKey") {
      console.warn(`Файл не знайдено в S3: ${key}`);
      return null;
    }

    console.error("Помилка завантаження даних із S3:", error);
    return null;
  }
};

export const deleteFromS3 = async (key: string) => {
  try {
    const params = {
      Bucket: BUCKET_NAME,
      Key: key,
    };

    await s3Client.send(new DeleteObjectCommand(params));
  } catch (error) {
    console.error("Ошибка удаления данных из S3:", error);
  }
};

export const updateDynamicImgsInProject = async (
  projectId: string | null,
  newDynamicImgs: DynamicImg[]
) => {
  const key = `projects/${projectId}.json`;
  const project = await downloadFromS3(key);

  if (!project) {
    throw new Error("Проект не найден.");
  }

  const updatedDynamicImgs = [
    ...(project.dynamicImgs || []),
    ...newDynamicImgs.filter(
      (newDynamicImg) =>
        !project.dynamicImgs?.some(
          (dynamicImg) =>
            dynamicImg.name === newDynamicImg.name &&
            dynamicImg.file_url === newDynamicImg.file_url
        )
    ),
  ];

  const updatedProject: ProjectData = {
    ...project,
    dynamicImgs: updatedDynamicImgs,
  };

  await uploadToS3(key, updatedProject);
  console.log("Зображення успішно оновлено у проекті.");
};

export const uploadPresetToS3 = async (preset: PresetData) => {
  try {
    const key = `presets/${preset.id}.json`;

    const params = {
      Bucket: BUCKET_NAME,
      Key: key,
      Body: JSON.stringify(preset),
      ContentType: "application/json",
      CacheControl: "no-cache",
    };

    await s3Client.send(new PutObjectCommand(params));
    console.log(`Пресет ${preset.name} завантажений в S3`);
  } catch (error) {
    console.error("Помилка завантаження пресета в S3:", error);
  }
};

export const downloadPresetFromS3 = async (
  presetId: string
): Promise<PresetData | null> => {
  try {
    const key = `presets/${presetId}.json`;

    const command = new GetObjectCommand({ Bucket: BUCKET_NAME, Key: key });
    const response = await s3Client.send(command);

    const body = await response.Body?.transformToString();
    return body ? (JSON.parse(body) as PresetData) : null;
  } catch (error: unknown) {
    if (error instanceof S3ServiceException && error.name === "NoSuchKey") {
      console.warn(`Пресет не знайдено у S3: ${presetId}`);
      return null;
    }

    console.error("Помилка завантаження пресета із S3:", error);
    return null;
  }
};

export const applyPresetToProject = async (
  projectId: string,
  presetId: string
) => {
  const projectKey = `projects/${projectId}.json`;
  const project = await downloadFromS3(projectKey);

  if (!project) {
    throw new Error("Проект не знайдено.");
  }

  const preset = await downloadPresetFromS3(presetId);

  if (!preset) {
    throw new Error("Пресет не знайдено.");
  }

  const updatedProject: ProjectData = {
    ...project,
    objects: [...project.objects, ...preset.objects],
  };

  await uploadToS3(projectKey, updatedProject);
  console.log(`Пресет ${preset.name} успішно доданий до проекту ${projectId}`);
};

export const fetchPresetsList = async (): Promise<
  { id: string; name: string; previewUrl: string }[]
> => {
  try {
    const command = new ListObjectsV2Command({
      Bucket: BUCKET_NAME,
      Prefix: "presets/",
    });

    const response = await s3Client.send(command);

    const presets = await Promise.all(
      response.Contents?.map(async (item) => {
        const id = item.Key?.replace("presets/", "").replace(".json", "") || "";

        const presetData = await downloadPresetFromS3(id);

        return {
          id,
          name: presetData?.name || "Без назви",
          previewUrl: presetData?.previewUrl || "",
        };
      }) || []
    );

    return presets;
  } catch (error) {
    console.error("Помилка отримання списку пресетів:", error);
    return [];
  }
};
