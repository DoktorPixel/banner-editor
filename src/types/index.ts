export interface BannerObject {
  id: number;
  type: "text" | "image" | "group" | "figure";
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
  name?: string;
  objectFit?: React.CSSProperties["objectFit"];

  maxLines?: number;
  autoWidth?: boolean;

  borderStyle?: string;
  borderColor?: string;
  borderWidth?: number | string;
  borderRadius?: React.CSSProperties["borderRadius"];
  backgroundColor?: string;
  opacity?: React.CSSProperties["opacity"];
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
  name?: string;
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

  selectedChildId: { groupId: number; childId: number } | null;
  selectChild: (groupId: number, childId: number) => void;
  clearChildSelection: () => void;
  updateChild: (
    groupId: number,
    childId: number,
    updates: Partial<BannerChild>
  ) => void;
  deleteChild: (groupId: number, childId: number) => void;
  //
  temporaryUpdates: { [key: number]: Partial<BannerObject> };
  setTemporaryUpdates: React.Dispatch<
    React.SetStateAction<{ [key: number]: Partial<BannerObject> }>
  >;
  renderedObjects: BannerObject[];
}

export type ResizeDirection =
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right"
  | "middle-top"
  | "middle-bottom"
  | "middle-left"
  | "middle-right";

export interface ResizeParams {
  resizeDirection: ResizeDirection | null;
  mouseX: number;
  mouseY: number;
  object: { x: number; y: number; width: number; height: number };
}

export interface ResizeHandlesProps {
  objectId: number;
  selectedObjectId: number | null;
  handleResizeMouseDown: (
    objectId: number,
    direction: ResizeDirection,
    event: React.MouseEvent
  ) => void;
}
