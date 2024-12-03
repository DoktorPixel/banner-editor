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
  children?: BannerChild[];
  display?: React.CSSProperties["display"];
  flexDirection?: React.CSSProperties["flexDirection"];
  justifyContent?: React.CSSProperties["justifyContent"];
  alignItems?: React.CSSProperties["alignItems"];
  gap?: React.CSSProperties["gap"];
}

export interface BannerChild {
  id: number;
  type: "text" | "image";
  content?: string;
  fontSize?: number;
  fontWeight?: React.CSSProperties["fontWeight"];
  fontStyle?: React.CSSProperties["fontStyle"];
  textTransform?: React.CSSProperties["textTransform"];
  textDecoration?: React.CSSProperties["textDecoration"];
  textAlign?: React.CSSProperties["textAlign"];
  color?: string;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  src?: string;
}

export interface BannerContextProps {
  objects: BannerObject[];
  addObject: (object: BannerObject) => void;
  updateObject: (id: number, updates: Partial<BannerObject>) => void;
  deleteObject: (id: number) => void;
  deleteMultipleObjects: (ids: number[]) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  selectedObjectIds: number[];
  selectObject: (id: number, toggle?: boolean) => void;
  clearSelection: () => void;
  clearHistory: () => void;
  groupSelectedObjects: () => void;
  ungroupSelectedObject: () => void;
}

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
