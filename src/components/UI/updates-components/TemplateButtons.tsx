// // src/components/TemplateButtons.tsx
// import React, { useState } from "react";
// import { Button } from "@mui/material";
// import { useSupabaseTemplate } from "../../../utils/useSupabaseTemplate";
// import {
//   ProjectData,
//   ConfigItem,
//   BannerObject,
//   DynamicImg,
// } from "../../../types";

// type Props = {
//   templateId: string;
//   data?: ProjectData;
//   config?: ConfigItem;
//   objects?: BannerObject[];
//   dynamicImgs?: DynamicImg[];
//   onSuccess?: (data?: any) => void;
// };

// // Кнопка: получить шаблон
// export const GetTemplateButton: React.FC<Props> = ({
//   templateId,
//   onSuccess,
// }) => {
//   const { getTemplate, loading } = useSupabaseTemplate();
//   const [result, setResult] = useState<any>(null);

//   const handleClick = async () => {
//     try {
//       const data = await getTemplate(templateId);
//       setResult(data);
//       onSuccess?.(data);
//       console.log("✅ Template loaded:", data);
//     } catch (e) {
//       console.error(e);
//     }
//   };

//   return (
//     <Button
//       // variant="contained"
//       // color="primary"
//       onClick={handleClick}
//       disabled={loading}
//     >
//       {loading ? "Loading..." : "Get Template"}
//     </Button>
//   );
// };

// // Кнопка: обновить шаблон (dev)
// export const UpdateTemplateButton: React.FC<Props> = ({
//   templateId,
//   data,
//   config,
//   objects,
//   dynamicImgs,
//   onSuccess,
// }) => {
//   const { updateTemplate, loading } = useSupabaseTemplate();

//   const handleClick = async () => {
//     if (!data || !config || !objects) {
//       console.warn("❗ Missing required props: data, config, or objects");
//       return;
//     }
//     try {
//       await updateTemplate(
//         templateId,
//         data,
//         config,
//         objects,
//         dynamicImgs || []
//       );
//       onSuccess?.();
//       console.log("✅ Template updated");
//     } catch (e) {
//       console.error(e);
//     }
//   };

//   return (
//     <Button
//       // variant="contained"
//       // color="warning"
//       onClick={handleClick}
//       disabled={loading}
//     >
//       {loading ? "Updating..." : "Update Template (Dev)"}
//     </Button>
//   );
// };

// // Кнопка: опубликовать (deploy)
// export const DeployTemplateButton: React.FC<Props> = ({
//   templateId,
//   onSuccess,
// }) => {
//   const { deployTemplate, loading } = useSupabaseTemplate();

//   const handleClick = async () => {
//     try {
//       await deployTemplate(templateId);
//       onSuccess?.();
//       console.log("✅ Template deployed");
//     } catch (e) {
//       console.error(e);
//     }
//   };

//   return (
//     <Button
//       // variant="contained"
//       // color="success"
//       onClick={handleClick}
//       disabled={loading}
//     >
//       {loading ? "Deploying..." : "Publish Template"}
//     </Button>
//   );
// };
