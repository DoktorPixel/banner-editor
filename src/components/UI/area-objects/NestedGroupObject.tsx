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
            const isVisibleCildNested =
              isVisible &&
              isVisibleChild &&
              !hiddenObjectIds.includes(nestedChild.id);
            const {
              id: nestedId,
              condition,
              content,
              rotate,
              src,
              ...nestedStyles
            } = nestedChild;

            if (nestedChild.type === "text") {
              return (
                <div
                  id={`${nestedId}`}
                  data-condition={JSON.stringify(condition)}
                  key={nestedId}
                  style={{
                    ...nestedStyles,
                    transform: `rotate(${rotate ?? 0}deg)`,
                    position: "relative",
                    width: "auto",
                    height: "auto",
                    visibility: isVisibleCildNested ? "visible" : "hidden",
                  }}
                  className={`image-field banner-object-child ${
                    selectedChildId?.groupId === child.id &&
                    selectedChildId.childId === nestedChild.id
                      ? "selected-grand-child"
                      : ""
                  }`}
                  onDoubleClick={(e) =>
                    handleChildClick(child.id, nestedChild.id, e, object.id)
                  }
                >
                  {replaceDynamicText(content ?? "", keyValuePairs)}
                </div>
              );
            } else if (nestedChild.type === "image") {
              return (
                <img
                  key={nestedId}
                  id={`${nestedId}`}
                  data-condition={JSON.stringify(condition)}
                  src={replaceDynamicVariables(src ?? "", keyValuePairs)}
                  alt={"image"}
                  style={{
                    ...nestedStyles,
                    visibility: isVisibleCildNested ? "visible" : "hidden",
                  }}
                  className={`image-field banner-object-child ${
                    selectedChildId?.groupId === child.id &&
                    selectedChildId.childId === nestedChild.id
                      ? "selected-grand-child"
                      : ""
                  }`}
                  onDoubleClick={(e) =>
                    handleChildClick(child.id, nestedChild.id, e, object.id)
                  }
                />
              );
            }

            return (
              <p
                id={`${nestedId}`}
                data-condition={JSON.stringify(condition)}
                key={nestedId}
                style={{
                  ...nestedStyles,
                  transform: `rotate(${rotate ?? 0}deg)`,
                  position: "relative",
                  visibility: isVisibleCildNested ? "visible" : "hidden",
                }}
                className={`image-field banner-object-child ${
                  selectedChildId?.groupId === child.id &&
                  selectedChildId.childId === nestedChild.id
                    ? "selected-grand-child"
                    : ""
                }`}
                onDoubleClick={(e) =>
                  handleChildClick(child.id, nestedChild.id, e, object.id)
                }
              >
                {replaceDynamicText(content ?? "", keyValuePairs)}
              </p>
            );
          })}
      </div>
    </div>
  );
};
