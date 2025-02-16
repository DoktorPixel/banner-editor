import { Box, Typography } from "@mui/material";
import { BannerChild } from "../../../types";

interface GroupChildObjectFormProps {
  object: BannerChild;
  onChange: (key: keyof BannerChild, value: string | number) => void;
}

export const GroupChildObjectForm: React.FC<GroupChildObjectFormProps> = ({
  object,
  //   onChange,
}) => {
  return (
    <Box className="child-object-form">
      <Typography variant="h6">Редагування групи</Typography>
      <Typography variant="body1">
        Група містить {object.children?.length || 0} елементів.
      </Typography>
    </Box>
  );
};
