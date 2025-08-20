import type { NodeApi } from "react-arborist";
import type { ArboristNodeData } from "./convertObjectsToTree";
import { useTranslation } from "react-i18next";

interface Props {
  node: NodeApi<ArboristNodeData>;
  state: {
    isEditing: boolean;
    editValue: string;
    inputRef: React.RefObject<HTMLInputElement>;
  };
  handlers: {
    setEditValue: React.Dispatch<React.SetStateAction<string>>;
    handleBlur: () => void;
    handleKeyDown: (e: React.KeyboardEvent) => void;
  };
}

export function TreeNodeLabel({ node, state, handlers }: Props) {
  const { t } = useTranslation();

  return (
    <div className="input-wrapper">
      {state.isEditing && !node.data.isAbstractGroup ? (
        <input
          ref={state.inputRef}
          value={state.editValue}
          onChange={(e) => handlers.setEditValue(e.target.value)}
          onBlur={handlers.handleBlur}
          onKeyDown={handlers.handleKeyDown}
          className="input"
          style={{
            width: "100%",
            fontSize: "inherit",
            border: "1px solid #ccc",
            padding: "2px 4px",
            cursor: "text",
          }}
          onMouseDown={(e) => e.stopPropagation()}
        />
      ) : (
        <span>
          {node.data.isAbstractGroup
            ? t("layersPanel.group")
            : node.data.raw?.name || node.data.label}
        </span>
      )}
    </div>
  );
}
