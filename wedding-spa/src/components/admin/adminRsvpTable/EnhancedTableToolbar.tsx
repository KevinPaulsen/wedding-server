import React from "react";
import {
  CircularProgress,
  IconButton,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { useAdminData } from "../../../context/AdminDataContext";

interface EnhancedTableToolbarProps {
  numSelected: number;
  onDelete: () => void;
  onAddRsvp: () => void;
  onBatchAdd: () => void;
}

export const EnhancedTableToolbar: React.FC<EnhancedTableToolbarProps> = ({
                                                                            numSelected,
                                                                            onDelete,
                                                                            onAddRsvp,
                                                                            onBatchAdd,
                                                                          }) => {
  // Get individual loading states from the centralized AdminData context.
  const { deleteLoading, createLoading, createAllLoading } = useAdminData();
  // Determine which loading state is relevant based on the current action.
  const loading =
      numSelected > 0 ? deleteLoading : (createLoading || createAllLoading);

  return (
      <Toolbar
          sx={{
            pl: { sm: 2 },
            pr: { xs: 1, sm: 1 },
            ...(numSelected > 0 && {
              bgcolor: (theme) =>
                  theme.palette.action.activatedOpacity
                      ? theme.palette.action.activatedOpacity
                      : theme.palette.primary.main,
            }),
          }}
      >
        {numSelected > 0 ? (
            <Typography
                sx={{ flex: "1 1 100%" }}
                color="inherit"
                variant="subtitle1"
                component="div"
            >
              {numSelected} selected
            </Typography>
        ) : (
            <Typography
                sx={{ flex: "1 1 100%" }}
                variant="h6"
                id="tableTitle"
                component="div"
            >
              RSVPs
            </Typography>
        )}

        {loading ? (
            <CircularProgress size={24} />
        ) : numSelected > 0 ? (
            <Tooltip title="Delete">
              <IconButton onClick={onDelete}>
                <DeleteIcon />
              </IconButton>
            </Tooltip>
        ) : (
            // Show a SpeedDial with options for adding a single RSVP or batch adding
            <SpeedDial
                ariaLabel="Add RSVP or Batch Add"
                icon={<SpeedDialIcon />}
                direction="left"
                FabProps={{
                  size: "small",
                  color: "primary",
                }}
            >
              <SpeedDialAction
                  key="single-add"
                  icon={<AddCircleOutlineIcon />}
                  slotProps={{
                    tooltip: "Add Single RSVP",
                  }}
                  onClick={onAddRsvp}
              />
              <SpeedDialAction
                  key="batch-add"
                  icon={<UploadFileIcon />}
                  slotProps={{
                    tooltip: "Batch Add RSVPs",
                  }}
                  onClick={onBatchAdd}
              />
            </SpeedDial>
        )}
      </Toolbar>
  );
};
