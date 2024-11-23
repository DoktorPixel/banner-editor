export interface BannerObject {
  id: number;
  type: "text" | "image";
  x: number;
  y: number;
  content?: string;
  fontSize?: number;
  fontWeight?: React.CSSProperties["fontWeight"];
  fontStyle?: React.CSSProperties["fontStyle"];
  textTransform?: React.CSSProperties["textTransform"];
  textDecoration?: React.CSSProperties["textDecoration"];
  textAlign?: React.CSSProperties["textAlign"];
  color?: string;
  src?: string;
  width?: number;
  height?: number;
}
