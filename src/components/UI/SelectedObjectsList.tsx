import { BannerObject } from "../../types";
import { Typography, Box } from "@mui/material";
import { ConditionSelectorForGroup } from "./selectors/ConditionSelectorForGroup";

interface SelectedObjectsListProps {
  objects: (BannerObject | undefined)[];
}

export const SelectedObjectsList: React.FC<SelectedObjectsListProps> = ({
  objects,
}) => {
  // console.log("Selected objects:", objects);
  const validObjects = objects.filter(Boolean) as BannerObject[];

  const abstractGroupId = validObjects[0]?.abstractGroupId ?? null;

  const isSameGroup =
    abstractGroupId != null &&
    validObjects.every((obj) => obj.abstractGroupId === abstractGroupId);

  const conditionForAbstract =
    isSameGroup && validObjects[0].conditionForAbstract
      ? validObjects[0].conditionForAbstract
      : undefined;

  return (
    <div className="padding-wrapper">
      <Typography variant="h6">Selected objects:</Typography>
      <ul>
        {validObjects.map((obj) => (
          <li key={obj.id}>
            {obj.type} (ID: {obj.id})
          </li>
        ))}
      </ul>

      {isSameGroup && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle1">
            Editing Abstract Group (ID: {abstractGroupId})
            <ConditionSelectorForGroup
              abstractGroupId={abstractGroupId}
              condition={conditionForAbstract}
            />
          </Typography>
        </Box>
      )}
    </div>
  );
};
