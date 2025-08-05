import React from "react";
import {
  computeOpacity,
  shouldHideObject,
  replaceDynamicText,
  replaceDynamicVariables,
} from "../../../utils/hooks";

import { BannerChild, KeyValuePair } from "../../../types";

type SelectedChildId = {
  groupId: number;
  childId: number;
  parentId?: number;
} | null;

interface Props {
  child: BannerChild;
  object: { id: number };
  isVisible: boolean;
  isVisibleChild: boolean;
  hiddenObjectIds: number[];
  keyValuePairs: KeyValuePair[];
  selectedChildId: SelectedChildId;
  handleChildClick: (
    groupId: number,
    childId: number,
    e: React.MouseEvent,
    parentGroupId?: number
  ) => void;
}

export const NestedGroupObject: React.FC<Props> = ({
  child,
  object,
  isVisible,
  isVisibleChild,
  hiddenObjectIds,
  keyValuePairs,
  selectedChildId,
  handleChildClick,
}) => {
  const {
    id,
    children,
    rotate,
    width,
    height,
    autoWidth,
    autoHeight,
    display,
    backgroundColor,
    flexDirection,
    justifyContent,
    alignItems,
    gap,
    borderRadius,
    borderTopStyle,
    borderTopColor,
    borderTopWidth,
    borderBottomStyle,
    borderBottomColor,
    borderBottomWidth,
    borderLeftStyle,
    borderLeftColor,
    borderLeftWidth,
    borderRightStyle,
    borderRightColor,
    borderRightWidth,
    paddingTop,
    paddingBottom,
    paddingLeft,
    paddingRight,
    ...groupStyles
  } = child;

  const cleanStyles = Object.fromEntries(
    Object.entries(groupStyles).filter(
      ([key]) => key in ({} as React.CSSProperties)
    )
  );

  return (
    <div
      key={id}
      id={`${id}`}
      data-condition={JSON.stringify(child.condition)}
      style={{
        transform: `rotate(${rotate ?? 0}deg)`,
        visibility: isVisibleChild ? "visible" : "hidden",
        opacity: computeOpacity(
          child.opacity,
          shouldHideObject(child.condition, keyValuePairs)
        ),
      }}
      className={`banner-object-child ${
        selectedChildId?.groupId === object.id &&
        selectedChildId.childId === child.id
          ? "selected"
          : ""
      }`}
      onDoubleClick={(e) => handleChildClick(object.id, child.id, e, undefined)}
    >
      <div
        style={{
          width: autoWidth ? "auto" : width,
          height: autoHeight ? "auto" : height,
          backgroundColor:
            backgroundColor !== "none" ? backgroundColor : undefined,
          position: "relative",
          display: display || "flex",
          flexDirection: flexDirection,
          justifyContent: justifyContent,
          alignItems: alignItems,
          gap: gap || 0,
          borderRadius: borderRadius,
          borderTopStyle: borderTopStyle,
          borderTopColor: borderTopColor,
          borderTopWidth: borderTopWidth,
          borderBottomStyle: borderBottomStyle,
          borderBottomColor: borderBottomColor,
          borderBottomWidth: borderBottomWidth,
          borderLeftStyle: borderLeftStyle,
          borderLeftColor: borderLeftColor,
          borderLeftWidth: borderLeftWidth,
          borderRightStyle: borderRightStyle,
          borderRightColor: borderRightColor,
          borderRightWidth: borderRightWidth,
          paddingTop: paddingTop,
          paddingBottom: paddingBottom,
          paddingLeft: paddingLeft,
          paddingRight: paddingRight,
          ...cleanStyles,
        }}
      >
        {children
          ?.slice()
          .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
          .map((nestedChild) => {
            const isHidden = shouldHideObject(
              nestedChild.condition,
              keyValuePairs
            );
            const isVisibleNested =
              isVisible &&
              isVisibleChild &&
              !hiddenObjectIds.includes(nestedChild.id);

            if (nestedChild.type === "text") {
              return (
                <div
                  key={nestedChild.id}
                  id={`${nestedChild.id}`}
                  data-condition={JSON.stringify(nestedChild.condition)}
                  className={`text-field banner-object-child ${
                    selectedChildId?.groupId === child.id &&
                    selectedChildId.childId === nestedChild.id
                      ? "selected-grand-child"
                      : ""
                  }`}
                  style={{
                    fontSize: nestedChild.fontSize,
                    color: nestedChild.color,
                    fontFamily: nestedChild.fontFamily,
                    fontWeight: nestedChild.fontWeight,
                    fontStyle: nestedChild.fontStyle,
                    textTransform: nestedChild.textTransform,
                    lineHeight: nestedChild.lineHeight,
                    letterSpacing: nestedChild.letterSpacing,
                    textDecoration: nestedChild.textDecoration,
                    textAlign: nestedChild.textAlign,
                    opacity: computeOpacity(nestedChild.opacity, isHidden),
                    visibility: isVisibleNested ? "visible" : "hidden",
                    border:
                      selectedChildId?.groupId === child.id &&
                      selectedChildId.childId === nestedChild.id
                        ? "1px solid blue"
                        : "none",
                    transform: `rotate(${nestedChild.rotate || 0}deg)`,
                  }}
                  onDoubleClick={(e) =>
                    handleChildClick(child.id, nestedChild.id, e, object.id)
                  }
                >
                  {replaceDynamicText(nestedChild.content ?? "", keyValuePairs)}
                </div>
              );
            } else if (nestedChild.type === "image") {
              return (
                <img
                  id={`${nestedChild.id}`}
                  data-condition={JSON.stringify(nestedChild.condition)}
                  key={nestedChild.id}
                  src={replaceDynamicVariables(
                    nestedChild.src ?? "",
                    keyValuePairs
                  )}
                  alt={nestedChild.name || "image"}
                  style={{
                    width: nestedChild.width,
                    height: nestedChild.height,
                    objectFit: nestedChild.objectFit,
                    transform: `rotate(${nestedChild.rotate || 0}deg)`,
                    opacity: computeOpacity(nestedChild.opacity, isHidden),
                    visibility: isVisibleNested ? "visible" : "hidden",
                  }}
                  onDoubleClick={(e) =>
                    handleChildClick(child.id, nestedChild.id, e, object.id)
                  }
                  className={`banner-object-child image-field ${
                    selectedChildId?.groupId === child.id &&
                    selectedChildId.childId === nestedChild.id
                      ? "selected-grand-child"
                      : ""
                  }`}
                />
              );
            } else if (nestedChild.type === "figure") {
              const {
                id,
                width,
                height,
                rotate,
                backgroundColor,
                borderRadius,
                borderTopStyle,
                borderTopColor,
                borderTopWidth,
                borderBottomStyle,
                borderBottomColor,
                borderBottomWidth,
                borderLeftStyle,
                borderLeftColor,
                borderLeftWidth,
                borderRightStyle,
                borderRightColor,
                borderRightWidth,
                ...figureStyles
              } = nestedChild;
              const cleanStyles = Object.fromEntries(
                Object.entries(figureStyles).filter(
                  ([key]) => key in ({} as React.CSSProperties)
                )
              );
              return (
                <div
                  key={id}
                  id={`${nestedChild.id}`}
                  data-condition={JSON.stringify(nestedChild.condition)}
                  style={{
                    transform: `rotate(${rotate ?? 0}deg)`,
                    visibility: isVisibleNested ? "visible" : "hidden",
                    opacity: computeOpacity(nestedChild.opacity, isHidden),
                  }}
                  onDoubleClick={(e) =>
                    handleChildClick(child.id, nestedChild.id, e, object.id)
                  }
                  className={`banner-object-child ${
                    selectedChildId?.groupId === child.id &&
                    selectedChildId.childId === nestedChild.id
                      ? "selected-grand-child"
                      : ""
                  }`}
                >
                  <div
                    style={{
                      position: "relative",
                      width: width ?? "100px",
                      height: height ?? "100px",
                      borderRadius: borderRadius,
                      borderTopStyle: borderTopStyle,
                      borderTopColor: borderTopColor,
                      borderTopWidth: borderTopWidth,
                      borderBottomStyle: borderBottomStyle,
                      borderBottomColor: borderBottomColor,
                      borderBottomWidth: borderBottomWidth,
                      borderLeftStyle: borderLeftStyle,
                      borderLeftColor: borderLeftColor,
                      borderLeftWidth: borderLeftWidth,
                      borderRightStyle: borderRightStyle,
                      borderRightColor: borderRightColor,
                      borderRightWidth: borderRightWidth,
                      backgroundColor:
                        backgroundColor !== "none"
                          ? backgroundColor
                          : undefined,
                      ...cleanStyles,
                    }}
                  ></div>
                </div>
              );
            } else if (nestedChild.type === "group") {
              // Рекурсивно вложенная группа
              return (
                <NestedGroupObject
                  key={nestedChild.id}
                  child={nestedChild}
                  object={child}
                  isVisible={isVisible}
                  isVisibleChild={isVisibleNested}
                  hiddenObjectIds={hiddenObjectIds}
                  keyValuePairs={keyValuePairs}
                  selectedChildId={selectedChildId}
                  handleChildClick={handleChildClick}
                />
              );
            }
            return null;
          })}
      </div>
    </div>
  );
};
