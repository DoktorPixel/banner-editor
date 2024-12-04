import { useBanner } from "../context/BannerContext";
import { BannerObject, BannerChild } from "../types";

export const useObjectProperties = () => {
  const {
    objects,
    updateObject,
    deleteObject,
    deleteMultipleObjects,
    selectedObjectIds,
    clearSelection,
    //
  } = useBanner();

  const getObjectById = (id: number) => objects.find((obj) => obj.id === id);
  const selectedObjectId = selectedObjectIds[0];
  const selectedObject = selectedObjectId
    ? getObjectById(selectedObjectId)
    : null;

  const selectedObjects = selectedObjectIds.map((id) => getObjectById(id));

  const handleChange = (key: keyof BannerObject, value: string | number) => {
    if (selectedObjectId !== null) {
      updateObject(selectedObjectId, { [key]: value });
    }
  };

  const handleDelete = () => {
    if (selectedObjectIds.length > 0) {
      selectedObjectIds.forEach((id) => deleteObject(id));
      clearSelection();
    }
  };

  const handleDeleteAll = () => {
    if (selectedObjectIds.length > 0) {
      deleteMultipleObjects(selectedObjectIds);
      clearSelection();
    }
  };

  const updateObjectProperty = (
    objectId: number,
    key: keyof BannerObject,
    value: string | number
  ) => {
    updateObject(objectId, { [key]: value });
  };

  const updateObjectMultipleProperties = (
    objectId: number,
    updates: Partial<BannerObject>
  ) => {
    updateObject(objectId, updates);
  };

  //

  return {
    selectedObject,
    selectedObjects,
    selectedObjectIds,
    handleChange,
    handleDelete,
    handleDeleteAll,
    updateObjectProperty,
    updateObjectMultipleProperties,
    //
  };
};

export const useChildProperties = () => {
  const {
    selectedChildId,
    objects,
    updateChild,
    deleteChild,
    selectChild,
    clearChildSelection,
  } = useBanner();

  const selectedChild = selectedChildId
    ? objects
        .find((obj) => obj.id === selectedChildId.groupId)
        ?.children?.find((child) => child.id === selectedChildId.childId) ||
      null
    : null;

  const handleChangeChild = (
    key: keyof BannerChild,
    value: string | number
  ) => {
    if (selectedChildId) {
      updateChild(selectedChildId.groupId, selectedChildId.childId, {
        [key]: value,
      });
    }
  };

  const handleDeleteChild = () => {
    if (selectedChildId) {
      deleteChild(selectedChildId.groupId, selectedChildId.childId);
      clearChildSelection();
    }
  };

  return {
    selectedChild,
    selectedChildId,
    handleChangeChild,
    handleDeleteChild,
    selectChild,
    clearChildSelection,
  };
};
