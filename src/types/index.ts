export interface BannerObject {
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
