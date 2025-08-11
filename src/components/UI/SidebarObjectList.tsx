import {
  List,
  ListItem,
  Collapse,
  IconButton,
  Box,
  Dialog,
  DialogTitle,
  DialogActions,
  Button,
} from "@mui/material";
import { useMemo, useState } from "react";
import GroupListItem from "./GroupListItem";
import { BannerObject } from "../../types";
import { useObjectTypeLabel } from "../../utils/hooks";
import { useBanner } from "../../context/BannerContext";
import { useObjectProperties } from "../../utils/hooks";
import NameDialog from "./dialogs/NameDialog";
import {
  SvgImage,
  SvgText,
  SvgVirtual,
  ArrowRight,
  ArrowDown,
} from "../../assets/icons";
import { VisibilityToggle } from "./button-groups/VisibilityToggle";
import { GroupVisibilityToggle } from "./button-groups/GroupVisibilityToggle";
import { useTranslation } from "react-i18next";
import { useVirtualGroupActions } from "../../utils/hooks";
// DnD (file-explorer themed tree) — только для рутовых простых объектов
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import SortableTree, { TreeItem, OnMoveNodeParams } from "react-sortable-tree";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import FileExplorerTheme from "react-sortable-tree-theme-file-explorer";
import "react-sortable-tree/style.css";

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
    objects, // Все объекты баннера
    selectedObjectIds, // Массив ID выбранных объектов
    selectObject, // Функция выбора одного объекта
    selectAllObjects, // Функция выбора всех объектов в группе
    clearChildSelection, // Сброс выделения вложенных элементов
    groupSelectedObjects, // группирует объекты в флекс группу type: "group" ,
  } = useBanner();

  const { groupSelectedObjectsAbstract } = useVirtualGroupActions();

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

  // Локальное состояние — какие группы развёрнуты (ключ: ID группы)
  const [openGroups, setOpenGroups] = useState<Record<number, boolean>>({});

  // Локализация
  const { t } = useTranslation();

  // Диалог для выбора типа создаваемой группы после dnd на рутовом уровне
  const [pendingGroupPair, setPendingGroupPair] = useState<{
    sourceId: number;
    targetId: number;
  } | null>(null);

  const closeGroupTypeDialog = () => setPendingGroupPair(null);

  // Функция для сворачивания/разворачивания группы
  const toggleGroup = (groupId: number) => {
    setOpenGroups((prev) => ({ ...prev, [groupId]: !prev[groupId] }));
  };

  /**
   * Группируем объекты по abstractGroupId.
   * Если у объекта есть abstractGroupId, значит он входит в "виртуальную группу" (не путать с объектом типа group).
   */
  const groupedObjects = objects.reduce<Record<number, BannerObject[]>>(
    (acc, obj) => {
      if (obj.abstractGroupId != null) {
        if (!acc[obj.abstractGroupId]) acc[obj.abstractGroupId] = [];
        acc[obj.abstractGroupId].push(obj);
      }
      return acc;
    },
    {}
  );

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

  // Высота строки для dnd-дерева (визуально близко к MUI ListItem)
  const ROW_HEIGHT = 300;

  // Рендерим список с сохранением порядка: блокируем в буфер подряд идущие рутовые "простые" объекты
  const renderedList = useMemo(() => {
    const elements: React.ReactNode[] = [];

    // локальный буфер простых рутовых объектов
    let leafBuffer: BannerObject[] = [];

    // функция сброса буфера в один SortableTree
    const flushLeafBuffer = () => {
      if (leafBuffer.length === 0) return;

      // Локальная копия, чтобы избежать обращения к устаревшему состоянию
      const localBuffer = leafBuffer.slice();
      const localById = new Map(localBuffer.map((o) => [o.id, o] as const));

      const treeData: Array<
        TreeItem & {
          objectId: number;
          objType: BannerObject["type"];
          objName?: string;
        }
      > = localBuffer.map((o) => ({
        // title будет переопределён в generateNodeProps
        title: o.name || o.type,
        objectId: o.id,
        objType: o.type,
        objName: o.name,
        children: [],
      }));

      elements.push(
        <div
          key={`leaf-tree-${localBuffer[0].id}`}
          style={{ height: ROW_HEIGHT * treeData.length }}
        >
          <SortableTree
            theme={FileExplorerTheme}
            treeData={treeData}
            // мы не меняем порядок, onChange игнорируем
            onChange={() => {}}
            rowHeight={ROW_HEIGHT}
            canDrag={() => true}
            canDrop={() => true}
            // Пользователь перетащил один рутовый элемент на другой — предлагаем создать группу
            onMoveNode={(params: OnMoveNodeParams) => {
              const movedNode = params.node as TreeItem & { objectId?: number };
              const nextParentNode = params.nextParent as
                | (TreeItem & { objectId?: number })
                | undefined;
              if (
                nextParentNode &&
                movedNode?.objectId &&
                nextParentNode.objectId
              ) {
                const sourceId = movedNode.objectId as number;
                const targetId = nextParentNode.objectId as number;
                if (sourceId !== targetId) {
                  setPendingGroupPair({ sourceId, targetId });
                }
              }
            }}
            generateNodeProps={({ node }) => {
              const n = node as TreeItem & {
                objectId: number;
                objType: BannerObject["type"];
                objName?: string;
              };
              const objectId = n.objectId;
              const obj = localById.get(objectId);
              const isSelected = selectedObjectIds.includes(objectId);
              return {
                title: (
                  <div
                    onClick={(e) => {
                      selectObject(
                        objectId,
                        (e as React.MouseEvent).ctrlKey ||
                          (e as React.MouseEvent).metaKey
                      );
                      clearChildSelection();
                    }}
                    onDoubleClick={() => obj && openNameDialog(obj)}
                    style={{
                      cursor: "pointer",
                      backgroundColor: isSelected ? "#f0f0f0" : "white",
                      padding: "5px 0 5px 0px",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    {n.objType === "text" && <SvgText />}
                    {n.objType === "image" && <SvgImage />}
                    {n.objType === "figure" && <SvgImage />}
                    <span className="layers-list-item">
                      {(n.objName || "").substring(0, 14) ||
                        getObjectTypeLabel(n.objType)}
                      <VisibilityToggle objectId={objectId} />
                    </span>
                  </div>
                ),
              };
            }}
          />
        </div>
      );

      leafBuffer = [];
    };

    const virtualGroupsRendered = new Set<number>();

    objects.forEach((obj) => {
      /**
       * ======= 1. ОБРАБОТКА ВИРТУАЛЬНЫХ ГРУПП =======
       * Если объект принадлежит virtual group (abstractGroupId != null),
       * то мы берём все объекты этой группы и выводим общий заголовок.
       */
      if (
        obj.abstractGroupId != null &&
        groupedObjects[obj.abstractGroupId] &&
        !virtualGroupsRendered.has(obj.abstractGroupId)
      ) {
        flushLeafBuffer();
        const group = groupedObjects[obj.abstractGroupId];
        virtualGroupsRendered.add(obj.abstractGroupId);

        elements.push(
          <Box key={`group-${obj.abstractGroupId}`}>
            {/* Заголовок виртуальной группы */}
            <ListItem
              component="div"
              sx={{
                padding: "5px 0 5px 0px",
                backgroundColor: group.every((groupObj) =>
                  selectedObjectIds.includes(groupObj.id)
                )
                  ? "#f0f0f0" // Если все выделены — подсветка
                  : "white",
                "&:hover": { backgroundColor: "#f5f5f5" },
              }}
              onClick={(e) => {
                selectAllObjects(obj.id, e.ctrlKey || e.metaKey);
                clearChildSelection();
              }}
            >
              {/* Кнопка сворачивания/разворачивания */}
              <IconButton
                size="small"
                edge="start"
                sx={{ marginRight: "3px" }}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleGroup(obj.abstractGroupId!);
                }}
              >
                {openGroups[obj.abstractGroupId!] ? (
                  <ArrowDown />
                ) : (
                  <ArrowRight />
                )}
              </IconButton>

              {/* Иконка виртуальной группы */}
              <SvgVirtual />

              {/* Название группы */}
              <span className="layers-list-item">{t("layersPanel.group")}</span>

              {/* Кнопка скрытия/показа всей группы */}
              <GroupVisibilityToggle objectIds={group.map((o) => o.id)} />
            </ListItem>

            {/* Список объектов внутри виртуальной группы */}
            <Collapse
              in={openGroups[obj.abstractGroupId]}
              timeout="auto"
              unmountOnExit
            >
              <List component="div" sx={{ padding: "0 0 0 36px" }}>
                {group.map((groupObj) =>
                  groupObj.type === "group" ? (
                    // Если объект сам является группой — рендерим GroupListItem
                    <GroupListItem
                      key={groupObj.id}
                      group={groupObj}
                      selectedObjectIds={selectedObjectIds}
                      selectObject={selectObject}
                      openNameDialog={openNameDialog}
                    />
                  ) : (
                    // Если обычный объект (текст, изображение, фигура)
                    <ListItem
                      key={groupObj.id}
                      component="li"
                      onClick={(e) => {
                        selectObject(groupObj.id, e.ctrlKey || e.metaKey);
                        clearChildSelection();
                      }}
                      onDoubleClick={() => openNameDialog(groupObj)}
                      sx={{
                        cursor: "pointer",
                        backgroundColor: selectedObjectIds.includes(groupObj.id)
                          ? "#f0f0f0"
                          : "white",
                        "&:hover": { backgroundColor: "#f5f5f5" },
                        padding: "5px 0 5px 0px",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      {/* Иконка по типу объекта */}
                      {groupObj.type === "text" && <SvgText />}
                      {groupObj.type === "image" && <SvgImage />}
                      {groupObj.type === "figure" && <SvgImage />}

                      {/* Имя объекта + кнопка видимости */}
                      <span className="layers-list-item">
                        {groupObj.name?.substring(0, 12) ||
                          getObjectTypeLabel(groupObj.type)}
                        <VisibilityToggle objectId={groupObj.id} />
                      </span>
                    </ListItem>
                  )
                )}
              </List>
            </Collapse>
          </Box>
        );
        return;
      }

      /**
       * ======= 2. ОБРАБОТКА ОБЪЕКТОВ БЕЗ abstractGroupId =======
       * Если объект не входит в виртуальную группу:
       *   - Если он типа "group", рендерим GroupListItem
       *   - Иначе рендерим обычный ListItem
       */
      if (obj.abstractGroupId == null) {
        if (obj.type === "group") {
          // Перед рендерингом группы сбрасываем буфер листовых рутовых элементов
          flushLeafBuffer();
          elements.push(
            <GroupListItem
              key={obj.id}
              group={obj}
              selectedObjectIds={selectedObjectIds}
              selectObject={selectObject}
              openNameDialog={openNameDialog}
            />
          );
        } else {
          // Копим подряд идущие рутовые простые объекты в один dnd-блок
          leafBuffer.push(obj);
        }
        return;
      }

      // safety
      return;
    });

    // в конце рендерим оставшийся буфер
    flushLeafBuffer();

    return elements;
  }, [
    objects,
    selectedObjectIds,
    openGroups,
    groupedObjects,
    t,
    selectAllObjects,
    clearChildSelection,
    getObjectTypeLabel,
    selectObject,
  ]);

  return (
    <List sx={{ padding: "0px", margin: "0 0 0 6px" }}>
      {renderedList}

      {/* Диалог переименования объекта */}
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

      {/* Диалог выбора типа группы при dnd одного рутового объекта на другой */}
      <Dialog open={!!pendingGroupPair} onClose={closeGroupTypeDialog}>
        <DialogTitle>
          {t("layersPanel.chooseGroupType") || "Выберите тип группы"}
        </DialogTitle>
        <DialogActions>
          <Button
            variant="contained"
            onClick={() => {
              if (!pendingGroupPair) return;
              // Выделяем оба объекта и вызываем флекс-группировку
              selectObject(pendingGroupPair.sourceId);
              selectObject(pendingGroupPair.targetId, true);
              groupSelectedObjects();
              closeGroupTypeDialog();
            }}
          >
            {t("layersPanel.flexGroup") || "Флекс группа"}
          </Button>
          <Button
            variant="outlined"
            onClick={() => {
              if (!pendingGroupPair) return;
              // Выделяем оба объекта и вызываем виртуальную группировку
              selectObject(pendingGroupPair.sourceId);
              selectObject(pendingGroupPair.targetId, true);
              groupSelectedObjectsAbstract();
              closeGroupTypeDialog();
            }}
          >
            {t("layersPanel.virtualGroup") || "Виртуальная группа"}
          </Button>
        </DialogActions>
      </Dialog>
    </List>
  );
};

export default SidebarObjectList;
