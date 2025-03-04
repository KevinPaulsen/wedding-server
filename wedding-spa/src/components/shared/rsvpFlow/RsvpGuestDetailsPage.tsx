// components/shared/rsvpFlow/RsvpGuestDetailsPage.tsx
import React, {ForwardedRef, forwardRef, useRef, useState} from 'react';
import {
    Autocomplete,
    Box,
    Checkbox,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField, Theme,
    Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { useFlow } from '../../../context/FlowProvider';
import { Rsvp, RsvpGuestDetailWithId } from '../../../types/rsvp';
import CustomButton from '../CustomButton';
import CustomInputField, {CustomInputFieldRef} from "../CustomInputField";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

interface RsvpGuestDetailsPageProps {
    nextPage: (rsvp: Rsvp) => void;
    previousPage: (rsvp: Rsvp) => void;
    requireAnswers: boolean;
    returnPage?: string | null;
}

const dietaryOptions = [
    'Vegetarian',
    'Vegan',
    'Gluten Free',
    'Nut Free',
    'Shellfish Free',
    'Other',
];

const GuestRow: React.FC<{
    guest: RsvpGuestDetailWithId;
    theme: Theme;
    onToggleComing: (id: string, newValue: boolean) => void;
    onEdit: (id: string) => void;
    hasAnyOther: boolean;
}> = ({ guest, theme, onToggleComing, onEdit, hasAnyOther }) => (
    <TableRow
        sx={{
            backgroundColor: guest.coming
                ? 'inherit'
                : theme.palette.action.disabledBackground,
        }}
    >
        <TableCell
            sx={{
                fontWeight: 'bold',
                whiteSpace: { xs: 'normal', sm: 'nowrap' },
                wordBreak: 'break-word',
                color: guest.coming ? 'inherit' : theme.palette.text.disabled,
            }}
        >
            {guest.display_name}
        </TableCell>
        <TableCell
            sx={{
                whiteSpace: { xs: 'normal', sm: 'nowrap' },
                wordBreak: 'break-word',
                color: guest.coming ? 'inherit' : theme.palette.text.disabled,
            }}
        >
            {guest.dietary_restrictions.length > 0 || guest.other.trim() !== '' ? (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {guest.dietary_restrictions.map((r, idx) => (
                        <Chip key={idx} label={r} size="small" />
                    ))}
                    {hasAnyOther && guest.other.trim() !== '' && (
                        <Chip key="other" label={guest.other} size="small" />
                    )}
                </Box>
            ) : (
                'None'
            )}
        </TableCell>
        <TableCell onClick={(e) => e.stopPropagation()} sx={{ width: { xs: 'auto', md: '1%' } }}>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 0,
                }}
            >
                {/* Coming Icon (Check) */}
                <IconButton
                    onClick={() => onToggleComing(guest.id, true)}
                    sx={{
                        backgroundColor: guest.coming ? theme.palette.primary.main : 'transparent',
                        color: guest.coming ? theme.palette.primary.contrastText : theme.palette.primary.main,
                        '&:hover': {
                            backgroundColor: guest.coming ? theme.palette.primary.dark : 'rgba(0,0,0,0.1)',
                        },
                    }}
                >
                    <CheckIcon />
                </IconButton>

                {/* Not Coming Icon (Close) */}
                <IconButton
                    onClick={() => onToggleComing(guest.id, false)}
                    sx={{
                        backgroundColor: !guest.coming ? theme.palette.primary.main : 'transparent',
                        color: !guest.coming ? theme.palette.primary.contrastText : theme.palette.primary.main,
                        '&:hover': {
                            backgroundColor: !guest.coming ? theme.palette.primary.dark : 'rgba(0,0,0,0.1)',
                        },
                    }}
                >
                    <CloseIcon />
                </IconButton>

                {/* Edit Button - Dimmed & Disabled if not coming */}
                <IconButton
                    aria-label="Edit Guest"
                    onClick={() => onEdit(guest.id)}
                    disabled={!guest.coming}
                    sx={{
                        opacity: guest.coming ? 1 : 0.5,
                    }}
                >
                    <EditIcon />
                </IconButton>
            </Box>
        </TableCell>
    </TableRow>
);

