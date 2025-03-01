// src/components/GuestSelection.tsx
import React from 'react';
import {createStyles, FormControlLabel, makeStyles, Switch, Theme, Typography} from '@material-ui/core';
import {useFlow} from '../../../context/FlowProvider';
import {Rsvp} from "../../../types/rsvp";
import CustomButton from "../CustomButton";

interface GuestSelectionProps {
    eventKey: 'roce' | 'rehearsal' | 'ceremony' | 'reception';
    backPage: (formData: Rsvp) => void;
    nextPage: (formData: Rsvp, resetFormData?: () => void) => void;
    loading?: boolean;
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        guestListContainer: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginTop: theme.spacing(2),
            fontFamily: '"EB Garamond", system-ui',
        },
        guestButton: {
            width: '100%',
            maxWidth: '300px',
            marginBottom: theme.spacing(1),
            textTransform: 'none',
            fontFamily: '"EB Garamond", system-ui',
            fontSize: '16px',
            border: '2px solid var(--main-dark)',
        },
        selected: {
            backgroundColor: 'var(--main-dark)',
            color: 'var(--main-light)',
            '&:hover': {
                backgroundColor: 'var(--hover-dark)',
            },
        },
        notSelected: {
            backgroundColor: 'var(--hover-light)',
            color: 'var(--main-dark)',
        },
        navigation: {
            display: 'flex',
            justifyContent: 'space-evenly',
            marginTop: theme.spacing(3),
        },
        navButton: {
            backgroundColor: 'var(--main-dark)',
            color: 'var(--main-light)',
            textTransform: 'none',
            fontFamily: '"EB Garamond", system-ui',
            '&:hover': {
                backgroundColor: 'var(--hover-dark)',
            },
        },
        switchBase: {
            color: 'var(--main-dark)',
            '&$checked': {
                color: 'var(--main-dark)',
            },
            '&$checked + $track': {
                backgroundColor: 'var(--main-dark)',
            },
        },
        checked: {},
        track: {
            backgroundColor: 'var(--main-dark)',
        },
        formControlLabel: {
            fontFamily: '"EB Garamond", system-ui',
            fontSize: '20px',
        },
    })
);

const GuestSelection: React.FC<GuestSelectionProps> = ({
                                                           eventKey,
                                                           backPage,
                                                           nextPage,
                                                           loading = null,
                                                       }) => {
    const classes = useStyles();
    const { formData, resetFormData, setFormData } = useFlow();

    // Retrieve guest_list from formData and filter for those marked "coming"
    const guestList = formData.guest_list || {};
    const comingGuestKeys = Object.keys(guestList).filter(
        guestKey => guestList[guestKey].coming
    );
    const eventData = formData[eventKey];

    // If eventData isn't present or allowed_guests is zero, render nothing.
    if (!eventData || eventData.allowed_guests <= 0) {
        return null;
    }

    // Toggle attendance for an individual guest (only from those coming)
    const handleToggle = (guestKey: string) => {
        const alreadyAttending = eventData.guests_attending || [];
        const updated = alreadyAttending.includes(guestKey)
            ? alreadyAttending.filter((id: string) => id !== guestKey)
            : [...alreadyAttending, guestKey];

        setFormData({
            [eventKey]: {
                ...eventData,
                guests_attending: updated,
            },
        });
    };

    // Master toggle: set all coming guests as attending or not.
    const handleSelectAllToggle = () => {
        const allSelected = comingGuestKeys.every(guestKey =>
            eventData.guests_attending.includes(guestKey)
        );
        if (allSelected) {
            // Deselect only the coming guests
            const updated = (eventData.guests_attending || []).filter(
                guestKey => !comingGuestKeys.includes(guestKey)
            );
            setFormData({
                [eventKey]: {
                    ...eventData,
                    guests_attending: updated,
                },
            });
        } else {
            // Mark all coming guests as attending
            setFormData({
                [eventKey]: {
                    ...eventData,
                    guests_attending: comingGuestKeys,
                },
            });
        }
    };

    const allSelected = comingGuestKeys.every(guestKey =>
        eventData.guests_attending.includes(guestKey)
    );

    const numGuests = comingGuestKeys.length;
    const numComing = comingGuestKeys.filter(guestKey => eventData.guests_attending.includes(guestKey)).length;

    return (
        <div className="p-3">
            {eventData.allowed_guests <= 0 ? (
                <Typography>You have no invitation.</Typography>
            ) : (
                <>
                    {/* Master toggle switch with styled label */}
                    <FormControlLabel
                        classes={{ label: classes.formControlLabel }}
                        control={
                            <Switch
                                classes={{
                                    switchBase: classes.switchBase,
                                    checked: classes.checked,
                                    track: classes.track,
                                }}
                                checked={allSelected}
                                onChange={handleSelectAllToggle}
                                name="allComingSwitch"
                            />
                        }
                        label={`${numComing} / ${numGuests} Guests Attending`}
                    />

                    {/* List of guest buttons for only those marked as "coming" */}
                    <div className={classes.guestListContainer}>
                        {comingGuestKeys.map((guestKey) => {
                            const guest = guestList[guestKey];
                            const isAttending = eventData.guests_attending.includes(guestKey);
                            return (
                                <CustomButton
                                    key={guestKey}
                                    text={guest.display_name}
                                    onClick={() => handleToggle(guestKey)}
                                    variant={isAttending ? 'dark' : 'light'}
                                    height={50}
                                    maxWidth={300}
                                    marginBottom={8}
                                />
                            );
                        })}
                    </div>
                </>
            )}

            {/* Navigation buttons */}
            <div className={classes.navigation}>
                <CustomButton
                    text="Back"
                    onClick={() => backPage(formData)}
                    variant="dark"
                    width={75}
                />
                <CustomButton
                    text={
                        loading === null
                            ? 'Next'
                            : loading
                                ? 'Submitting...'
                                : 'Submit'
                    }
                    onClick={() => nextPage(formData, resetFormData)}
                    variant="dark"
                    width={"auto"}
                />
            </div>
        </div>
    );
};

export default GuestSelection;
