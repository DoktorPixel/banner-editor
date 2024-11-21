export interface BannerObject1 {
  id: number;
  type: "text" | "image";
  x: number;
  y: number;
  content?: string; // Для текста
  fontSize?: number;
  color?: string;
  src?: string; // Для изображения
  width?: number;
  height?: number;
}

export interface BannerObject {
  id: number;
  type: "text" | "image";
  x: number;
  y: number;
  content?: string;
  fontSize?: number;
  color?: string;
  src?: string;
}
