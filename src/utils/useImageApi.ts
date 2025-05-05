// import axios from "axios";
// // import { useBanner } from "../context/BannerContext";

// const API_BASE_URL = "https://api.feededify.app/client";

// export const useImageApi = () => {
//   // const { currentProjectName } = useBanner();

//   // Создание проекта
//   // const createProject = async () => {
//   //   const response = await axios.post(`${API_BASE_URL}/Project/create`, {
//   //     name: currentProjectName,
//   //   });

//   //   return response.data.id; // это и есть projectId
//   // };

//   // Загрузка изображения
//   const uploadImage = async (file: File, projectId: string) => {
//     const formData = new FormData();
//     formData.append("file", file);

//     const response = await axios.post(
//       `${API_BASE_URL}/Image?projectId=${projectId}`,
//       formData,
//       {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       }
//     );

//     return response.data;
//   };

//   // Получение изображений проекта
//   const getProjectImages = async (projectId: string) => {
//     const response = await axios.get(
//       `${API_BASE_URL}/Image?projectId=${projectId}`
//     );
//     return response.data;
//   };

//   return {
//     // createProject,
//     uploadImage,
//     getProjectImages,
//   };
// };
