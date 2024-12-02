// export interface BannerObject {
//   id: number;
//   type: "text" | "image";
//   x: number;
//   y: number;
//   zIndex?: number | undefined;
//   content?: string;
//   fontSize?: number;
//   fontWeight?: React.CSSProperties["fontWeight"];
//   fontStyle?: React.CSSProperties["fontStyle"];
//   textTransform?: React.CSSProperties["textTransform"];
//   textDecoration?: React.CSSProperties["textDecoration"];
//   textAlign?: React.CSSProperties["textAlign"];
//   color?: string;
//   src?: string;
//   width?: number;
//   height?: number;
// }

// export type BannerObject =
//   | {
//       id: number;
//       type: "text";
//       x: number;
//       y: number;
//       zIndex?: number | undefined;
//       width?: number;
//       height?: number;
//       content: string;
//       fontSize: number;
//       color: string;
//       fontWeight?: React.CSSProperties["fontWeight"];
//       fontStyle?: React.CSSProperties["fontStyle"];
//       textTransform?: React.CSSProperties["textTransform"];
//       textDecoration?: React.CSSProperties["textDecoration"];
//       textAlign?: React.CSSProperties["textAlign"];
//     }
//   | {
//       id: number;
//       type: "image";
//       x: number;
//       y: number;
//       width?: number;
//       height?: number;
//       zIndex?: number | undefined;
//       src: string;
//     }
//   | {
//       id: number;
//       type: "group";
//       x: number;
//       y: number;
//       width: number;
//       height: number;
//       zIndex?: number | undefined;
//       children: number[];
//     };

//

export interface BannerObject {
  id: number;
  type: "text" | "image" | "group";
  x: number;
  y: number;
  zIndex?: number | undefined;
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
  children?: number[];
}
