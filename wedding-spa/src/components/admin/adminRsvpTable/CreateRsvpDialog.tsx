// components/admin/adminRsvpTable/CreateRsvpDialog.tsx
import * as React from 'react';
import {
    Alert,
    Box,
    Checkbox,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControlLabel,
    TextField,
    Typography,
    useTheme,
} from "@mui/material";
import CustomButton from "../../shared/CustomButton";
import { CreateRsvpDTO } from "../../../types/RsvpDTO";

interface CreateRsvpDialogProps {
    open: boolean;
    rsvp: CreateRsvpDTO | null;
    onClose: () => void;
    onSubmit: (updatedRsvpDTO: CreateRsvpDTO) => Promise<boolean>;
    loading?: boolean;
    error: string | null;
}

const CreateRsvpDialog: React.FC<CreateRsvpDialogProps> = ({
                                                               open,
                                                               rsvp,
                                                               onClose,
                                                               onSubmit,
                                                               loading,
                                                               error,
                                                           }) => {
    const theme = useTheme();

    const [formData, setFormData] = React.useState<CreateRsvpDTO>(
        rsvp || {
            primary_name: '',
            allowed_guests: [],
            roce_invitation: false,
            rehearsal_invitation: false,
            ceremony_invitation: false,
            reception_invitation: false,
        }
    );

    // Local state to handle the guest input field.
    const [guestInput, setGuestInput] = React.useState("");
    // State for primary name error validation.
    const [primaryNameError, setPrimaryNameError] = React.useState(false);

    // When the rsvp prop changes, update local state.
    React.useEffect(() => {
        if (rsvp) {
            setFormData(rsvp);
        }
    }, [rsvp]);

    // Update the primary name. Also, ensure the allowed_guests list always
    // contains the primary name as its first element.
    const handlePrimaryNameChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const newPrimary = event.target.value;
        // Clear the error if the user has entered a value.
        if (newPrimary.trim() !== "") {
            setPrimaryNameError(false);
        }
        setFormData((prev) => {
            // Remove any previous primary value from allowed_guests.
            let updatedGuests = prev.allowed_guests.filter(
                (guest) => guest !== prev.primary_name
            );
            // If there is a new primary name, add it at the beginning.
            if (newPrimary.trim() !== "") {
                updatedGuests = [newPrimary, ...updatedGuests];
            }
            return { ...prev, primary_name: newPrimary, allowed_guests: updatedGuests };
        });
    };

    // Handle changes to the guest input field.
    const handleGuestInputChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setGuestInput(event.target.value);
    };

    // When the user presses Enter or Tab in the guest input, add the guest as a chip.
    const handleGuestInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter' || event.key === 'Tab') {
            event.preventDefault();
            const guest = guestInput.trim();
            if (guest !== "" && !formData.allowed_guests.includes(guest)) {
                setFormData((prev) => ({
                    ...prev,
                    allowed_guests: [...prev.allowed_guests, guest],
                }));
            }
            setGuestInput("");
        }
    };

    // Remove a guest chip, unless it is the primary name.
    const handleDeleteGuest = (guest: string) => {
        if (guest === formData.primary_name) return;
        setFormData((prev) => ({
            ...prev,
            allowed_guests: prev.allowed_guests.filter((g) => g !== guest),
        }));
    };

    // Toggle event invitation checkboxes.
    const handleCheckboxChange = (
        event: React.ChangeEvent<HTMLInputElement>,
        field: keyof Omit<CreateRsvpDTO, "primary_name" | "allowed_guests">
    ) => {
        setFormData((prev) => ({
            ...prev,
            [field]: event.target.checked,
        }));
    };

    // Handle the form submission.
    const handleSave = async () => {
        if (!formData.primary_name.trim()) {
            setPrimaryNameError(true);
            return;
        }
        const success = await onSubmit(formData);
        if (success) {
            onClose();
        }
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
                {error && <Alert severity="error">{error}</Alert>}
                <Typography variant="h6" textAlign="center" marginBottom={1}>
                    Primary Contact Information
                </Typography>
                <TextField
                    label="Primary Name"
                    value={formData.primary_name}
                    onChange={handlePrimaryNameChange}
                    required
                    fullWidth
                    error={primaryNameError}
                    helperText={primaryNameError ? "Primary name is required." : ""}
                />
                <Typography variant="h6" textAlign="center" sx={{ mt: 2 }}>
                    Guest List
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {formData.allowed_guests.map((guest, index) => (
                        <Chip
                            key={index}
                            label={guest}
                            onDelete={
                                guest === formData.primary_name ? undefined : () => handleDeleteGuest(guest)
                            }
                        />
                    ))}
                </Box>
                <TextField
                    label="Add Guest"
                    value={guestInput}
                    onChange={handleGuestInputChange}
                    onKeyDown={handleGuestInputKeyDown}
                    placeholder="Type a name and press Enter or Tab"
                    fullWidth
                />
                <Typography variant="h6" textAlign="center" sx={{ mt: 2 }}>
                    Event Invitations
                </Typography>
                <Box sx={{ display: "flex", justifyContent: "space-around" }}>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={formData.roce_invitation}
                                onChange={(e) => handleCheckboxChange(e, "roce_invitation")}
                            />
                        }
                        label="Roce"
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={formData.rehearsal_invitation}
                                onChange={(e) => handleCheckboxChange(e, "rehearsal_invitation")}
                            />
                        }
                        label="Rehearsal"
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={formData.ceremony_invitation}
                                onChange={(e) => handleCheckboxChange(e, "ceremony_invitation")}
                            />
                        }
                        label="Ceremony"
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={formData.reception_invitation}
                                onChange={(e) => handleCheckboxChange(e, "reception_invitation")}
                            />
                        }
                        label="Reception"
                    />
                </Box>
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
                    onClick={handleSave}
                    variant="dark"
                    width="75px"
                    disabled={loading}
                />
            </DialogActions>
        </Dialog>
    );
};

export default CreateRsvpDialog;
