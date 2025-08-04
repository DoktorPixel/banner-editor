import React from "react";
import {
  computeOpacity,
  shouldHideObject,
  replaceDynamicText,
  replaceDynamicVariables,
} from "../../../utils/hooks";

import { BannerObject, KeyValuePair } from "../../../types";

type SelectedChildId = {
  groupId: number;
  childId: number;
  parentId?: number;
} | null;

interface Props {
  object: BannerObject;
  isVisible: boolean;
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

export const GroupObjectChildren: React.FC<Props> = ({
  object,
  isVisible,
  hiddenObjectIds,
  keyValuePairs,
  selectedChildId,
  handleChildClick,
}) => {
  return (
    <>
      {object.children
        ?.slice()
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
        .map((child) => {
          const isHidden = shouldHideObject(child.condition, keyValuePairs);
          const isVisibleCild =
            isVisible && !hiddenObjectIds.includes(child.id);
          if (child.type === "text") {
            return (
              <div
                key={child.id}
                id={`${child.id}`}
                data-condition={JSON.stringify(child.condition)}
                className={`text-field banner-object-child ${
                  selectedChildId?.groupId === object.id &&
                  selectedChildId.childId === child.id
                    ? "selected"
                    : ""
                }`}
                style={{
                  fontSize: child.fontSize,
                  color: child.color,
                  fontFamily: child.fontFamily,
                  fontWeight: child.fontWeight,
                  fontStyle: child.fontStyle,
                  textDecoration: child.textDecoration,
                  textAlign: child.textAlign,
                  opacity: computeOpacity(child.opacity, isHidden),
                  visibility: isVisibleCild ? "visible" : "hidden",
                  border:
                    selectedChildId?.groupId === object.id &&
                    selectedChildId.childId === child.id
                      ? "1px solid blue"
                      : "none",
                  transform: `rotate(${child.rotate || 0}deg)`,
                }}
                onDoubleClick={(e) =>
                  handleChildClick(object.id, child.id, e, undefined)
                }
              >
                {replaceDynamicText(child.content ?? "", keyValuePairs)}
              </div>
            );
          } else if (child.type === "image") {
            return (
              <img
                id={`${child.id}`}
                data-condition={JSON.stringify(child.condition)}
                key={child.id}
                src={replaceDynamicVariables(child.src ?? "", keyValuePairs)}
                alt={child.name || "image"}
                style={{
                  width: child.width,
                  height: child.height,
                  objectFit: child.objectFit,
                  transform: `rotate(${child.rotate || 0}deg)`,
                  opacity: computeOpacity(child.opacity, isHidden),
                  visibility: isVisibleCild ? "visible" : "hidden",
                }}
                onDoubleClick={(e) =>
                  handleChildClick(object.id, child.id, e, undefined)
                }
                className={`banner-object-child image-field ${
                  selectedChildId?.groupId === object.id &&
                  selectedChildId.childId === child.id
                    ? "selected"
                    : ""
                }`}
              />
            );
          } else if (child.type === "figure") {
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
            } = child;

            const cleanStyles = Object.fromEntries(
              Object.entries(figureStyles).filter(
                ([key]) => key in ({} as React.CSSProperties)
              )
            );
            return (
              <div
                key={id}
                id={`${child.id}`}
                data-condition={JSON.stringify(child.condition)}
                style={{
                  transform: `rotate(${rotate ?? 0}deg)`,
                  visibility: isVisibleCild ? "visible" : "hidden",
                  opacity: computeOpacity(child.opacity, isHidden),
                }}
                onDoubleClick={(e) =>
                  handleChildClick(object.id, child.id, e, undefined)
                }
                className={`banner-object-child ${
                  selectedChildId?.groupId === object.id &&
                  selectedChildId.childId === child.id
                    ? "selected"
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
                      backgroundColor !== "none" ? backgroundColor : undefined,
                    ...cleanStyles,
                  }}
                ></div>
              </div>
            );
          } else if (child.type === "group") {
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
                  visibility: isVisibleCild ? "visible" : "hidden",
                  opacity: computeOpacity(child.opacity, isHidden),
                }}
                className={`banner-object-child ${
                  selectedChildId?.groupId === object.id &&
                  selectedChildId.childId === child.id
                    ? "selected"
                    : ""
                }`}
                onDoubleClick={(e) =>
                  handleChildClick(object.id, child.id, e, undefined)
                }
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
                        isVisibleCild &&
                        !hiddenObjectIds.includes(nestedChild.id);
                      const {
                        id: nestedId,
                        condition,
                        content,
                        rotate,
                        src,
                        ...nestedStyles
                      } = nestedChild;
                      if (nestedChild.type === "image") {
                        return (
                          <img
                            key={nestedId}
                            id={`${nestedId}`}
                            data-condition={JSON.stringify(condition)}
                            src={replaceDynamicVariables(
                              src ?? "",
                              keyValuePairs
                            )}
                            alt={"image"}
                            style={{
                              ...nestedStyles,
                              visibility: isVisibleCildNested
                                ? "visible"
                                : "hidden",
                            }}
                            className={`image-field banner-object-child ${
                              selectedChildId?.groupId === child.id &&
                              selectedChildId.childId === nestedChild.id
                                ? "selected-grand-child"
                                : ""
                            }`}
                            onDoubleClick={(e) =>
                              handleChildClick(
                                child.id,
                                nestedChild.id,
                                e,
                                object.id
                              )
                            }
                          />
                        );
                      } else if (nestedChild.type === "text") {
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
                              visibility: isVisibleCildNested
                                ? "visible"
                                : "hidden",
                            }}
                            className={`image-field banner-object-child ${
                              selectedChildId?.groupId === child.id &&
                              selectedChildId.childId === nestedChild.id
                                ? "selected-grand-child"
                                : ""
                            }`}
                            onDoubleClick={(e) =>
                              handleChildClick(
                                child.id,
                                nestedChild.id,
                                e,
                                object.id
                              )
                            }
                          >
                            {content}
                          </div>
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
                            visibility: isVisibleCildNested
                              ? "visible"
                              : "hidden",
                          }}
                          className={`image-field banner-object-child ${
                            selectedChildId?.groupId === child.id &&
                            selectedChildId.childId === nestedChild.id
                              ? "selected-grand-child"
                              : ""
                          }`}
                          onDoubleClick={(e) =>
                            handleChildClick(
                              child.id,
                              nestedChild.id,
                              e,
                              object.id
                            )
                          }
                        >
                          {content}
                        </p>
                      );
                    })}
                </div>
              </div>
            );
          }
          return null;
        })}
    </>
  );
};
