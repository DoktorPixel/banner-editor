// react-arborist/TreeNode.tsx
import type { NodeRendererProps } from "react-arborist";
import type { ArboristNodeData } from "./convertObjectsToTree";
import {
  SvgImage,
  SvgText,
  SvgLayoutOpen,
  SvgLayout,
  ArrowRight,
  ArrowDown,
} from "../../../../assets/icons";

export function TreeNode({
  node,
  style,
  dragHandle,
  preview,
}: NodeRendererProps<ArboristNodeData>) {
  const data = node.data;

  // Кнопка-стрелка для открытия/закрытия
  const toggleButton =
    data.type === "group" ? (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          cursor: "pointer",
          width: "14px",
        }}
        onClick={(e) => {
          e.stopPropagation();
          node.toggle();
        }}
      >
        {node.isOpen ? <ArrowDown /> : <ArrowRight />}
      </div>
    ) : (
      <></> // пустое место вместо стрелки
    );

  // Иконка по типу
  const typeIcon = (() => {
    switch (data.type) {
      case "text":
        return <SvgText />;
      case "image":
        return <SvgImage />;
      case "group":
        return node.isOpen ? <SvgLayoutOpen /> : <SvgLayout />;
      case "figure":
        return <SvgImage />;
      default:
        return "•";
    }
  })();

  const rowClass = [
    "row",
    node.isSelected ? "row--selected" : "",
    preview ? "row--preview" : "",
  ].join(" ");

  return (
    <div
      style={{
        ...style,
        display: "flex",
        alignItems: "center",
        paddingLeft: node.level * 16 + 4, // отступ слева в зависимости от вложенности
      }}
      ref={dragHandle}
      className={rowClass}
    >
      {/* Кнопка открытия/закрытия (для группы) */}
      {toggleButton}

      {/* Иконка типа */}
      <div style={{ width: 14, textAlign: "center" }}>{typeIcon}</div>

      {/* Название */}
      <div
        style={{
          flex: 1,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {data.label}
      </div>

      {/* ID объекта */}
      <div style={{ marginLeft: 8, opacity: 0.6, fontSize: 12 }}>
        #{data.originalId}
      </div>
    </div>
  );
}
