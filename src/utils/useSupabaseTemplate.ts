// import { useCallback, useState } from "react";
// import axios from "axios";
// import { ExportToHTML_5 } from "../components/UI/export-components/ExportToHTML_5";
// import { useBanner } from "../context/BannerContext";
// import { useConfig } from "../context/ConfigContext";
// import { getToken } from "./supabaseClient";

// // const API_KEY = "jessica2010";

// const API_GET_TEMPLATE =
//   "https://tgitxrjsbuimawihmkth.supabase.co/functions/v1/template-api";

// const API_DEPLOY_TEMPLATE =
//   "https://tgitxrjsbuimawihmkth.supabase.co/functions/v1/template-deploy";

// export const useSupabaseTemplate = () => {
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<null | string>(null);
//   const { objects, dynamicImgs } = useBanner();
//   const { config } = useConfig();

//   const getTemplate = useCallback(async (templateId: string) => {
//     setLoading(true);
//     setError(null);
//     try {
//       const token = await getToken();
//       const response = await axios.get(`${API_GET_TEMPLATE}?id=${templateId}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           // "X-API-Key": API_KEY,
//           Accept: "application/json",
//         },
//       });
//       return response.data;
//     } catch (err: unknown) {
//       console.error("❌ Failed to load template:", err);
//       setError("Failed to load template.");
//       throw err;
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   // Опубликовать (deploy)
//   const deployTemplate = useCallback(async (templateId: string) => {
//     setLoading(true);
//     setError(null);
//     try {
//       const token = await getToken();
//       const html = ExportToHTML_5(objects, config, dynamicImgs);

//       const payload = {
//         templateId: templateId,
//         html_prod: html,
//       };

//       await axios.post(API_DEPLOY_TEMPLATE, payload, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       });

//       return true;
//     } catch (err: unknown) {
//       console.error("❌ Failed to deploy template:", err);
//       setError("Failed to deploy template.");
//       throw err;
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   return {
//     getTemplate,
//     deployTemplate,
//     loading,
//     error,
//   };
// };
