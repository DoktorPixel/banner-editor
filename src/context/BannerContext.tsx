import { createContext, useContext, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  BannerObject,
  BannerContextProps,
  BannerChild,
  DynamicImg,
} from "../types";

const BannerContext = createContext<BannerContextProps | undefined>(undefined);

export const BannerProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [history, setHistory] = useState<BannerObject[][]>([[]]);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [selectedObjectIds, setSelectedObjectIds] = useState<number[]>([]);
  const [temporaryUpdates, setTemporaryUpdates] = useState<{
    [key: number]: Partial<BannerObject>;
  }>({});
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);
  const [scale, setScale] = useState<number>(0.4);
  const objects = history[currentStep] || [];

  const renderedObjects = useMemo(() => {
    return objects.map((obj) => ({
      ...obj,
      ...(temporaryUpdates[obj.id] || {}),
    }));
  }, [objects, temporaryUpdates]);

  const [selectedChildId, setSelectedChildId] = useState<{
    groupId: number;
    childId: number;
    parentId?: number;
  } | null>(null);

  //

  const [refreshCounter, setRefreshCounter] = useState(0);
  const triggerRefresh = () => setRefreshCounter((prev) => prev + 1);

  const [dynamicImgs, setDynamicImgs] = useState<DynamicImg[]>([]);

  const addDynamicImg = (newImg: DynamicImg) => {
    setDynamicImgs((prev = []) => {
      const exists = prev.some((img) => img.id === newImg.id);
      return exists ? prev : [...prev, newImg];
    });
  };

  const updateDynamicImg = (updatedImg: DynamicImg) => {
    if (!updatedImg.id) return;

    setDynamicImgs((prev) =>
      prev.map((img) =>
        img.id === updatedImg.id ? { ...img, ...updatedImg } : img
      )
    );
  };

  const deleteDynamicImg = (id: string) => {
    setDynamicImgs((prev) => prev.filter((img) => img.id !== id));
  };

  const updateDynamicImgName = (id: string, name: string) => {
    setDynamicImgs((prev) =>
      prev.map((img) => (img.id === id ? { ...img, name } : img))
    );
  };

  //

  const addObject = (object: BannerObject) => {
    const maxZIndex = objects.reduce(
      (max, obj) => Math.max(max, obj.zIndex ?? 0),
      0
    );
    const newObjects = [
      ...objects,
      {
        ...object,
        zIndex: maxZIndex + 1,
      },
    ];
    updateHistory(newObjects);
  };

  const updateObject = (id: number, updates: Partial<BannerObject>) => {
    const newObjects = objects.map((obj) =>
      obj.id === id ? { ...obj, ...updates } : obj
    );
    updateHistory(newObjects);
  };

  const updateMultipleObjects = (
    updates: Record<number, Partial<BannerObject>>
  ) => {
    const newObjects = objects.map((obj) =>
      updates[obj.id] ? { ...obj, ...updates[obj.id] } : obj
    );
    updateHistory(newObjects);
  };

  const deleteObject = (id: number) => {
    const newObjects = objects.filter((obj) => obj.id !== id);
    updateHistory(newObjects);
  };

  const deleteMultipleObjects = (ids: number[]) => {
    const newObjects = objects.filter((obj) => !ids.includes(obj.id));
    updateHistory(newObjects);
  };

  const deleteObjectsByImageSrc = (src: string) => {
    const newObjects = objects.filter(
      (obj) => obj.type !== "image" || obj.src !== src
    );
    updateHistory(newObjects);
  };

  const updateHistory = (newObjects: BannerObject[]) => {
    const newHistory = [...history.slice(0, currentStep + 1), newObjects];
    setHistory(newHistory);
    setCurrentStep(newHistory.length - 1);
  };

  const addJson = (jsonData: BannerObject[]) => {
    if (!Array.isArray(jsonData)) {
      console.error("JSON transmissions contain an array of objects.");
      return;
    }
    updateHistory(jsonData);
  };

  const [currentProjectName, setCurrentProjectName] = useState<string | null>(
    null
  );

  const selectChild = (groupId: number, childId: number, parentId?: number) => {
    // clearSelection();
    setSelectedChildId({ groupId, childId, parentId });
  };

  const clearChildSelection = () => {
    setSelectedChildId(null);
  };

  const updateChild = (
    groupId: number,
    childId: number,
    updates: Partial<BannerChild>
  ) => {
    const newObjects = objects.map((obj) => {
      if (obj.id === groupId && obj.children) {
        const updatedChildren = obj.children.map((child) =>
          child.id === childId ? { ...child, ...updates } : child
        );
        return { ...obj, children: updatedChildren };
      }
      return obj;
    });
    updateHistory(newObjects);
  };

  const deleteChild = (groupId: number, childId: number) => {
    const newObjects = objects.map((obj) => {
      if (obj.id === groupId && obj.children) {
        const updatedChildren = obj.children.filter(
          (child) => child.id !== childId
        );
        return { ...obj, children: updatedChildren };
      }
      return obj;
    });
    updateHistory(newObjects);
  };

  const updateNestedChild = (
    parentId: number,
    groupId: number,
    childId: number,
    updates: Partial<BannerChild>
  ) => {
    const newObjects = objects.map((obj) => {
      if (obj.id === parentId && obj.children) {
        const updatedChildren = obj.children.map((child) => {
          if (child.id === groupId && child.children) {
            const updatedNestedChildren = child.children.map((nestedChild) =>
              nestedChild.id === childId
                ? { ...nestedChild, ...updates }
                : nestedChild
            );
            return { ...child, children: updatedNestedChildren };
          }
          return child;
        });
        return { ...obj, children: updatedChildren };
      }
      return obj;
    });
    updateHistory(newObjects);
  };

  const deleteNestedChild = (
    parentId: number,
    groupId: number,
    childId: number
  ) => {
    const newObjects = objects.map((obj) => {
      if (obj.id === parentId && obj.children) {
        const updatedChildren = obj.children.map((child) => {
          if (child.id === groupId && child.children) {
            const updatedNestedChildren = child.children.filter(
              (nestedChild) => nestedChild.id !== childId
            );
            return { ...child, children: updatedNestedChildren };
          }
          return child;
        });
        return { ...obj, children: updatedChildren };
      }
      return obj;
    });
    updateHistory(newObjects);
  };

  const navigate = useNavigate();

  const clearHistory = () => {
    setHistory([[]]);
    setCurrentStep(0);
  };

  const clearProject = () => {
    setHistory([[]]);
    setCurrentStep(0);
    setCurrentProjectName(null);
    navigate("/", { replace: true });
  };

  const undo = () => {
    if (canUndo) setCurrentStep((prev) => prev - 1);
  };

  const redo = () => {
    if (canRedo) setCurrentStep((prev) => prev + 1);
  };

  const canUndo = currentStep > 0;
  const canRedo = currentStep < history.length - 1;

  const selectObject = (id: number, toggle = false) => {
    clearChildSelection();
    setSelectedObjectIds((prev) => {
      if (toggle) {
        return prev.includes(id)
          ? prev.filter((objId) => objId !== id)
          : [...prev, id];
      } else {
        return [id];
      }
    });
  };

  const selectAllObjects = (id: number, toggle = false) => {
    setSelectedObjectIds((prev) => {
      const selectedObj = objects.find((obj) => obj.id === id);
      if (!selectedObj) return prev;

      const groupObjects = selectedObj.abstractGroupId
        ? objects
            .filter(
              (obj) => obj.abstractGroupId === selectedObj.abstractGroupId
            )
            .map((obj) => obj.id)
        : [];

      const newSelection = new Set([id, ...groupObjects]);

      if (toggle) {
        return prev.some((objId) => newSelection.has(objId))
          ? prev.filter((objId) => !newSelection.has(objId))
          : [...prev, ...newSelection];
      } else {
        return [...newSelection];
      }
    });
  };

  const clearSelection = () => setSelectedObjectIds([]);

  //

  const groupSelectedObjects = () => {
    if (selectedObjectIds.length < 2) {
      console.warn("To group, you need to select at least two objects.");
      return;
    }

    const selectedObjects = objects.filter((obj) =>
      selectedObjectIds.includes(obj.id)
    );

    const minX = Math.min(...selectedObjects.map((o) => o.x ?? 0));
    const minY = Math.min(...selectedObjects.map((o) => o.y ?? 0));

    const maxZIndex = objects.reduce(
      (max, obj) => Math.max(max, obj.zIndex ?? 0),
      0
    );

    const newGroup: BannerObject = {
      id: Date.now(),
      type: "group",
      x: minX,
      y: minY,
      width:
        Math.max(...selectedObjects.map((o) => (o.x ?? 0) + (o.width ?? 100))) -
        minX,
      height:
        Math.max(
          ...selectedObjects.map((o) => (o.y ?? 0) + (o.height ?? 100))
        ) - minY,
      zIndex: maxZIndex + 1,
      children: selectedObjects.map(
        ({ id, x, y, children = [], ...rest }, index) => ({
          id,
          x: (x ?? 0) - minX, // Относительное позиционирование внутри группы
          y: (y ?? 0) - minY,
          order: index, // Присваиваем order на основе индекса
          children:
            children.length > 0 ? children.map((child) => ({ ...child })) : [],
          ...rest, // Перенос всех стилей и свойств
        })
      ),
      display: "flex",
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      gap: "10px",
    };

    const newObjects = objects.filter(
      (obj) => !selectedObjectIds.includes(obj.id)
    );

    updateHistory([...newObjects, newGroup]);
    setSelectedObjectIds([newGroup.id]);
  };

  const ungroupSelectedObject = () => {
    if (selectedObjectIds.length !== 1) {
      console.warn("To ungroup, you only need to select one group.");
      return;
    }

    const selectedObject = objects.find(
      (obj) => obj.id === selectedObjectIds[0]
    );

    if (!selectedObject || selectedObject.type !== "group") {
      console.warn("The selected object is not a group.");
      return;
    }

    const ungroupedObjects = (selectedObject.children || []).map((child) => ({
      ...child,
      id: Date.now() + Math.random(),
      x: (child.x ?? 0) + selectedObject.x,
      y: (child.y ?? 0) + selectedObject.y,
    }));

    const newObjects = objects.filter((obj) => obj.id !== selectedObject.id);
    updateHistory([...newObjects, ...ungroupedObjects]);

    setSelectedObjectIds(ungroupedObjects.map((obj) => obj.id));
  };

  // --- Grouping helpers for DnD ---
  const groupObjectsAsFlex = (objectIds: number[]) => {
    const selectedObjects = objects.filter((obj) => objectIds.includes(obj.id));
    if (selectedObjects.length < 2) return;

    const minX = Math.min(...selectedObjects.map((o) => o.x ?? 0));
    const minY = Math.min(...selectedObjects.map((o) => o.y ?? 0));

    const maxZIndex = objects.reduce(
      (max, obj) => Math.max(max, obj.zIndex ?? 0),
      0
    );

    const newGroup: BannerObject = {
      id: Date.now(),
      type: "group",
      x: minX,
      y: minY,
      width:
        Math.max(...selectedObjects.map((o) => (o.x ?? 0) + (o.width ?? 100))) -
        minX,
      height:
        Math.max(
          ...selectedObjects.map((o) => (o.y ?? 0) + (o.height ?? 100))
        ) - minY,
      zIndex: maxZIndex + 1,
      children: selectedObjects.map(
        ({ id, x, y, children = [], ...rest }, index) => ({
          id,
          x: (x ?? 0) - minX,
          y: (y ?? 0) - minY,
          order: index,
          children:
            children.length > 0 ? children.map((child) => ({ ...child })) : [],
          ...rest,
        })
      ),
      display: "flex",
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      gap: "10px",
    };

    const remaining = objects.filter((obj) => !objectIds.includes(obj.id));
    updateHistory([...remaining, newGroup]);
    setSelectedObjectIds([newGroup.id]);
  };

  const groupObjectsAsAbstract = (objectIds: number[]) => {
    if (objectIds.length < 2) return;
    const abstractGroupId = Date.now();
    const updates: Record<number, Partial<BannerObject>> = {};
    objectIds.forEach((id) => {
      updates[id] = { abstractGroupId };
    });
    updateMultipleObjects(updates);
    setSelectedObjectIds([...objectIds]);
  };

  const getAbstractGroupMembers = (groupId: number): BannerObject[] =>
    objects.filter((o) => o.abstractGroupId === groupId);

  const addObjectToAbstractGroup = (objectId: number, groupId: number) => {
    // Remove from previous abstract group if needed and clean up
    const current = objects.find((o) => o.id === objectId);
    if (!current) return;
    const prevGroupId = current.abstractGroupId ?? null;
    if (prevGroupId && prevGroupId !== groupId) {
      const remaining = getAbstractGroupMembers(prevGroupId).filter(
        (o) => o.id !== objectId
      );
      if (remaining.length <= 1) {
        // dissolve previous group fully
        remaining.forEach((o) => updateObject(o.id, { abstractGroupId: null }));
      }
    }
    updateObject(objectId, { abstractGroupId: groupId });
  };

  const removeObjectFromAbstractGroup = (objectId: number) => {
    const current = objects.find((o) => o.id === objectId);
    if (!current || current.abstractGroupId == null) {
      updateObject(objectId, { abstractGroupId: null });
      return;
    }
    const groupId = current.abstractGroupId;
    const remaining = getAbstractGroupMembers(groupId).filter(
      (o) => o.id !== objectId
    );
    if (remaining.length <= 1) {
      // dissolve group completely
      remaining.forEach((o) => updateObject(o.id, { abstractGroupId: null }));
    }
    updateObject(objectId, { abstractGroupId: null });
  };

  const addObjectsToFlexGroup = (groupId: number, objectIds: number[]) => {
    const group = objects.find((o) => o.id === groupId);
    if (!group || group.type !== "group") return;

    const toAdd = objects.filter((o) => objectIds.includes(o.id));
    if (toAdd.length === 0) return;

    const baseOrder = group.children?.length ?? 0;
    const newChildren = toAdd.map(
      ({ id, x, y, children = [], ...rest }, index) => ({
        id,
        x: (x ?? 0) - (group.x ?? 0),
        y: (y ?? 0) - (group.y ?? 0),
        order: baseOrder + index,
        children:
          children.length > 0 ? children.map((child) => ({ ...child })) : [],
        ...rest,
      })
    );

    const updatedGroup: Partial<BannerObject> = {
      children: [...(group.children ?? []), ...newChildren],
    };

    const remaining = objects.filter(
      (o) => !objectIds.includes(o.id) || o.id === groupId
    );
    const merged = remaining.map((o) =>
      o.id === groupId ? { ...o, ...updatedGroup } : o
    );
    updateHistory(merged);
    setSelectedObjectIds([groupId]);
  };

  const removeChildFromFlexGroup = (groupId: number, childId: number) => {
    const group = objects.find((o) => o.id === groupId);
    if (!group || group.type !== "group" || !group.children) return;

    const removedChild = group.children.find((c) => c.id === childId);
    if (!removedChild) return;

    const remainingChildren = group.children.filter((c) => c.id !== childId);

    const liftedRemoved: BannerObject = {
      ...removedChild,
      id: Date.now() + Math.random(),
      x: (removedChild.x ?? 0) + (group.x ?? 0),
      y: (removedChild.y ?? 0) + (group.y ?? 0),
      type: removedChild.type,
    } as BannerObject;

    if (remainingChildren.length === 0) {
      // Remove group entirely, only the removed child is lifted
      const others = objects.filter((o) => o.id !== groupId);
      updateHistory([...others, liftedRemoved]);
      setSelectedObjectIds([liftedRemoved.id]);
      return;
    }

    if (remainingChildren.length === 1) {
      // Also lift the last remaining child and remove group
      const last = remainingChildren[0];
      const liftedLast: BannerObject = {
        ...last,
        id: Date.now() + Math.random(),
        x: (last.x ?? 0) + (group.x ?? 0),
        y: (last.y ?? 0) + (group.y ?? 0),
        type: last.type,
      } as BannerObject;
      const others = objects.filter((o) => o.id !== groupId);
      updateHistory([...others, liftedRemoved, liftedLast]);
      setSelectedObjectIds([liftedRemoved.id, liftedLast.id]);
      return;
    }

    // Keep group with remaining children and add lifted removed child to top level
    const updated = objects.map((o) =>
      o.id === groupId ? { ...o, children: remainingChildren } : o
    );
    updateHistory([...updated, liftedRemoved]);
    setSelectedObjectIds([liftedRemoved.id]);
  };

  const reorderChildren = (groupId: number, newOrder: number[]) => {
    const group = objects.find((obj) => obj.id === groupId);
    if (!group || group.type !== "group" || !group.children) {
      console.warn("The object is not a group or has no children.");
      return;
    }

    const currentChildIds = group.children.map((child) => child.id);
    if (
      newOrder.length !== currentChildIds.length ||
      !newOrder.every((id) => currentChildIds.includes(id))
    ) {
      console.warn("Invalid ID array passed for new order.");
      return;
    }

    const newChildren = newOrder.map((childId, index) => {
      const child = group.children!.find((c) => c.id === childId)!;
      return { ...child, order: index };
    });

    updateObject(groupId, { children: newChildren });
  };

  return (
    <BannerContext.Provider
      value={{
        objects,
        addObject,
        updateObject,
        updateMultipleObjects,
        deleteObject,
        deleteMultipleObjects,
        deleteObjectsByImageSrc,
        updateHistory,
        undo,
        redo,
        canUndo,
        canRedo,
        selectedObjectIds,
        selectObject,
        selectAllObjects,
        clearSelection,
        clearHistory,
        clearProject,
        groupSelectedObjects,
        ungroupSelectedObject,
        groupObjectsAsFlex,
        groupObjectsAsAbstract,
        addObjectToAbstractGroup,
        removeObjectFromAbstractGroup,
        addObjectsToFlexGroup,
        removeChildFromFlexGroup,
        //
        selectedChildId,
        selectChild,
        clearChildSelection,
        updateChild,
        deleteChild,
        updateNestedChild,
        deleteNestedChild,

        //
        temporaryUpdates,
        setTemporaryUpdates,
        renderedObjects,
        addJson,
        currentProjectName,
        setCurrentProjectName,
        //
        dynamicImgs,
        setDynamicImgs,
        addDynamicImg,
        updateDynamicImg,
        deleteDynamicImg,
        updateDynamicImgName,
        //
        currentProjectId,
        setCurrentProjectId,
        refreshCounter,
        triggerRefresh,
        reorderChildren,
        scale,
        setScale,
      }}
    >
      {children}
    </BannerContext.Provider>
  );
};

export const useBanner = (): BannerContextProps => {
  const context = useContext(BannerContext);
  if (!context) {
    throw new Error("useBanner must be used within a BannerProvider");
  }
  return context;
};
