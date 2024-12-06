import { ResizeHandlesProps, ResizeDirection } from "../../types";

const ResizeHandles: React.FC<ResizeHandlesProps> = ({
  objectId,
  selectedObjectId,
  handleResizeMouseDown,
}) => {
  const directions: ResizeDirection[] = [
    "top-left",
    "top-right",
    "bottom-left",
    "bottom-right",
    "middle-top",
    "middle-bottom",
    "middle-left",
    "middle-right",
  ];

  return (
    <>
      {directions.map((direction) => (
        <div
          key={direction}
          className={`resize-handle ${direction} ${
            selectedObjectId === objectId ? "selected" : ""
          }`}
          onMouseDown={(e) => handleResizeMouseDown(objectId, direction, e)}
        ></div>
      ))}
    </>
  );
};

export default ResizeHandles;
