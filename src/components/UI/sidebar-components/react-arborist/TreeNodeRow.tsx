import { forwardRef } from "react";
import { ToggleButton, TypeIcon } from "./SubComponents";
import { VisibilityToggle2 } from "../../button-groups/VisibilityToggle2";
import { GroupVisibilityToggle2 } from "../../button-groups/GroupVisibilityToggle2";
// import { useTranslation } from "react-i18next";
import { TreeNodeLabel } from "./TreeNodeLabel";
import type { NodeApi } from "react-arborist";
import type { ArboristNodeData } from "./convertObjectsToTree";
import { SvgVirtual } from "../../../../assets/icons";

interface Props {
  node: NodeApi<ArboristNodeData>;
  style: React.CSSProperties;
  preview?: boolean;
  state: {
    isEditing: boolean;
    isHovered: boolean;
    editValue: string;
    inputRef: React.RefObject<HTMLInputElement>;
  };
  handlers: {
    setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
    setIsHovered: React.Dispatch<React.SetStateAction<boolean>>;
    setEditValue: React.Dispatch<React.SetStateAction<string>>;
    handleClick: (e: React.MouseEvent) => void;
    handleDoubleClick: () => void;
    handleBlur: () => void;
    handleKeyDown: (e: React.KeyboardEvent) => void;
  };
}

export const TreeNodeRow = forwardRef<HTMLDivElement, Props>(
  ({ node, style, preview, state, handlers }, ref) => {
    // const { t } = useTranslation();

    const rowClass = [
      "row arborist-row",
      node.isSelected ? "row--selected" : "",
      preview ? "row--preview" : "",
    ].join(" ");

    return (
      <div
        ref={ref}
        className={`${rowClass} ${state.isEditing ? "row--editing" : ""}`}
        style={{
          ...style,
          paddingLeft: node.level * 16,
          backgroundColor: state.isHovered ? "#F5F5F5" : "",
          cursor: preview ? "grabbing" : "grab",
          userSelect: state.isEditing ? "none" : "text",
        }}
        onClick={handlers.handleClick}
        onDoubleClick={handlers.handleDoubleClick}
        onMouseEnter={() => handlers.setIsHovered(true)}
        onMouseLeave={() => handlers.setIsHovered(false)}
      >
        <div
          onPointerDown={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <ToggleButton node={node} />
        </div>

        <div style={{ width: 14, textAlign: "center" }}>
          {node.data.isAbstractGroup ? (
            <div style={{ width: 14, textAlign: "center" }}>
              <SvgVirtual />
            </div>
          ) : (
            <TypeIcon node={node} />
          )}
        </div>

        <TreeNodeLabel node={node} state={state} handlers={handlers} />

        <div
          onPointerDown={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
        >
          {node.data.isAbstractGroup ? (
            <GroupVisibilityToggle2
              objectIds={
                node.children ? node.children.map((c) => c.data.originalId) : []
              }
              show={state.isHovered}
            />
          ) : (
            <VisibilityToggle2
              objectId={node.data.originalId}
              show={state.isHovered}
            />
          )}
        </div>
      </div>
    );
  }
);
