import { List, ListItem, ListItemText } from "@mui/material";
import GroupListItem from "./GroupListItem";
import { BannerObject } from "../../types";

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
    <List>
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
                ? "lightgray"
                : "white",
              "&:hover": { backgroundColor: "lightblue" },
            }}
          >
            <ListItemText
              primary={
                obj.name
                  ? obj.name?.slice(0, 30)
                  : obj.type === "text"
                  ? obj.content?.slice(0, 30) || "Текст"
                  : obj.type === "figure"
                  ? "Фігура"
                  : "Зображення"
              }
            />
          </ListItem>
        )
      )}
    </List>
  );
};

export default SidebarObjectList;
