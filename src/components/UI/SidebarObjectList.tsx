import { List } from "@mui/material";
import { useMemo, useState } from "react";
import { Tree } from "react-arborist";
import type { NodeRendererProps } from "react-arborist";
import { BannerObject } from "../../types";
import { useObjectTypeLabel } from "../../utils/hooks";
import { useBanner } from "../../context/BannerContext";
import { useObjectProperties } from "../../utils/hooks";
import NameDialog from "./dialogs/NameDialog";
import { SvgImage, SvgText } from "../../assets/icons";
import { VisibilityToggle } from "./button-groups/VisibilityToggle";

/**
 * Компонент SidebarObjectList — отвечает за отображение "слоёв" / дерева объектов в сайдбаре редактора.
 * Он:
 *  - Показывает список всех объектов баннера
 *  - Группирует объекты по abstractGroupId (виртуальные группы)
 *  - Позволяет выбирать объекты (по клику или двойному клику)
 *  - Позволяет переименовывать объекты через NameDialog
 *  - Предоставляет кнопки для скрытия/показа объектов и групп
 *  - Позволяет сворачивать/разворачивать группы
 */
const SidebarObjectList: React.FC = () => {
  // Достаём объекты и функции для их выбора из контекста баннера
  const {
    objects,
    selectedObjectIds,
    selectObject,
    clearChildSelection,
    updateMultipleObjects,
  } = useBanner();

  // Хук для обновления свойств объектов (например, имени)
  const { updateObjectProperty } = useObjectProperties();

  // Локальное состояние для модального окна переименования
  const [nameDialogState, setNameDialogState] = useState({
    isNameDialogOpen: false, // Открыт ли диалог
    currentName: "", // Текущее редактируемое имя
    objectId: null as number | null, // ID редактируемого объекта
  });

  // Хук для получения локализованной подписи типа объекта (text → "Текст", image → "Картинка" и т.д.)
  const getObjectTypeLabel = useObjectTypeLabel();

  // Локализация не требуется в этом компоненте

  // Список объектов, отсортированный по zIndex (сверху — самый большой zIndex)
  const sortedObjects = useMemo(() => {
    return [...objects].sort((a, b) => (b.zIndex ?? 0) - (a.zIndex ?? 0));
  }, [objects]);

  // Открытие модального окна переименования объекта
  const openNameDialog = (object: BannerObject) => {
    setNameDialogState({
      isNameDialogOpen: true,
      currentName: object.name || "",
      objectId: object.id,
    });
  };

  // Закрытие модального окна переименования
  const closeNameDialog = () => {
    setNameDialogState({
      isNameDialogOpen: false,
      currentName: "",
      objectId: null,
    });
  };

  // Сохранение нового имени объекта
  const saveName = () => {
    if (nameDialogState.objectId !== null) {
      updateObjectProperty(
        nameDialogState.objectId,
        "name",
        nameDialogState.currentName
      );
    }
    closeNameDialog();
  };

  // Обработчик перемещения для обновления zIndex
  const handleMove = ({
    dragNodes,
    index,
    parentId,
  }: {
    dragNodes: { data: BannerObject }[];
    index: number;
    parentId: number | string | null;
  }) => {
    // Разрешаем перетаскивание только на корневом уровне (между BannerObject)
    if (parentId !== null && parentId !== undefined) return;
    if (!dragNodes || dragNodes.length === 0) return;
    const draggedIds: number[] = dragNodes.map((n) => n.data.id);

    const currentOrder = sortedObjects.map((o) => o.id);
    const remaining = currentOrder.filter((id) => !draggedIds.includes(id));
    // Вставляем перетаскиваемые элементы на новую позицию
    const newOrderIds = [
      ...remaining.slice(0, index),
      ...draggedIds,
      ...remaining.slice(index),
    ];

    // Назначаем новые zIndex: сверху — больший индекс
    const updates: Record<number, Partial<BannerObject>> = {};
    const maxIndex = newOrderIds.length - 1;
    newOrderIds.forEach((id, i) => {
      updates[id] = { zIndex: maxIndex - i };
    });
    updateMultipleObjects(updates);
  };

  return (
    <List sx={{ padding: "0px", margin: "0 0 0 6px" }}>
      <Tree
        data={sortedObjects}
        idAccessor="id"
        childrenAccessor="children"
        rowHeight={28}
        disableMultiSelection
        openByDefault
        onMove={handleMove}
      >
        {(props: NodeRendererProps<BannerObject>) => {
          const { node, style, dragHandle } = props;
          const obj: BannerObject = node.data;
          const isSelected = selectedObjectIds.includes(obj.id);
          return (
            <div
              style={{
                ...style,
                display: "flex",
                alignItems: "center",
                backgroundColor: isSelected ? "#f0f0f0" : "white",
                padding: "5px 0 5px 0px",
                cursor: "pointer",
              }}
              ref={dragHandle as unknown as React.Ref<HTMLDivElement>}
              onClick={(e) => {
                selectObject(obj.id, e.ctrlKey || e.metaKey);
                clearChildSelection();
              }}
              onDoubleClick={() => openNameDialog(obj)}
            >
              {obj.type === "text" && <SvgText />}
              {obj.type === "image" && <SvgImage />}
              {obj.type === "figure" && <SvgImage />}
              <span className="layers-list-item">
                {obj.name?.substring(0, 14) || getObjectTypeLabel(obj.type)}
                <VisibilityToggle objectId={obj.id} />
              </span>
            </div>
          );
        }}
      </Tree>

      <NameDialog
        open={nameDialogState.isNameDialogOpen}
        name={nameDialogState.currentName}
        onChange={(e) =>
          setNameDialogState((prev) => ({
            ...prev,
            currentName: e.target.value,
          }))
        }
        onClose={closeNameDialog}
        onSave={saveName}
      />
    </List>
  );
};

export default SidebarObjectList;
