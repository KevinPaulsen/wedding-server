// context/FlowProvider.tsx
import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Rsvp, GuestListDetail, PrimaryContact, RsvpGuestDetailWithId } from '../types/rsvp';

// ===== Type Definitions =====
interface FlowState {
    step: {
        rsvpCompleted: boolean;
        preferredInfoCompleted: boolean;
        rsvpStatusCompleted: boolean;
        guestInfoCompleted: boolean;
    };
    formData: Rsvp;
    editingGuest: RsvpGuestDetailWithId | null;
}

const initialState: FlowState = {
    step: {
        rsvpCompleted: false,
        preferredInfoCompleted: false,
        rsvpStatusCompleted: false,
        guestInfoCompleted: false,
    },
    formData: {
        rsvp_id: '',
        primary_contact: {
            name: '',
            email: '',
            address: '',
            phone_number: '',
        },
        guest_list: {},
        roce: {
            invited: false,
            guests_attending: [],
        },
        rehearsal: {
            invited: false,
            guests_attending: [],
        },
        ceremony: {
            invited: false,
            guests_attending: [],
        },
        reception: {
            invited: false,
            guests_attending: [],
        },
        submitted: false,
    },
    editingGuest: null,
};

const actionTypes = {
    SET_STEP: 'SET_STEP',
    RESET_STEP: 'RESET_STEP',
    SET_FORM_DATA: 'SET_FORM_DATA',
    RESET_FORM_DATA: 'RESET_FORM_DATA',
    ADD_GUEST: 'ADD_GUEST',
    DELETE_GUEST: 'DELETE_GUEST',
    SET_EDITING_GUEST: 'SET_EDITING_GUEST',
    UPDATE_GUEST: 'UPDATE_GUEST',
    UPDATE_PREFERRED_CONTACT_FIELD: 'UPDATE_PREFERRED_CONTACT_FIELD',
} as const;

type Action =
    | {
    type: typeof actionTypes.SET_STEP;
    payload: Partial<FlowState['step']>;
}
    | {
    type: typeof actionTypes.RESET_STEP;
}
    | {
    type: typeof actionTypes.SET_FORM_DATA;
    payload: Partial<FlowState['formData']>;
}
    | {
    type: typeof actionTypes.RESET_FORM_DATA;
}
    | {
    type: typeof actionTypes.ADD_GUEST;
    payload: RsvpGuestDetailWithId;
}
    | {
    type: typeof actionTypes.DELETE_GUEST;
    payload: string;
}
    | {
    type: typeof actionTypes.SET_EDITING_GUEST;
    payload: RsvpGuestDetailWithId | null;
}
    | {
    type: typeof actionTypes.UPDATE_GUEST;
    payload: { id: string; guest: GuestListDetail };
}
    | {
    type: typeof actionTypes.UPDATE_PREFERRED_CONTACT_FIELD;
    payload: { field: keyof PrimaryContact; value: string };
};

function reducer(state: FlowState, action: Action): FlowState {
    switch (action.type) {
        case actionTypes.SET_STEP:
            return {
                ...state,
                step: { ...state.step, ...action.payload },
            };
        case actionTypes.RESET_STEP:
            return {
                ...state,
                step: initialState.step,
            };
        case actionTypes.SET_FORM_DATA:
            return {
                ...state,
                formData: { ...state.formData, ...action.payload },
            };
        case actionTypes.RESET_FORM_DATA:
            return {
                ...state,
                formData: initialState.formData,
            };
        case actionTypes.ADD_GUEST:
            return {
                ...state,
                formData: {
                    ...state.formData,
                    guest_list: {
                        ...state.formData.guest_list,
                        [action.payload.id]: action.payload,
                    },
                },
            };
        case actionTypes.DELETE_GUEST:
            const { [action.payload]: _, ...remainingGuests } = state.formData.guest_list;
            return {
                ...state,
                formData: {
                    ...state.formData,
                    guest_list: remainingGuests,
                },
            };
        case actionTypes.SET_EDITING_GUEST:
            return { ...state, editingGuest: action.payload };
        case actionTypes.UPDATE_GUEST:
            return {
                ...state,
                formData: {
                    ...state.formData,
                    guest_list: {
                        ...state.formData.guest_list,
                        [action.payload.id]: action.payload.guest,
                    },
                },
            };
        case actionTypes.UPDATE_PREFERRED_CONTACT_FIELD:
            return {
                ...state,
                formData: {
                    ...state.formData,
                    primary_contact: {
                        ...state.formData.primary_contact,
                        [action.payload.field]: action.payload.value,
                    },
                },
            };
        default:
            return state;
    }
}

// ===== Context Definition =====
interface FlowContextType {
    // steps
    step: FlowState['step'];
    setStep: (stepData: Partial<FlowState['step']>) => void;
    resetStepState: () => void;

    // formData
    formData: FlowState['formData'];
    setFormData: (formData: Partial<FlowState['formData']>) => void;
    resetFormData: () => void;

    // guests
    addGuest: (guest: RsvpGuestDetailWithId) => void;
    deleteGuest: (id: string) => void;
    updateGuest: (id: string, guest: GuestListDetail) => void;

    // editing
    editingGuest: RsvpGuestDetailWithId | null;
    setEditingGuest: (guest: RsvpGuestDetailWithId | null) => void;

    // contact field update
    updatePreferredContactField: (field: keyof PrimaryContact, value: string) => void;
}

const FlowContext = createContext<FlowContextType | undefined>(undefined);

export const useFlow = (): FlowContextType => {
    const context = useContext(FlowContext);
    if (!context) {
        throw new Error('useFlow must be used within a FlowProvider');
    }
    return context;
};

// ===== Provider Component =====
interface FlowProviderProps {
    children: ReactNode;
}

export const FlowProvider: React.FC<FlowProviderProps> = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    const setStep = (stepData: Partial<FlowState['step']>) => {
        dispatch({ type: actionTypes.SET_STEP, payload: stepData });
    };

    const resetStepState = () => {
        dispatch({ type: actionTypes.RESET_STEP });
    };

    const setFormData = (formData: Partial<FlowState['formData']>) => {
        dispatch({ type: actionTypes.SET_FORM_DATA, payload: formData });
    };

    const resetFormData = () => {
        dispatch({ type: actionTypes.RESET_FORM_DATA });
    };

    const addGuest = (guest: RsvpGuestDetailWithId) => {
        dispatch({ type: actionTypes.ADD_GUEST, payload: guest });
    };

    const deleteGuest = (id: string) => {
        dispatch({ type: actionTypes.DELETE_GUEST, payload: id });
    };

    const setEditingGuest = (guest: RsvpGuestDetailWithId | null) => {
        dispatch({ type: actionTypes.SET_EDITING_GUEST, payload: guest });
    };

    const updateGuest = (id: string, guest: GuestListDetail) => {
        dispatch({ type: actionTypes.UPDATE_GUEST, payload: { id, guest } });
    };

    const updatePreferredContactField = (field: keyof PrimaryContact, value: string) => {
        dispatch({
            type: actionTypes.UPDATE_PREFERRED_CONTACT_FIELD,
            payload: { field, value },
        });
    };

    return (
        <FlowContext.Provider
            value={{
                step: state.step,
                setStep,
                resetStepState,
                formData: state.formData,
                setFormData,
                resetFormData,
                addGuest,
                deleteGuest,
                updateGuest,
                editingGuest: state.editingGuest,
                setEditingGuest,
                updatePreferredContactField,
            }}
        >
            {children}
        </FlowContext.Provider>
    );
};
