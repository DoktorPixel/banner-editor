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

  const reorderNestedChildren = (
    parentId: number,
    groupId: number,
    newOrder: number[]
  ) => {
    const parent = objects.find((obj) => obj.id === parentId);
    if (!parent || parent.type !== "group" || !parent.children) {
      console.warn("Parent group not found or has no children.");
      return;
    }

    const targetGroup = parent.children.find(
      (c) => c.id === groupId && c.type === "group" && Array.isArray(c.children)
    );
    if (!targetGroup || !targetGroup.children) {
      console.warn("Target nested group not found or has no children.");
      return;
    }

    const currentIds = targetGroup.children.map((c) => c.id);
    if (
      newOrder.length !== currentIds.length ||
      !newOrder.every((id) => currentIds.includes(id))
    ) {
      console.warn("Invalid ID array passed for nested new order.");
      return;
    }

    const newNestedChildren = newOrder.map((childId, index) => {
      const child = targetGroup.children!.find((c) => c.id === childId)!;
      return { ...child, order: index };
    });

    const updatedParentChildren = parent.children.map((c) =>
      c.id === groupId ? { ...c, children: newNestedChildren } : c
    );

    updateObject(parentId, { children: updatedParentChildren });
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
        reorderNestedChildren,
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
