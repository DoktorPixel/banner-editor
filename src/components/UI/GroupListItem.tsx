import { useMemo, useState } from "react";
import { ListItem, Collapse, IconButton, Box } from "@mui/material";
import { BannerObject, BannerChild } from "../../types";
import { useChildProperties, useObjectTypeLabel } from "../../utils/hooks";
import { Tree, NodeApi } from "react-arborist";
import {
  SvgLayout,
  ArrowRight,
  ArrowDown,
  SvgLayoutOpen,
  SvgImage,
  SvgText,
} from "../../assets/icons";
import { VisibilityToggle } from "./button-groups/VisibilityToggle";
import { useTranslation } from "react-i18next";

interface GroupListItemProps {
  group: BannerObject;
  selectedObjectIds: number[];
  selectObject: (id: number, ctrlKey: boolean) => void;
  openNameDialog: (object: BannerObject) => void;
}

const GroupListItem: React.FC<GroupListItemProps> = ({
  group,
  selectedObjectIds,
  selectObject,
  openNameDialog,
}) => {
  const [open, setOpen] = useState(false);
  const { selectChild, selectedChildId } = useChildProperties();
  const { t } = useTranslation();
  const handleToggle = () => setOpen(!open);
  const getObjectTypeLabel = useObjectTypeLabel();
  const handleChildClick = (
    groupId: number,
    child: BannerChild,
    event: React.MouseEvent
  ) => {
    event.stopPropagation();
    selectChild(groupId, child.id);
  };

  type TreeNodeData = {
    id: string;
    name: string;
    type: BannerChild["type"];
    raw: BannerChild;
    children: TreeNodeData[] | null;
    containerKey: string;
  };

  const treeData = useMemo<TreeNodeData[]>(() => {
    const toNode = (c: BannerChild, parentKey: string): TreeNodeData => ({
      id: String(c.id),
      name: c.name || getObjectTypeLabel(c.type),
      type: c.type,
      raw: c,
      containerKey: parentKey,
      children:
        c.type === "group" && c.children
          ? c.children
              .slice()
              .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
              .map((cc) => toNode(cc, String(c.id)))
          : null,
    });
    return (group.children || [])
      .slice()
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
      .map((c) => toNode(c, "root"));
  }, [group.children, getObjectTypeLabel]);

  const handleMove = async (args: {
    dragIds: string[];
    dragNodes: NodeApi<TreeNodeData>[];
    parentId: string | null;
    parentNode: NodeApi<TreeNodeData> | null;
    index: number;
  }) => {
    const { dragNodes, parentNode, index } = args;
    const draggedNode = dragNodes[0];
    const dragged = draggedNode?.data.raw as BannerChild | undefined;
    if (!dragged) return;

    // Determine target container for reorder: top-level group children or nested group children
    const parentRaw: BannerChild | undefined = parentNode?.data?.raw;
    if (!parentRaw) {
      // Reorder at top level of this group
      if (draggedNode.data.containerKey !== "root") return;
      const children = (group.children || [])
        .slice()
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
      const withoutDragged = children.filter((c) => c.id !== dragged.id);
      const newChildren = [
        ...withoutDragged.slice(0, index),
        dragged,
        ...withoutDragged.slice(index),
      ];
      const newOrder = newChildren.map((c) => c.id);
      // Use context method via reorderChildren through hooks
      const event = new CustomEvent("reorder-children", {
        detail: { groupId: group.id, newOrder },
      });
      window.dispatchEvent(event);
      return;
    }

    // Reorder inside nested group under parentRaw
    if (parentRaw.type === "group") {
      if (draggedNode.data.containerKey !== String(parentRaw.id)) return;
      const nested = (parentRaw.children || [])
        .slice()
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
      const withoutDragged = nested.filter((c) => c.id !== dragged.id);
      const newChildren = [
        ...withoutDragged.slice(0, index),
        dragged,
        ...withoutDragged.slice(index),
      ];
      const newOrder = newChildren.map((c) => c.id);
      const event = new CustomEvent("reorder-nested-children", {
        detail: { parentId: group.id, groupId: parentRaw.id, newOrder },
      });
      window.dispatchEvent(event);
      return;
    }
  };

  const disableDrop = (args: {
    parentNode: NodeApi<TreeNodeData> | null;
    dragNodes: NodeApi<TreeNodeData>[];
    index: number;
  }) => {
    const targetKey = args.parentNode
      ? String(args.parentNode.data.raw.id)
      : "root";
    const fromKey = args.dragNodes[0]?.data.containerKey ?? "";
    return targetKey !== fromKey;
  };

  return (
    <>
      <ListItem
        key={group.id}
        component="li"
        onClick={(e) => selectObject(group.id, e.ctrlKey || e.metaKey)}
        onDoubleClick={() => openNameDialog(group)}
        sx={{
          cursor: "pointer",
          backgroundColor: selectedObjectIds.includes(group.id)
            ? "#EEEEEE"
            : "white",
          "&:hover": { backgroundColor: "#f5f5f5" },
          padding: "5px 0 5px 0",
          display: "flex",
          alignItems: "center",
        }}
      >
        <IconButton
          size="small"
          edge="start"
          sx={{ marginRight: "3px" }}
          onClick={handleToggle}
        >
          {open ? <ArrowDown /> : <ArrowRight />}
        </IconButton>
        {open ? <SvgLayoutOpen /> : <SvgLayout />}
        <span className="layers-list-item">
          {group.name?.substring(0, 10) || t("layersPanel.layout")}
          <VisibilityToggle objectId={group.id} />
        </span>
      </ListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <Box sx={{ pl: "36px" }}>
          <Tree
            data={treeData}
            width={"100%"}
            height={Math.max(180, 28 * (treeData.length + 1))}
            indent={18}
            padding={0}
            disableEdit
            openByDefault
            onMove={handleMove}
            disableDrop={({ parentNode, dragNodes, index }) =>
              disableDrop({ parentNode, dragNodes, index })
            }
          >
            {({ node }: { node: NodeApi<TreeNodeData> }) => {
              const raw: BannerChild = node.data.raw;
              const isSelected = selectedChildId?.childId === raw.id;
              const isGroup = raw.type === "group";
              return (
                <div
                  onClick={(e: React.MouseEvent<HTMLDivElement>) =>
                    handleChildClick(group.id, raw, e)
                  }
                  style={{
                    display: "flex",
                    alignItems: "center",
                    height: 28,
                    cursor: "pointer",
                    background: isSelected ? "#EEEEEE" : "white",
                    paddingLeft: 6,
                  }}
                >
                  {node.isInternal ? (
                    <IconButton
                      size="small"
                      sx={{ width: 20, height: 20, mr: 0.5 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        node.toggle();
                      }}
                    >
                      {node.isOpen ? <ArrowDown /> : <ArrowRight />}
                    </IconButton>
                  ) : (
                    <span style={{ width: 20, display: "inline-block" }} />
                  )}
                  {!isGroup &&
                    (raw.type === "text" ? <SvgText /> : <SvgImage />)}
                  <span className="layers-list-item" style={{ marginLeft: 6 }}>
                    {raw.name?.substring(0, 8) || getObjectTypeLabel(raw.type)}
                    <VisibilityToggle objectId={raw.id} />
                  </span>
                </div>
              );
            }}
          </Tree>
        </Box>
      </Collapse>
    </>
  );
};

export default GroupListItem;

