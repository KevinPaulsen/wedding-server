// components/admin/adminRsvpTable/EnhancedTableToolbar.tsx
import React from "react";
import {CircularProgress, IconButton, Toolbar, Tooltip, Typography} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

interface EnhancedTableToolbarProps {
    numSelected: number;
    onDelete: () => void;
    onAddRsvp: () => void;
    loading: boolean;
}

export const EnhancedTableToolbar: React.FC<EnhancedTableToolbarProps> = ({
                                                                              numSelected,
                                                                              onDelete,
                                                                              onAddRsvp,
                                                                              loading,
                                                                          }) => {
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
            {loading ? <CircularProgress size={24}/> : (
                numSelected > 0 ? (
                    <Tooltip title="Delete">
                        <IconButton onClick={onDelete}>
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>
                ) : (
                    <Tooltip title="Add RSVP">
                        <IconButton onClick={onAddRsvp}>
                            <AddCircleOutlineIcon/>
                        </IconButton>
                    </Tooltip>
                )
            )}
        </Toolbar>
    );
};