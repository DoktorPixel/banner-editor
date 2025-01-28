import {
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  S3ServiceException,
} from "@aws-sdk/client-s3";
import { s3Client } from "./s3Client";
import { ProjectData, DynamicImg } from "../types";

const BUCKET_NAME = "my-banner-editor-bucket";

// Загрузка данных в S3
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

// Загрузка данных из S3
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

// Удаление объекта из S3
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

  // Обновляем список изображений
  const updatedDynamicImgs = [
    ...(project.dynamicImgs || []),
    ...newDynamicImgs.filter(
      (newDynamicImg) =>
        !project.dynamicImgs?.some(
          (dynamicImg) =>
            dynamicImg.name === newDynamicImg.name &&
            dynamicImg.logoUrl === newDynamicImg.logoUrl
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
