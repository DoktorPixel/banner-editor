import {
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { s3Client } from "./s3Client";
import { BannerObject } from "../types";

const BUCKET_NAME = "my-banner-editor-bucket";

// Загрузка данных в S3
export const uploadToS3 = async (key: string, data: object) => {
  try {
    const params = {
      Bucket: BUCKET_NAME,
      Key: key,
      Body: JSON.stringify(data),
      ContentType: "application/json",
    };

    await s3Client.send(new PutObjectCommand(params));
  } catch (error) {
    console.error("Помилка завантаження даних у S3:", error);
  }
};

// Загрузка данных из S3
export const downloadFromS3 = async (
  key: string
): Promise<BannerObject | null> => {
  try {
    const params = {
      Bucket: BUCKET_NAME,
      Key: key,
    };

    const command = new GetObjectCommand(params);
    const response = await s3Client.send(command);
    const body = await response.Body?.transformToString();
    return body ? JSON.parse(body) : null;
  } catch (error) {
    console.error("Помилка завантаження даних у S3:", error);
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
    console.error("Помилка завантаження даних у S3:", error);
  }
};
