export interface BannerObject {
  id: number;
  type: "text" | "image" | "group" | "figure";
  x: number;
  y: number;
  zIndex?: number | undefined;
  content?: string | number;
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: React.CSSProperties["fontWeight"];
  fontStyle?: React.CSSProperties["fontStyle"];
  textTransform?: React.CSSProperties["textTransform"];
  lineHeight?: React.CSSProperties["lineHeight"];
  letterSpacing?: React.CSSProperties["letterSpacing"];
  textDecoration?: React.CSSProperties["textDecoration"];
  textAlign?: React.CSSProperties["textAlign"];
  color?: string;
  src?: string;
  dynamics?: boolean;
  dynamicsLogo?: boolean; // for dynamic logos
  logoName?: string; // for dynamic logos
  object_id?: string; // for dynamic images
  width?: number;
  height?: number;
  autoWidth?: boolean;
  autoHeight?: boolean;
  children?: BannerChild[];
  display?: React.CSSProperties["display"];
  condition?: {
    type: "showIf" | "hideIf";
    props: string[];
    state:
      | "exist"
      | "noExist"
      | "eq"
      | "not-eq"
      | "more-than"
      | "less-than"
      | "more-or-eq"
      | "less-or-eq";
    compareValue?: string;
  };
  conditionForAbstract?: {
    type: "showIf" | "hideIf";
    props: string[];
    state:
      | "exist"
      | "noExist"
      | "eq"
      | "not-eq"
      | "more-than"
      | "less-than"
      | "more-or-eq"
      | "less-or-eq";
    compareValue?: string;
  };
  abstractGroupId?: number | null;
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

export type ObjectCondition = BannerObject["condition"];

export interface BannerChild {
  id: number;
  type: "text" | "image" | "group" | "figure";
  content?: string | number;
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: React.CSSProperties["fontWeight"];
  fontStyle?: React.CSSProperties["fontStyle"];
  textTransform?: React.CSSProperties["textTransform"];
  lineHeight?: React.CSSProperties["lineHeight"];
  letterSpacing?: React.CSSProperties["letterSpacing"];
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
  dynamics?: boolean;
  dynamicsLogo?: boolean; // for dynamic logos
  logoName?: string; // for dynamic logos
  object_id?: string; // for dynamic images
  name?: string;
  objectFit?: React.CSSProperties["objectFit"];
  rotate?: number | undefined;
  display?: React.CSSProperties["display"];
  condition?: {
    type: "showIf" | "hideIf";
    props: string[];
    state:
      | "exist"
      | "noExist"
      | "eq"
      | "not-eq"
      | "more-than"
      | "less-than"
      | "more-or-eq"
      | "less-or-eq";
    compareValue?: string;
  };
  abstractGroupId?: number | null;
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
  order?: number; //
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

  selectedChildId: {
    groupId: number;
    childId: number;
    parentId?: number;
  } | null;
  selectChild: (groupId: number, childId: number, parentId?: number) => void;
  clearChildSelection: () => void;
  updateChild: (
    groupId: number,
    childId: number,
    updates: Partial<BannerChild>
  ) => void;
  deleteChild: (groupId: number, childId: number) => void;
  updateNestedChild: (
    parentId: number,
    groupId: number,
    childId: number,
    updates: Partial<BannerChild>
  ) => void;
  deleteNestedChild: (
    parentId: number,
    groupId: number,
    childId: number
  ) => void;
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
  updateDynamicImg?: (updatedImg: DynamicImg) => void;
  deleteDynamicImg?: (name: string) => void;
  updateDynamicImgName?: (id: string, name: string) => void;
  //
  currentProjectId: string | null;
  setCurrentProjectId: (id: string | null) => void;
  refreshCounter: number;
  triggerRefresh: () => void;
  reorderChildren: (groupId: number, newOrder: number[]) => void;
  scale: number;
  setScale: (value: number) => void;
  //
  findParentGroupOfChild: (childId: number) => BannerObject | null;
  // promoteChildToRoot: (
  //   child: BannerChild,
  //   parentGroup?: BannerObject
  // ) => BannerObject;
  // demoteRootToChild: (
  //   root: BannerObject,
  //   parentGroup: BannerObject
  // ) => BannerChild;
  moveObjectsToFlexGroup: (
    ids: number[],
    parentGroupId: number,
    atIndex?: number
  ) => void;
  removeObjectsFromFlexGroup: (
    ids: number[],
    parentGroupId?: number,
    atIndex?: number
  ) => void;
}

export interface DynamicImg {
  // logoUrl?: string;
  name?: string;
  id: string; // for Supabase
  object_id?: string; // for Supabase
  file_url?: string; // for Supabase
  template_id?: string; // for Supabase
  user_id?: string; // for Supabase
  created_at?: string; // for Supabase
}

export interface ProjectData {
  objects: BannerObject[];
  dynamicImgs?: DynamicImg[];
  config: ConfigItem;
  dimensions?: { width: number; height: number };
}

export interface PresetData {
  id: string;
  name: string;
  previewUrl?: string;
  objects: BannerObject[];
}

export interface ConfigItem {
  hiddenObjectIds: number[];
  keyValuePairs: KeyValuePair[];
  canvasSize: { width: number; height: number };
  customFonts?: CustomFont[];
}

export interface CustomFont {
  id: string;
  created_at: string;
  file_url: string;
  font_family: string;
  font_format: string;
  font_name: string;
}

export interface KeyValuePair {
  key: string;
  value: string;
  fromProduct?: boolean;
  custom?: boolean;
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
  object: {
    x: number;
    y: number;
    width: number;
    height: number;
    rotate?: number;
  };
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

export interface SupabaseImageItem {
  id: string;
  file_url: string;
  object_id?: string;
  template_id?: string;
  user_id?: string;
  created_at?: string;
  name?: string;
}

// export type Product = {
//   id: string;
//   title?: string;
//   description?: string;
//   html_description?: string;
//   link?: string | null;
//   image_link?: string | null;
//   additional_image_links?: string[];
//   availability?: string;
//   stock_quantity?: number;
//   price?: { value: number; currency: string } | null;
//   sale_price?: { value: number; currency: string } | null;
//   sale_price_effective_date?: string | null;
//   google_product_category?: number | null;
//   item_group_id?: string | null;
//   product_type?: string | null;
//   brand?: string | null;
//   condition?: string | null;
//   attributes?: Record<string, any>;
//   variants?: any[];
//   rating?: { avg?: number; count?: number } | null;
//   tags?: string[];
//   shipping?: Record<string, any>;
//   created_at?: string;
//   [k: string]: any;
// };

export type Product = Record<string, string | string[]>;

export type ExtendedPair = KeyValuePair & {
  editable: boolean;
  custom?: boolean;
};

export interface KeyValueTableProps {
  combinedPairs: ExtendedPair[]; // уже объединённый список: кастомные сверху, далее product-ordered
  onEditKey: (oldKey: string, newKey: string) => void;
  onEditValue: (key: string, value: string) => void;
  onRemoveByKey: (key: string) => void;
  onAddCustom: () => void;
  onAddText: (text: string) => void;
  onCommitProductValue: (key: string, value: string) => void;
}
