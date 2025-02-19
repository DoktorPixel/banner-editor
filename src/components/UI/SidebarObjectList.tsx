import { List, ListItem, ListItemText } from "@mui/material";
import GroupListItem from "./GroupListItem";
import { BannerObject } from "../../types";
import { getObjectTypeLabel } from "../../utils/hooks";

interface ObjectListProps {
  objects: BannerObject[];
  selectedObjectIds: number[];
  selectObject: (id: number, toggle?: boolean) => void;
  openNameDialog: (object: BannerObject) => void;
}

const SidebarObjectList: React.FC<ObjectListProps> = ({
  objects,
  selectedObjectIds,
  selectObject,
  openNameDialog,
}) => {
  return (
    <List sx={{ padding: "0px" }}>
      {objects.map((obj) =>
        obj.type === "group" ? (
          <GroupListItem
            key={obj.id}
            group={obj}
            selectedObjectIds={selectedObjectIds}
            selectObject={selectObject}
            openNameDialog={openNameDialog}

            // openChildDialog={(child) => {
            //   setNameDialogState({
            //     isNameDialogOpen: true,
            //     currentName: child.name || "",
            //     objectId: child.id,
            //   });
            // }}
          />
        ) : (
          <ListItem
            key={obj.id}
            component="li"
            onClick={(e) => selectObject(obj.id, e.ctrlKey || e.metaKey)}
            onDoubleClick={() => openNameDialog(obj)}
            sx={{
              cursor: "pointer",
              backgroundColor: selectedObjectIds.includes(obj.id)
                ? "#f0f0f0"
                : "white",
              "&:hover": { backgroundColor: "lightblue" },
            }}
          >
            <ListItemText
              primary={obj.name || getObjectTypeLabel(obj.type)}
              sx={{ marginLeft: "10px" }}
            />
          </ListItem>
        )
      )}
    </List>
  );
};

export default SidebarObjectList;
