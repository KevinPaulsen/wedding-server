import React, { useState } from 'react';
import {
    Autocomplete,
    Box,
    Button,
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
    TextField,
    Typography,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { useFlow } from '../../../context/FlowProvider';
import { Rsvp, RsvpGuestDetailWithId } from '../../../types/rsvp';
import CustomButton from '../CustomButton';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

interface RsvpGuestDetailsPageProps {
    nextPage: (rsvp: Rsvp) => void;
    previousPage: (rsvp: Rsvp) => void;
    requireAnswers: boolean;
    returnPage?: string | null;
}

const RsvpGuestDetailsPage: React.FC<RsvpGuestDetailsPageProps> = ({
                                                                       nextPage,
                                                                       previousPage,
                                                                   }) => {
    const { formData, setFormData } = useFlow();

    // Convert guest_list into an array of RsvpGuestDetailWithId
    const initialGuests: RsvpGuestDetailWithId[] = Object.entries(formData.guest_list || {}).map(
        ([id, details]) => ({
            id,
            ...details
        })
    );

    // Local array of guests (with their data from formData)
    const [guests, setGuests] = useState<RsvpGuestDetailWithId[]>(initialGuests);

    // Check if any row has a non-empty "other"
    const hasAnyOther = guests.some((g) => g.other && g.other.trim() !== '');

    // For the Edit Modal
    const [openModal, setOpenModal] = useState(false);
    const [editingGuest, setEditingGuest] = useState<RsvpGuestDetailWithId | null>(null);

    // Typical dietary options for the Autocomplete
    const dietaryOptions = [
        'Vegetarian',
        'Vegan',
        'Gluten Free',
        'Nut Free',
        'Shellfish Free',
        'Other'
    ];

    // Update global formData.guest_list for a single guest
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

    // Toggle 'coming' and update both local state and global formData
    const handleToggleComing = (guestId: string, newValue: boolean) => {
        setGuests((prev) =>
            prev.map((g) => (g.id === guestId ? { ...g, coming: newValue } : g))
        );

        // Update the data in the context
        updateGuestInFormData(guestId, { coming: newValue });
    };

    // When user clicks "Edit" button, set editingGuest + open modal
    const handleEdit = (guestId: string) => {
        const guestToEdit = guests.find((g) => g.id === guestId);
        if (guestToEdit) {
            setEditingGuest({ ...guestToEdit }); // Copy for editing
            setOpenModal(true);
        }
    };

    // Save changes from the modal
    const handleModalSave = () => {
        if (!editingGuest) return;

        // Update local state
        setGuests((prev) =>
            prev.map((g) => (g.id === editingGuest.id ? editingGuest : g))
        );

        // Update the data in the context
        updateGuestInFormData(editingGuest.id, {
            display_name: editingGuest.display_name,
            dietary_restrictions: editingGuest.dietary_restrictions,
            other: editingGuest.other,
            coming: editingGuest.coming, // This might not have changed in the modal, but in case you allow it there.
        });

        setOpenModal(false);
        setEditingGuest(null);
    };

    // Cancel modal (no changes)
    const handleModalClose = () => {
        setOpenModal(false);
        setEditingGuest(null);
    };

    // "Back"
    const handleBack = () => {
        previousPage(formData);
    };

    // "Next"
    const handleNext = () => {
        nextPage(formData);
    };

    return (
        <Box
            sx={{
                maxWidth: 900,
                mx: "auto",
                color: 'var(--main-dark)',
                p: 1,
            }}
        >
            {guests.length === 0 ? (
                <Typography>No guests found.</Typography>
            ) : (
                <TableContainer
                    component={Paper}
                    sx={{
                        backgroundColor: 'var(--hover-light)',
                    }}
                >
                    <Table sx={{ width: '100%', tableLayout: { xs: 'fixed', sm: 'auto' } }}>
                        <Table
                            sx={{
                                width: '100%',
                                tableLayout: 'auto', // Let columns size themselves
                            }}
                        >
                            <TableHead sx={{ backgroundColor: 'var(--main-dark)' }}>
                                <TableRow>
                                    <TableCell
                                        sx={{
                                            color: 'var(--main-light)',
                                            fontWeight: 'bold',
                                            whiteSpace: { xs: 'normal', sm: 'nowrap' },
                                        }}
                                    >
                                        Display Name
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            color: 'var(--main-light)',
                                            fontWeight: 'bold',
                                            whiteSpace: { xs: 'normal', sm: 'nowrap' },
                                        }}
                                    >
                                        Dietary Restrictions
                                    </TableCell>
                                    <TableCell
                                        // Only force a small width on larger screens;
                                        // let it expand on xs so it won't overflow.
                                        sx={{
                                            color: 'var(--main-light)',
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
                                    <TableRow
                                        key={guest.id}
                                        sx={{
                                            backgroundColor: guest.coming ? 'inherit' : 'var(--main-light)',
                                        }}
                                    >
                                        {/* Display Name */}
                                        <TableCell
                                            sx={{
                                                fontWeight: 'bold',
                                                whiteSpace: { xs: 'normal', sm: 'nowrap' },
                                                wordBreak: 'break-word',
                                            }}
                                        >
                                            {guest.display_name}
                                        </TableCell>
                                        {/* Dietary Restrictions */}
                                        <TableCell
                                            sx={{
                                                whiteSpace: { xs: 'normal', sm: 'nowrap' },
                                                wordBreak: 'break-word',
                                            }}
                                        >
                                            {guest.dietary_restrictions.length > 0 || guest.other.trim() !== '' ? (
                                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                    {guest.dietary_restrictions.map((r, idx) => (
                                                        <Chip key={idx} label={r} size="small" />
                                                    ))}
                                                    {hasAnyOther && guest.other.trim() !== '' && (
                                                        <Chip key={'other'} label={guest.other || ''} size="small" />
                                                    )}
                                                </Box>
                                            ) : (
                                                'None'
                                            )}
                                        </TableCell>
                                        {/* Coming? */}
                                        <TableCell
                                            onClick={(e) => e.stopPropagation()}
                                            // Same approach: shrink on larger screens, allow expansion on small
                                            sx={{
                                                width: { xs: 'auto', md: '1%' },
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    flexDirection: { xs: 'column', sm: 'row' },
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    gap: 0,
                                                }}
                                            >
                                                <IconButton
                                                    onClick={() => handleToggleComing(guest.id, true)}
                                                    sx={{
                                                        backgroundColor: guest.coming ? 'var(--main-dark)' : 'transparent',
                                                        color: guest.coming ? 'var(--main-light)' : 'inherit',
                                                        '&:hover': {
                                                            backgroundColor: guest.coming
                                                                ? 'var(--hover-dark)'
                                                                : 'rgba(0,0,0,0.1)',
                                                        },
                                                    }}
                                                >
                                                    <CheckIcon />
                                                </IconButton>
                                                <IconButton
                                                    onClick={() => handleToggleComing(guest.id, false)}
                                                    sx={{
                                                        backgroundColor: guest.coming ? 'transparent' : 'var(--main-dark)',
                                                        color: guest.coming ? 'inherit' : 'var(--main-light)',
                                                        '&:hover': {
                                                            backgroundColor: guest.coming
                                                                ? 'rgba(0,0,0,0.1)'
                                                                : 'var(--hover-dark)',
                                                        },
                                                    }}
                                                >
                                                    <CloseIcon />
                                                </IconButton>
                                                <IconButton
                                                    aria-label="Edit Guest"
                                                    onClick={() => handleEdit(guest.id)}
                                                >
                                                    <EditIcon />
                                                </IconButton>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Table>
                </TableContainer>
            )}

            {/* Modal for editing a single guest */}
            <Dialog
                open={openModal}
                onClose={handleModalClose}
                fullWidth
                maxWidth="sm"
                slotProps={{
                    paper: {
                        sx: {
                            backgroundColor: 'var(--main-light)',
                            color: 'var(--main-dark)',
                        },
                    }
                }}
            >
                <DialogTitle>Edit Guest</DialogTitle>
                <DialogContent
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 3,
                        pt: 2,
                    }}
                >
                    {editingGuest && (
                        <>
                            <TextField
                                margin="dense"
                                label="Display Name"
                                value={editingGuest.display_name}
                                onChange={(e) =>
                                    setEditingGuest((prev) =>
                                        prev ? { ...prev, display_name: e.target.value } : null
                                    )
                                }
                            />

                            {/* Autocomplete with chips for Dietary Restrictions */}
                            <Autocomplete
                                multiple
                                freeSolo
                                disableCloseOnSelect
                                options={dietaryOptions}
                                value={editingGuest.dietary_restrictions || []}
                                onChange={(_event, newValue) =>
                                    setEditingGuest((prev) =>
                                        prev
                                            ? { ...prev, dietary_restrictions: newValue }
                                            : null
                                    )
                                }
                                renderOption={(props, option, { selected }) => {
                                    const { key, ...optionProps } = props;
                                    return (
                                        <li key={key} {...optionProps}>
                                            <Checkbox
                                                icon={icon}
                                                checkedIcon={checkedIcon}
                                                style={{ marginRight: 8 }}
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
                                        label="Dietary Restrictions"
                                        placeholder="e.g. Vegan, Kosher"
                                    />
                                )}
                            />

                            <TextField
                                margin="dense"
                                label="Other"
                                value={editingGuest.other}
                                onChange={(e) =>
                                    setEditingGuest((prev) =>
                                        prev ? { ...prev, other: e.target.value } : null
                                    )
                                }
                            />
                        </>
                    )}
                </DialogContent>
                <DialogActions>
                    <CustomButton
                        text="Cancel"
                        onClick={handleModalClose}
                        variant="lightOutlined"
                        width="75px"
                        marginRight={10}
                    />
                    <CustomButton
                        text="Save"
                        onClick={handleModalSave}
                        variant="dark"
                        width="75px"
                    />
                </DialogActions>
            </Dialog>

            {/* Action buttons at the bottom */}
            <Box display="flex" justifyContent="space-evenly" mt={4}>
                <CustomButton text="Back" onClick={handleBack} variant="dark" width="75px" />
                <CustomButton text="Next" onClick={handleNext} variant="dark" width="75px" />
            </Box>
        </Box>
    );
};

export default RsvpGuestDetailsPage;
