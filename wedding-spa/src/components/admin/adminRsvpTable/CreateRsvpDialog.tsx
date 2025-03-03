import * as React from 'react';
import {Dialog, DialogActions, DialogContent, DialogTitle, useTheme,} from "@mui/material";
import {Rsvp} from "../../../types/rsvp";
import CustomButton from "../../shared/CustomButton";
import {ApiResponse} from "../../../services/ApiService";
import {CreateRsvpDTO} from "../../../types/RsvpDTO";

interface CreateRsvpDialogProps {
    open: boolean;
    rsvp: CreateRsvpDTO | null;
    onClose: () => void;
    onSave: (updatedRsvp: Rsvp) => Promise<ApiResponse<Rsvp>>;
    loading?: boolean;
    error: string | null;
}

const CreateRsvpDialog: React.FC<CreateRsvpDialogProps> = ({
                                                           open,
                                                           rsvp,
                                                           onClose,
                                                           onSave,
                                                           loading,
                                                           error,
                                                       }) => {
    const theme = useTheme();
    const [formData, setFormData] = React.useState<CreateRsvpDTO | null>(null);

    const handleChange = (
        field: keyof CreateRsvpDTO,
        value: string
    ) => {
        if (!formData) return;
        setFormData({
            ...formData,
            [field]: value
        });
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="sm"
            slotProps={{
                paper: {
                    sx: {
                        backgroundColor: theme.palette.primary.contrastText,
                        color: theme.palette.primary.main,
                    },
                },
            }}
        >
            <DialogTitle>Create RSVP</DialogTitle>
            <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            </DialogContent>
            <DialogActions>
                <CustomButton
                    text="Cancel"
                    onClick={onClose}
                    variant="lightOutlined"
                    width="75px"
                    marginRight={1}
                />
                <CustomButton
                    text={loading ? "Saving..." : "Save"}
                    onClick={onClose}
                    variant="dark"
                    width="75px"
                    disabled={loading}
                />
            </DialogActions>
        </Dialog>
    );
};

export default CreateRsvpDialog;