//
// Reusable component: the guest table
//
const GuestTable: React.FC<{
    guests: RsvpGuestDetailWithId[];
    theme: Theme;
    onToggleComing: (id: string, newValue: boolean) => void;
    onEdit: (id: string) => void;
    hasAnyOther: boolean;
}> = ({ guests, theme, onToggleComing, onEdit, hasAnyOther }) => (
    <TableContainer component={Paper} sx={{ backgroundColor: theme.palette.secondary.light }}>
        <Table sx={{ width: '100%', tableLayout: 'auto' }}>
            <TableHead sx={{ backgroundColor: theme.palette.primary.main }}>
                <TableRow>
                    <TableCell
                        sx={{
                            color: theme.palette.primary.contrastText,
                            fontWeight: 'bold',
                            whiteSpace: { xs: 'normal', sm: 'nowrap' },
                        }}
                    >
                        Display Name
                    </TableCell>
                    <TableCell
                        sx={{
                            color: theme.palette.primary.contrastText,
                            fontWeight: 'bold',
                            whiteSpace: { xs: 'normal', sm: 'nowrap' },
                        }}
                    >
                        Dietary Restrictions
                    </TableCell>
                    <TableCell
                        sx={{
                            color: theme.palette.primary.contrastText,
                            fontWeight: 'bold',
                            whiteSpace: 'nowrap',
                            width: { xs: 'auto', md: '1%' },
                        }}
                    >
                        Coming?
                    </TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {guests.map((guest) => (
                    <GuestRow
                        key={guest.id}
                        guest={guest}
                        theme={theme}
                        onToggleComing={onToggleComing}
                        onEdit={onEdit}
                        hasAnyOther={hasAnyOther}
                    />
                ))}
            </TableBody>
        </Table>
    </TableContainer>
);

interface EditGuestDialogProps {
    open: boolean;
    editingGuest: any; // Replace 'any' with your proper type if needed
    setEditingGuest: React.Dispatch<React.SetStateAction<any>>;
    onSave: () => void;
    onClose: () => void;
    theme: Theme;
}

const EditGuestDialog = forwardRef<CustomInputFieldRef, EditGuestDialogProps>(
    ({ open, editingGuest, setEditingGuest, onSave, onClose, theme }, ref) => (
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
            <DialogTitle>Edit Guest</DialogTitle>
            <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {editingGuest && (
                    <>
                        <CustomInputField
                            ref={ref}
                            value={editingGuest.display_name}
                            onChange={(e) =>
                                setEditingGuest((prev: any) =>
                                    prev ? { ...prev, display_name: e.target.value } : null
                                )
                            }
                            label="Perferred Name"
                            placeholder="Preferred Name"
                            name="display_name"
                            required={true}
                            width="100%"
                            padding={{ pt: 1, pb: 0 }}
                        />
                        <Autocomplete
                            multiple
                            disableCloseOnSelect
                            options={['Vegetarian', 'Vegan', 'Gluten Free', 'Nut Free', 'Shellfish Free', 'Other']}
                            value={editingGuest.dietary_restrictions || []}
                            onChange={(_event, newValue) =>
                                setEditingGuest((prev: any) =>
                                    prev ? { ...prev, dietary_restrictions: newValue } : null
                                )
                            }
                            renderOption={(props, option, { selected }) => {
                                const { key, ...optionProps } = props;
                                return (
                                    <li key={key} {...optionProps}>
                                        <Checkbox
                                            checked={selected}
                                        />
                                        {option}
                                    </li>
                                );
                            }}
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
                                        editingGuest?.dietary_restrictions.length > 0
                                            ? ''
                                            : 'Select dietary restrictions...'
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
                        {editingGuest.dietary_restrictions.includes('Other') && (
                            <CustomInputField
                                value={editingGuest.other}
                                onChange={(e) =>
                                    setEditingGuest((prev: any) =>
                                        prev ? { ...prev, other: e.target.value } : null
                                    )
                                }
                                label="Other"
                                placeholder="Other"
                                name="other"
                                required={false}
                                width="100%"
                            />
                        )}
                    </>
                )}
            </DialogContent>
            <DialogActions>
                <CustomButton text="Cancel" onClick={onClose} variant="lightOutlined" width="75px" marginRight={1} />
                <CustomButton text="Save" onClick={onSave} variant="dark" width="75px" />
            </DialogActions>
        </Dialog>
    )
);

