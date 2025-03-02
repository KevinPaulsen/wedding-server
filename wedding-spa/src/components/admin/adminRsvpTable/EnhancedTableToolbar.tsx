import React from "react";
import {CircularProgress, IconButton, Toolbar, Tooltip, Typography} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterListIcon from "@mui/icons-material/FilterList";

interface EnhancedTableToolbarProps {
    numSelected: number;
    onDelete: () => void;
    loading: boolean;
}

export const EnhancedTableToolbar: React.FC<EnhancedTableToolbarProps> = ({
                                                                       numSelected,
                                                                       onDelete,
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
            {numSelected > 0 ? (
                loading ? (
                    <CircularProgress size={24} />
                ) : (
                    <Tooltip title="Delete">
                        <IconButton onClick={onDelete}>
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>
                )
            ) : (
                <Tooltip title="Filter list">
                    <IconButton>
                        <FilterListIcon />
                    </IconButton>
                </Tooltip>
            )}
        </Toolbar>
    );
};