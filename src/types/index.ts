export interface BannerObject {
  id: number;
  type: "text" | "image" | "group" | "figure";
  x: number;
  y: number;
  zIndex?: number | undefined;
  content?: string;
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: React.CSSProperties["fontWeight"];
  fontStyle?: React.CSSProperties["fontStyle"];
  textTransform?: React.CSSProperties["textTransform"];
  textDecoration?: React.CSSProperties["textDecoration"];
  textAlign?: React.CSSProperties["textAlign"];
  color?: string;
  src?: string;
  width?: number;
  height?: number;
  autoWidth?: boolean;
  autoHeight?: boolean;
  children?: BannerChild[];
  display?: React.CSSProperties["display"];
  condition?: {
    type: "showIf" | "hideIf";
    props: string[];
    state: "exist" | "noExist";
  };
  flexDirection?: React.CSSProperties["flexDirection"];
  justifyContent?: React.CSSProperties["justifyContent"];
  alignItems?: React.CSSProperties["alignItems"];
  gap?: React.CSSProperties["gap"];
  name?: string;
  objectFit?: React.CSSProperties["objectFit"];
  rotate?: number | undefined;
  maxLines?: number;
  borderRadius?: React.CSSProperties["borderRadius"];
  backgroundColor?: string;
  opacity?: React.CSSProperties["opacity"];
  paddingTop?: number | string;
  paddingBottom?: number | string;
  paddingLeft?: number | string;
  paddingRight?: number | string;
  abstractGroupId?: number | null;

  // hidden?: boolean; //

  // borders
  borderTopStyle?: React.CSSProperties["borderTopStyle"];
  borderTopColor?: string;
  borderTopWidth?: number | string;

  borderBottomStyle?: React.CSSProperties["borderTopStyle"];
  borderBottomColor?: string;
  borderBottomWidth?: number | string;

  borderLeftStyle?: React.CSSProperties["borderTopStyle"];
  borderLeftColor?: string;
  borderLeftWidth?: number | string;

  borderRightStyle?: React.CSSProperties["borderTopStyle"];
  borderRightColor?: string;
  borderRightWidth?: number | string;
}

export interface BannerChild {
  id: number;
  type: "text" | "image" | "group" | "figure";
  content?: string;
  fontSize?: number;
  fontFamily?: string;
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
  autoWidth?: boolean;
  autoHeight?: boolean;
  src?: string;
  name?: string;
  objectFit?: React.CSSProperties["objectFit"];
  rotate?: number | undefined;
  display?: React.CSSProperties["display"];
  condition?: {
    type: "showIf" | "hideIf";
    props: string[];
    state: "exist" | "noExist";
  };
  flexDirection?: React.CSSProperties["flexDirection"];
  justifyContent?: React.CSSProperties["justifyContent"];
  alignItems?: React.CSSProperties["alignItems"];
  gap?: React.CSSProperties["gap"];
  children?: BannerChild[]; // for groups
  maxLines?: number;
  borderRadius?: React.CSSProperties["borderRadius"];
  backgroundColor?: string;
  opacity?: React.CSSProperties["opacity"];
  paddingTop?: number | string;
  paddingBottom?: number | string;
  paddingLeft?: number | string;
  paddingRight?: number | string;

  // borders
  borderTopStyle?: React.CSSProperties["borderTopStyle"];
  borderTopColor?: string;
  borderTopWidth?: number | string;

  borderBottomStyle?: React.CSSProperties["borderTopStyle"];
  borderBottomColor?: string;
  borderBottomWidth?: number | string;

  borderLeftStyle?: React.CSSProperties["borderTopStyle"];
  borderLeftColor?: string;
  borderLeftWidth?: number | string;

  borderRightStyle?: React.CSSProperties["borderTopStyle"];
  borderRightColor?: string;
  borderRightWidth?: number | string;
  zIndex?: number | undefined;
}

export interface BannerContextProps {
  objects: BannerObject[];
  addObject: (object: BannerObject) => void;
  updateObject: (id: number, updates: Partial<BannerObject>) => void;
  updateMultipleObjects: (
    updates: Record<number, Partial<BannerObject>>
  ) => void;
  deleteObject: (id: number) => void;
  deleteMultipleObjects: (ids: number[]) => void;
  deleteObjectsByImageSrc: (src: string) => void;
  updateHistory: (newObjects: BannerObject[]) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  selectedObjectIds: number[];
  selectObject: (id: number, toggle?: boolean) => void;
  selectAllObjects: (id: number, toggle?: boolean) => void;
  clearSelection: () => void;
  clearHistory: () => void;
  clearProject: () => void;
  groupSelectedObjects: () => void;
  ungroupSelectedObject: () => void;

  selectedChildId: { groupId: number; childId: number } | null;
  selectChild: (groupId: number, childId: number, parentId?: number) => void;
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
  addJson: (jsonData: BannerObject[]) => void;
  //
  currentProjectName: string | null;
  setCurrentProjectName: (name: string) => void;
  //
  dynamicImgs?: DynamicImg[];
  setDynamicImgs?: React.Dispatch<React.SetStateAction<DynamicImg[]>>;
  addDynamicImg?: (dynamicImg: DynamicImg) => void;
  updateDynamicImg?: (oldName: string, updates: Partial<DynamicImg>) => void;
  deleteDynamicImg?: (name: string) => void;
  //
  currentProjectId: string | null;
  setCurrentProjectId: (id: string | null) => void;
  refreshCounter: number;
  triggerRefresh: () => void;
}

export interface DynamicImg {
  name?: string;
  logoUrl?: string;
}

export interface ProjectData {
  objects: BannerObject[];
  dynamicImgs?: DynamicImg[];
  config?: ConfigItem[];
}

export interface PresetData {
  id: string;
  name: string;
  previewUrl?: string;
  objects: BannerObject[];
}

export interface ConfigItem {
  key: string;
  value1?: string;
  value2?: string;
  function: string;
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
