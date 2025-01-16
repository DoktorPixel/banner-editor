import { S3Client } from "@aws-sdk/client-s3";
// import * as dotenv from "dotenv";
// dotenv.config();
// const REGION = process.env.AWS_REGION || "default-region";
// const ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID || "";
// const SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY || "";

const REGION = import.meta.env.VITE_AWS_REGION;
const ACCESS_KEY_ID = import.meta.env.VITE_AWS_ACCESS_KEY_ID;
const SECRET_ACCESS_KEY = import.meta.env.VITE_AWS_SECRET_ACCESS_KEY;

if (!ACCESS_KEY_ID || !SECRET_ACCESS_KEY) {
  throw new Error("AWS credentials are not set in the environment variables.");
}

export const s3Client = new S3Client({
  region: REGION,
  credentials: {
    accessKeyId: ACCESS_KEY_ID,
    secretAccessKey: SECRET_ACCESS_KEY,
  },
});