//
// Reusable component: action buttons for navigation
//
const ActionButtons: React.FC<{ onBack: () => void; onNext: () => void }> = ({ onBack, onNext }) => (
    <Box display="flex" justifyContent="space-evenly" mt={4}>
        <CustomButton text="Back" onClick={onBack} variant="dark" width="75px" />
        <CustomButton text="Next" onClick={onNext} variant="dark" width="75px" />
    </Box>
);

//
// Main Component
//
const RsvpGuestDetailsPage: React.FC<RsvpGuestDetailsPageProps> = ({ nextPage, previousPage }) => {
    const theme: Theme = useTheme();
    const { formData, setFormData } = useFlow();
    const primaryContactRef = useRef<CustomInputFieldRef>(null);

    // Convert guest_list (object) to an array of guests
    const initialGuests: RsvpGuestDetailWithId[] = Object.entries(formData.guest_list || {}).map(
        ([id, details]) => ({
            id,
            ...details,
        })
    );

    const [guests, setGuests] = useState<RsvpGuestDetailWithId[]>(initialGuests);
    const [openModal, setOpenModal] = useState(false);
    const [editingGuest, setEditingGuest] = useState<RsvpGuestDetailWithId | null>(null);

    const hasAnyOther = guests.some((g) => g.other && g.other.trim() !== '');

    const updateGuestInFormData = (guestId: string, partial: Partial<RsvpGuestDetailWithId>) => {
        setFormData({
            ...formData,
            guest_list: {
                ...formData.guest_list,
                [guestId]: {
                    ...formData.guest_list[guestId],
                    ...partial,
                },
            },
        });
    };

    const handleToggleComing = (guestId: string, newValue: boolean) => {
        setGuests((prev) =>
            prev.map((g) => (g.id === guestId ? { ...g, coming: newValue } : g))
        );
        updateGuestInFormData(guestId, { coming: newValue });
    };

    const handleEdit = (guestId: string) => {
        const guestToEdit = guests.find((g) => g.id === guestId);
        if (guestToEdit) {
            setEditingGuest({ ...guestToEdit });
            setOpenModal(true);
        }
    };

    const handleModalSave = () => {
        if (!editingGuest) return;
        if (!primaryContactRef.current?.validate()) return;

        setGuests((prev) =>
            prev.map((g) => (g.id === editingGuest.id ? editingGuest : g))
        );
        updateGuestInFormData(editingGuest.id, {
            display_name: editingGuest.display_name,
            dietary_restrictions: editingGuest.dietary_restrictions,
            other: editingGuest.other,
            coming: editingGuest.coming,
        });
        setOpenModal(false);
        setEditingGuest(null);
    };

    const handleModalClose = () => {
        setOpenModal(false);
        setEditingGuest(null);
    };

    const handleBack = () => {
        previousPage(formData);
    };

    const handleNext = () => {
        nextPage(formData);
    };

    return (
        <Box sx={{ maxWidth: 900, mx: 'auto', color: theme.palette.primary.main, p: theme.spacing(1) }}>
            {guests.length === 0 ? (
                <Typography>No guests found.</Typography>
            ) : (
                <GuestTable
                    guests={guests}
                    theme={theme}
                    onToggleComing={handleToggleComing}
                    onEdit={handleEdit}
                    hasAnyOther={hasAnyOther}
                />
            )}
            <EditGuestDialog
                ref={primaryContactRef}
                open={openModal}
                editingGuest={editingGuest}
                setEditingGuest={setEditingGuest}
                onSave={handleModalSave}
                onClose={handleModalClose}
                theme={theme}
            />
            <ActionButtons onBack={handleBack} onNext={handleNext} />
        </Box>
    );
};

export default RsvpGuestDetailsPage;
