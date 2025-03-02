import * as React from 'react';
import {
    Alert,
    Autocomplete,
    Box,
    Checkbox,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Switch,
    TextField,
    Typography,
    useTheme,
    IconButton,
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import {Rsvp} from "../../../types/rsvp";
import CustomInputField from "../../shared/CustomInputField";
import CustomButton from "../../shared/CustomButton";

const dietaryOptions = [
    "Vegetarian",
    "Vegan",
    "Gluten Free",
    "Nut Free",
    "Shellfish Free",
    "Other",
];

interface EditRsvpDialogProps {
    open: boolean;
    rsvp: Rsvp | null;
    onClose: () => void;
    onSave: (updatedRsvp: Rsvp) => Promise<void>;
    loading?: boolean;
    error: string | null;
}

const EditRsvpDialog: React.FC<EditRsvpDialogProps> = ({ open, rsvp, onClose, onSave, loading, error }) => {
    const theme = useTheme();
    const [formData, setFormData] = React.useState<Rsvp | null>(null);

    // Clone the RSVP into local state whenever it changes.
    React.useEffect(() => {
        if (rsvp) {
            setFormData(JSON.parse(JSON.stringify(rsvp)));
        }
    }, [rsvp]);

    // Update primary contact fields.
    const handlePrimaryChange = (field: keyof Rsvp["primary_contact"], value: string) => {
        if (!formData) return;
        setFormData({
            ...formData,
            primary_contact: {
                ...formData.primary_contact,
                [field]: value,
            },
        });
    };

    // Update guest fields (display name, other).
    const handleGuestChange = (
        guestKey: string,
        field: "display_name" | "other",
        value: string
    ) => {
        if (!formData) return;
        setFormData({
            ...formData,
            guest_list: {
                ...formData.guest_list,
                [guestKey]: {
                    ...formData.guest_list[guestKey],
                    [field]: value,
                },
            },
        });
    };

    // Delete a guest from guest_list.
    const handleDeleteGuest = (guestKey: string) => {
        if (!formData) return;
        const updatedGuestList = { ...formData.guest_list };
        delete updatedGuestList[guestKey];
        setFormData({
            ...formData,
            guest_list: updatedGuestList,
        });
    };

    // Toggle the guest's "coming" status.
    const handleGuestComingToggle = (guestKey: string, checked: boolean) => {
        if (!formData) return;
        setFormData({
            ...formData,
            guest_list: {
                ...formData.guest_list,
                [guestKey]: {
                    ...formData.guest_list[guestKey],
                    coming: checked,
                },
            },
        });
    };

    // For event attendance, update the corresponding array.
    const handleGuestEventToggle = (
        guestKey: string,
        eventName: "roce" | "rehearsal" | "ceremony" | "reception",
        checked: boolean
    ) => {
        if (!formData) return;
        const eventData = formData[eventName];
        let updatedAttending = [...eventData.guests_attending];
        if (checked) {
            if (!updatedAttending.includes(guestKey)) {
                updatedAttending.push(guestKey);
            }
        } else {
            updatedAttending = updatedAttending.filter((key) => key !== guestKey);
        }
        setFormData({
            ...formData,
            [eventName]: {
                ...eventData,
                guests_attending: updatedAttending,
            },
        });
    };

    // Update dietary restrictions via Autocomplete.
    const handleGuestDietaryChange = (guestKey: string, newValues: string[]) => {
        if (!formData) return;
        setFormData({
            ...formData,
            guest_list: {
                ...formData.guest_list,
                [guestKey]: {
                    ...formData.guest_list[guestKey],
                    dietary_restrictions: newValues,
                },
            },
        });
    };

    // Add a new blank guest.
    const handleAddGuest = () => {
        if (!formData) return;
        const newGuestKey = `guest_${Date.now()}`;
        const newGuest = {
            display_name: "",
            coming: false,
            dietary_restrictions: [] as string[],
            other: "",
        };
        setFormData({
            ...formData,
            guest_list: {
                ...formData.guest_list,
                [newGuestKey]: newGuest,
            },
        });
    };

    // Toggle the submitted field.
    const handleSubmittedToggle = (checked: boolean) => {
        if (!formData) return;
        setFormData({
            ...formData,
            submitted: checked,
        });
    };

    const handleSave = async () => {
        if (!formData) return;
        await onSave(formData);
        onClose();
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
            <DialogTitle>Edit RSVP</DialogTitle>
            <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {error && <Alert severity="error">{error}</Alert>}
                {formData && (
                    <>
                        <Typography variant="h6" marginBottom={1}>
                            Primary Contact Information
                        </Typography>
                        <CustomInputField
                            value={formData.primary_contact.name}
                            onChange={(e) => handlePrimaryChange("name", e.target.value)}
                            label="Preferred Name"
                            placeholder="Preferred Name"
                            name="name"
                            required
                            width="100%"
                        />
                        <CustomInputField
                            value={formData.primary_contact.email}
                            onChange={(e) => handlePrimaryChange("email", e.target.value)}
                            label="Email"
                            placeholder="Email"
                            name="email"
                            required
                            width="100%"
                        />
                        <CustomInputField
                            value={formData.primary_contact.address}
                            onChange={(e) => handlePrimaryChange("address", e.target.value)}
                            label="Address"
                            placeholder="Address"
                            name="address"
                            required
                            width="100%"
                        />
                        <CustomInputField
                            value={formData.primary_contact.phone_number}
                            onChange={(e) => handlePrimaryChange("phone_number", e.target.value)}
                            label="Phone Number"
                            placeholder="Phone Number"
                            name="phone_number"
                            required
                            width="100%"
                        />

                        <Typography variant="h6">Guest List</Typography>
                        {Object.entries(formData.guest_list).map(([guestKey, guest]) => (
                            <Box
                                key={guestKey}
                                sx={{
                                    position: "relative",
                                    backgroundColor: theme.palette.secondary.light,
                                    borderRadius: 3,
                                    p: 1,
                                    mb: 1,
                                }}
                            >
                                {/* X button to remove guest */}
                                <IconButton
                                    size="small"
                                    onClick={() => handleDeleteGuest(guestKey)}
                                    sx={{ position: "absolute", top: 4, right: 4 }}
                                >
                                    <CloseIcon fontSize="small" />
                                </IconButton>
                                <Typography variant="subtitle1" sx={{ fontWeight: "bold", pb: 1 }}>
                                    Guest: {guestKey}
                                </Typography>
                                <CustomInputField
                                    value={guest.display_name}
                                    onChange={(e) => handleGuestChange(guestKey, "display_name", e.target.value)}
                                    label="Display Name"
                                    placeholder="Display Name"
                                    name="display_name"
                                    required
                                    width="100%"
                                />
                                <Box sx={{ display: "flex", flexWrap: "nowrap", gap: 1, my: 1, justifyContent: "center", alignItems: "center" }}>
                                    <Box sx={{ display: "flex", alignItems: "center" }}>
                                        <Checkbox
                                            checked={guest.coming}
                                            onChange={(e) => handleGuestComingToggle(guestKey, e.target.checked)}
                                        />
                                        <Typography variant="body2">Coming</Typography>
                                    </Box>
                                    {(["roce", "rehearsal", "ceremony", "reception"] as const).map((eventName) => {
                                        if (formData[eventName].allowed_guests === 0) return null;
                                        return (
                                            <Box key={eventName} sx={{ display: "flex", alignItems: "center" }}>
                                                <Checkbox
                                                    checked={formData[eventName].guests_attending.includes(guestKey)}
                                                    onChange={(e) =>
                                                        handleGuestEventToggle(guestKey, eventName, e.target.checked)
                                                    }
                                                />
                                                <Typography variant="body2">
                                                    {eventName.charAt(0).toUpperCase() + eventName.slice(1)}
                                                </Typography>
                                            </Box>
                                        );
                                    })}
                                </Box>
                                <Autocomplete
                                    multiple
                                    disableCloseOnSelect
                                    options={dietaryOptions}
                                    value={guest.dietary_restrictions || []}
                                    onChange={(_event, newValue) => handleGuestDietaryChange(guestKey, newValue)}
                                    renderOption={(props, option, { selected }) => (
                                        <li {...props}>
                                            <Checkbox
                                                icon={<span />}
                                                checkedIcon={<span />}
                                                style={{ marginRight: 8 }}
                                                checked={selected}
                                            />
                                            {option}
                                        </li>
                                    )}
                                    renderTags={(value: string[], getTagProps) =>
                                        value.map((option: string, index: number) => (
                                            <Chip label={option} size="small" {...getTagProps({ index })} />
                                        ))
                                    }
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            margin="dense"
                                            size="small"
                                            sx={{ m: 0 }}
                                            label="Dietary Restrictions"
                                            placeholder={
                                                guest.dietary_restrictions.length > 0
                                                    ? ""
                                                    : "Select dietary restrictions..."
                                            }
                                            slotProps={{
                                                htmlInput: {
                                                    ...params.inputProps,
                                                    readOnly: true,
                                                },
                                            }}
                                        />
                                    )}
                                />
                                {guest.dietary_restrictions.includes("Other") && (
                                    <CustomInputField
                                        value={guest.other}
                                        onChange={(e) => handleGuestChange(guestKey, "other", e.target.value)}
                                        label="Other Restrictions"
                                        placeholder="Other Restrictions"
                                        name="other"
                                        required={false}
                                        width="100%"
                                        padding={{ pt: 2 }}
                                    />
                                )}
                            </Box>
                        ))}
                        <Box sx={{ display: "flex", flexWrap: "nowrap", justifyContent: "center", alignItems: "center" }}>
                            <Typography>Submitted:</Typography>
                            <Switch
                                checked={formData.submitted}
                                onChange={(e) => handleSubmittedToggle(e.target.checked)}
                            />
                        </Box>
                    </>
                )}
            </DialogContent>
            <DialogActions>
                <CustomButton text="Add Guest" onClick={handleAddGuest} variant="dark" width="auto" />
                <div style={{ flex: '1 0 0' }} />
                <CustomButton text="Cancel" onClick={onClose} variant="lightOutlined" width="75px" marginRight={1} />
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

export default EditRsvpDialog;
