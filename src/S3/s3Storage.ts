import {
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  S3ServiceException,
} from "@aws-sdk/client-s3";
import { s3Client } from "./s3Client";
import { ProjectData } from "../types";

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
    console.log(`Данные успешно загружены в S3: ${key}`);
  } catch (error) {
    console.error("Ошибка загрузки данных в S3:", error);
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
    return body ? JSON.parse(body) : null;
  } catch (error: unknown) {
    if (error instanceof S3ServiceException && error.name === "NoSuchKey") {
      console.warn(`Файл не найден в S3: ${key}`);
      return null;
    }

    console.error("Ошибка загрузки данных из S3:", error);
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
    console.log(`Файл успешно удалён из S3: ${key}`);
  } catch (error) {
    console.error("Ошибка удаления данных из S3:", error);
  }
};

// Добавление или обновление массива объектов `brands` в проекте
export const updateBrandsInProject = async (
  projectId: string,
  brands: Record<string, string>
) => {
  const key = `projects/${projectId}.json`;
  const project = await downloadFromS3(key);

  if (!project) {
    throw new Error("Проект не найден.");
  }

  const updatedProject: ProjectData = {
    ...project,
    brands: {
      ...project.brands,
      ...brands, // Обновление или добавление новых брендов
    },
  };

  await uploadToS3(key, updatedProject);
  console.log("Бренды успешно обновлены в проекте.");
};

// Пример использования
// const exampleUsage = async () => {
//   const projectId = "banner1";
//   const newBrands = {
//     Nike: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
//     Adidas: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
//   };

//   try {
//     await updateBrandsInProject(projectId, newBrands);
//     console.log("Бренды добавлены в проект.");
//   } catch (error) {
//     console.error("Ошибка обновления брендов в проекте:", error);
//   }
// };
