import React, { useState, useEffect, forwardRef } from 'react';
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
  useTheme,
} from '@mui/material';
import StepLayout from './RSVPStepLayout';
import { useFormContext } from 'react-hook-form';
import { Rsvp, RsvpGuestDetailWithId } from '../../types/rsvp';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import { FormData } from './RsvpFlowPage';
import CustomInputField, { CustomInputFieldRef } from '../../components/shared/CustomInputField';
import CustomButton from '../../components/shared/CustomButton';

interface RsvpGuestDetailsStepProps {
  rsvp: Rsvp;
  onNext: () => void;
  onBack: () => void;
}

// --- GuestRow Component ---
interface GuestRowProps {
  guest: RsvpGuestDetailWithId;
  theme: any;
  onToggleComing: (id: string, newValue: boolean) => void;
  onEdit: (id: string) => void;
  hasAnyOther: boolean;
}

const GuestRow: React.FC<GuestRowProps> = ({
                                             guest,
                                             theme,
                                             onToggleComing,
                                             onEdit,
                                             hasAnyOther,
                                           }) => (
    <TableRow
        sx={{
          backgroundColor: guest.coming ? 'inherit' : theme.palette.action.disabledBackground,
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
      <TableCell sx={{ width: { xs: 'auto', md: '1%' } }}>
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

// --- GuestTable Component ---
// Note: Added editingGuestId prop to the interface.
interface GuestTableProps {
  guests: RsvpGuestDetailWithId[];
  theme: any;
  editingGuestId?: string | null;
  onToggleComing: (id: string, newValue: boolean) => void;
  onEdit: (id: string) => void;
  onSave: (id: string, updatedGuest: RsvpGuestDetailWithId) => void;
  onCancelEdit: () => void;
  hasAnyOther: boolean;
}

const GuestTable: React.FC<GuestTableProps> = ({
                                                 guests,
                                                 theme,
                                                 editingGuestId = null,
                                                 onToggleComing,
                                                 onEdit,
                                                 hasAnyOther,
                                               }) => (
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
          {guests.map((guest) =>
              editingGuestId === guest.id ? null : ( // When editing, that row will be handled in the modal.
                  <GuestRow
                      key={guest.id}
                      guest={guest}
                      theme={theme}
                      onToggleComing={onToggleComing}
                      onEdit={onEdit}
                      hasAnyOther={hasAnyOther}
                  />
              )
          )}
        </TableBody>
      </Table>
    </TableContainer>
);

// --- EditGuestDialog Component ---
interface EditGuestDialogProps {
  open: boolean;
  editingGuest: RsvpGuestDetailWithId | null;
  setEditingGuest: React.Dispatch<React.SetStateAction<RsvpGuestDetailWithId | null>>;
  onSave: () => void;
  onClose: () => void;
  theme: any;
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
                          setEditingGuest((prev) =>
                              prev ? { ...prev, display_name: e.target.value } : null
                          )
                      }
                      label="Preferred Name"
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
                          setEditingGuest((prev) =>
                              prev ? { ...prev, dietary_restrictions: newValue } : null
                          )
                      }
                      renderOption={(props, option, { selected }) => {
                        const { key, ...rest } = props;
                        return (
                            <li key={key} {...rest}>
                              <Checkbox checked={selected} />
                              {option}
                            </li>
                        );
                      }}
                      renderTags={(value: string[], getTagProps) =>
                          value.map((option: string, index: number) => {
                            const { key, ...rest } = getTagProps({ index });
                            return <Chip key={key} label={option} size="small" {...rest} />;
                          })
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
                              inputProps={{ ...params.inputProps, readOnly: true }}
                          />
                      )}
                  />
                  {editingGuest.dietary_restrictions.includes('Other') && (
                      <CustomInputField
                          value={editingGuest.other}
                          onChange={(e) =>
                              setEditingGuest((prev) =>
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

// --- RsvpGuestDetailsStep Component ---
const RsvpGuestDetailsStep: React.FC<RsvpGuestDetailsStepProps> = ({ rsvp, onNext, onBack }) => {
  const theme = useTheme();
  const { watch, setValue } = useFormContext<FormData>();

  // Get guest details from form state; if empty, initialize them from rsvp.guest_list.
  const guestDetails = watch('guest_details') || [];
  useEffect(() => {
    if (guestDetails.length === 0) {
      const initialGuests: RsvpGuestDetailWithId[] = Object.entries(rsvp.guest_list || {}).map(
          ([id, details]) => ({ id, ...details })
      );
      setValue('guest_details', initialGuests);
    }
  }, [rsvp, guestDetails, setValue]);

  const guests: RsvpGuestDetailWithId[] = guestDetails;

  const handleToggleComing = (guestId: string, newValue: boolean) => {
    const updatedGuests = guests.map((guest) =>
        guest.id === guestId ? { ...guest, coming: newValue } : guest
    );
    setValue('guest_details', updatedGuests);
  };

  const handleEdit = (guestId: string) => {
    const guestToEdit = guests.find((g) => g.id === guestId);
    if (guestToEdit) {
      setEditingGuest({ ...guestToEdit });
      setOpenModal(true);
    }
  };

  const [editingGuest, setEditingGuest] = useState<RsvpGuestDetailWithId | null>(null);
  const [openModal, setOpenModal] = useState(false);

  const handleModalSave = () => {
    if (!editingGuest) return;
    const updatedGuests = guests.map((guest) =>
        guest.id === editingGuest.id ? editingGuest : guest
    );
    setValue('guest_details', updatedGuests);
    setOpenModal(false);
    setEditingGuest(null);
  };

  const handleModalClose = () => {
    setOpenModal(false);
    setEditingGuest(null);
  };

  const hasAnyOther = guests.some((g) => g.other && g.other.trim() !== '');

  return (
      <StepLayout title="Guest Details" description="Review and update your guest details as needed.">
        <Box textAlign="center">
          <Box sx={{ maxWidth: 900, mx: 'auto', color: theme.palette.primary.main, p: theme.spacing(1) }}>
            {guests.length === 0 ? (
                <Typography>No guests found.</Typography>
            ) : (
                <GuestTable
                    guests={guests}
                    theme={theme}
                    editingGuestId={editingGuest ? editingGuest.id : null}
                    onToggleComing={handleToggleComing}
                    onEdit={handleEdit}
                    onSave={(id: string, updatedGuest: RsvpGuestDetailWithId) => {
                      const updatedGuests = guests.map((guest) =>
                          guest.id === updatedGuest.id ? updatedGuest : guest
                      );
                      setValue('guest_details', updatedGuests);
                    }}
                    onCancelEdit={handleModalClose}
                    hasAnyOther={hasAnyOther}
                />
            )}
          </Box>
          <EditGuestDialog
              open={openModal}
              editingGuest={editingGuest}
              setEditingGuest={setEditingGuest}
              onSave={handleModalSave}
              onClose={handleModalClose}
              theme={theme}
          />
          <Box mt={2} display="flex" justifyContent="space-between">
            <Button variant="outlined" onClick={onBack}>
              Back
            </Button>
            <Button variant="contained" onClick={onNext}>
              Next
            </Button>
          </Box>
        </Box>
      </StepLayout>
  );
};

export default RsvpGuestDetailsStep;
