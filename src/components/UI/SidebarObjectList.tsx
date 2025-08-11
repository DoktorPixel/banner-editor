import {
  List,
  ListItem,
  Collapse,
  IconButton,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  useDraggable,
  useDroppable,
} from "@dnd-kit/core";
import { useState } from "react";
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

/**
 * Компонент SidebarObjectList — отвечает за отображение "слоёв" / дерева объектов в сайдбаре редактора.
 * Он:
 *  - Показывает список всех объектов баннера
 *  - Группирует объекты по abstractGroupId (виртуальные группы)
 *  - Позволяет выбирать объекты (по клику или двойному клику)
 *  - Позволяет переименовывать объекты через NameDialog
 *  - Предоставляет кнопки для скрытия/показа объектов и групп
 *  - Позволяет сворачивать/разворачивать группы
 *
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

  // DnD sensors (не начинаем перетаскивание от простого клика, нужен небольшой сдвиг)
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 },
    })
  );

  // Вспомогательная обёртка для корневых элементов списка
  const RootDnDItem: React.FC<{ id: number; children: React.ReactNode }> = ({
    id,
    children,
  }) => {
    const {
      attributes,
      listeners,
      setNodeRef: setDraggableRef,
      transform,
    } = useDraggable({ id });
    const { setNodeRef: setDroppableRef } = useDroppable({ id });

    const style = {
      transform: transform
        ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
        : undefined,
    };

    return (
      <div ref={setDroppableRef}>
        <div ref={setDraggableRef} style={style} {...attributes} {...listeners}>
          {children}
        </div>
      </div>
    );
  };

  // Диалог выбора типа группировки после drop одного рутового объекта на другой
  const [groupDialog, setGroupDialog] = useState<{
    open: boolean;
    activeId?: number;
    overId?: number;
  }>({ open: false });

  const closeGroupDialog = () => setGroupDialog({ open: false });

  const handleCreateFlexGroup = () => {
    // ожидаем, что оба объекта выделены в handleDragEnd
    groupSelectedObjects();
    closeGroupDialog();
  };

  const handleCreateAbstractGroup = () => {
    groupSelectedObjectsAbstract();
    closeGroupDialog();
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const activeId = Number(active.id);
    const overId = Number(over.id);

    // Выделяем оба объекта, затем открываем диалог выбора типа группы
    selectObject(overId, false);
    selectObject(activeId, true);

    setGroupDialog({ open: true, activeId, overId });
  };

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

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <List sx={{ padding: "0px", margin: "0 0 0 6px" }}>
        {objects.map((obj) => {
          /**
           * ======= 1. ОБРАБОТКА ВИРТУАЛЬНЫХ ГРУПП =======
           * Если объект принадлежит virtual group (abstractGroupId != null),
           * то мы берём все объекты этой группы и выводим общий заголовок.
           */
          if (
            obj.abstractGroupId != null &&
            groupedObjects[obj.abstractGroupId]
          ) {
            const group = groupedObjects[obj.abstractGroupId];
            // Чтобы группа не отрисовалась повторно для других элементов, удаляем её из списка
            delete groupedObjects[obj.abstractGroupId];

            return (
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
                  <span className="layers-list-item">
                    {t("layersPanel.group")}
                  </span>

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
                            backgroundColor: selectedObjectIds.includes(
                              groupObj.id
                            )
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
          }

          /**
           * ======= 2. ОБРАБОТКА ОБЪЕКТОВ БЕЗ abstractGroupId =======
           * Если объект не входит в виртуальную группу:
           *   - Если он типа "group", рендерим GroupListItem
           *   - Иначе рендерим обычный ListItem
           */
          if (obj.abstractGroupId == null) {
            return obj.type === "group" ? (
              <RootDnDItem key={obj.id} id={obj.id}>
                <GroupListItem
                  group={obj}
                  selectedObjectIds={selectedObjectIds}
                  selectObject={selectObject}
                  openNameDialog={openNameDialog}
                />
              </RootDnDItem>
            ) : (
              <RootDnDItem key={obj.id} id={obj.id}>
                <ListItem
                  component="li"
                  onClick={(e) => {
                    selectObject(obj.id, e.ctrlKey || e.metaKey);
                    clearChildSelection();
                  }}
                  onDoubleClick={() => openNameDialog(obj)}
                  sx={{
                    cursor: "pointer",
                    backgroundColor: selectedObjectIds.includes(obj.id)
                      ? "#f0f0f0"
                      : "white",
                    "&:hover": { backgroundColor: "#f5f5f5" },
                    padding: "5px 0 5px 0px",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {/* Иконка по типу */}
                  {obj.type === "text" && <SvgText />}
                  {obj.type === "image" && <SvgImage />}
                  {obj.type === "figure" && <SvgImage />}

                  {/* Название + кнопка видимости */}
                  <span className="layers-list-item">
                    {obj.name?.substring(0, 14) || getObjectTypeLabel(obj.type)}
                    <VisibilityToggle objectId={obj.id} />
                  </span>
                </ListItem>
              </RootDnDItem>
            );
          }

          return null;
        })}

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
        {/* Диалог выбора типа создаваемой группы */}
        <Dialog
          open={groupDialog.open}
          onClose={closeGroupDialog}
          maxWidth="xs"
          fullWidth
        >
          <DialogTitle>
            {t("layersPanel.chooseGroupTypeTitle", {
              defaultValue: "Какую группу создать?",
            })}
          </DialogTitle>
          <DialogContent>
            <div style={{ paddingTop: 4, paddingBottom: 4 }}>
              {t("layersPanel.chooseGroupTypeDescription", {
                defaultValue: "Выберите тип группы для их объединения.",
              })}
            </div>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleCreateAbstractGroup}
              color="primary"
              variant="outlined"
            >
              {t("layersPanel.createAbstractGroup", {
                defaultValue: "Виртуальная группа",
              })}
            </Button>
            <Button
              onClick={handleCreateFlexGroup}
              color="primary"
              variant="contained"
            >
              {t("layersPanel.createFlexGroup", {
                defaultValue: "Флекс-группа",
              })}
            </Button>
          </DialogActions>
        </Dialog>
      </List>
    </DndContext>
  );
};

export default SidebarObjectList;
