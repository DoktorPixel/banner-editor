import { BannerObject } from "../../types";
import { Typography } from "@mui/material";

interface SelectedObjectsListProps {
  objects: (BannerObject | undefined)[];
}

export const SelectedObjectsList: React.FC<SelectedObjectsListProps> = ({
  objects,
}) => {
  return (
    <>
      <Typography variant="h6">Вибрані об'єкти:</Typography>
      <ul>
        {objects.map(
          (obj) =>
            obj && (
              <li key={obj.id}>
                {obj.type} (ID: {obj.id})
              </li>
            )
        )}
      </ul>
    </>
  );
};
