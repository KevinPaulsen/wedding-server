import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Rsvp, GuestDetail } from '../types/rsvp';

// ===== Type Definitions =====

interface PrimaryContact {
    name: string;
    phoneNumber: string;
    email: string;
    address: string;
}

// Guest with an optional index for editing
export interface RsvpGuestDetailWithIndex extends GuestDetail {
    index?: number;
}

interface FlowState {
    step: {
        rsvpCompleted: boolean;
        preferredInfoCompleted: boolean;
        rsvpStatusCompleted: boolean;
        guestInfoCompleted: boolean;
    };
    formData: Rsvp;
    editingGuest: RsvpGuestDetailWithIndex | null;
}

const initialState: FlowState = {
    step: {
        rsvpCompleted: false,
        preferredInfoCompleted: false,
        rsvpStatusCompleted: false,
        guestInfoCompleted: false,
    },
    formData: {
        rsvpCode: '',
        lastnames: [''],
        rsvpStatus: 'PENDING',
        primaryContact: {
            name: '',
            phoneNumber: '',
            email: '',
            address: '',
        },
        allowedGuestCount: 0,
        rsvpGuestDetails: [],
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

// We define typed action payloads for each action:
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
    payload: GuestDetail;
}
    | {
    type: typeof actionTypes.DELETE_GUEST;
    payload: number;
}
    | {
    type: typeof actionTypes.SET_EDITING_GUEST;
    payload: RsvpGuestDetailWithIndex | null;
}
    | {
    type: typeof actionTypes.UPDATE_GUEST;
    payload: { index: number; guest: GuestDetail };
}
    | {
    type: typeof actionTypes.UPDATE_PREFERRED_CONTACT_FIELD;
    payload: { field: keyof PrimaryContact; value: string };
};

// ===== Reducer =====
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
                    rsvpGuestDetails: [...state.formData.rsvpGuestDetails, action.payload],
                },
            };
        case actionTypes.DELETE_GUEST:
            return {
                ...state,
                formData: {
                    ...state.formData,
                    rsvpGuestDetails: state.formData.rsvpGuestDetails.filter(
                        (_, i) => i !== action.payload
                    ),
                },
            };
        case actionTypes.SET_EDITING_GUEST:
            return { ...state, editingGuest: action.payload };
        case actionTypes.UPDATE_GUEST:
            return {
                ...state,
                formData: {
                    ...state.formData,
                    rsvpGuestDetails: state.formData.rsvpGuestDetails.map((guest, idx) =>
                        idx === action.payload.index ? action.payload.guest : guest
                    ),
                },
            };
        case actionTypes.UPDATE_PREFERRED_CONTACT_FIELD:
            return {
                ...state,
                formData: {
                    ...state.formData,
                    primaryContact: {
                        ...state.formData.primaryContact,
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
    addGuest: (guest: GuestDetail) => void;
    deleteGuest: (index: number) => void;
    updateGuest: (index: number, guest: GuestDetail) => void;

    // editing
    editingGuest: RsvpGuestDetailWithIndex | null;
    setEditingGuest: (guest: RsvpGuestDetailWithIndex | null) => void;

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

    // Action creators
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

    const addGuest = (guest: GuestDetail) => {
        dispatch({ type: actionTypes.ADD_GUEST, payload: guest });
    };

    const deleteGuest = (index: number) => {
        dispatch({ type: actionTypes.DELETE_GUEST, payload: index });
    };

    const setEditingGuest = (guest: RsvpGuestDetailWithIndex | null) => {
        dispatch({ type: actionTypes.SET_EDITING_GUEST, payload: guest });
    };

    const updateGuest = (index: number, guest: GuestDetail) => {
        dispatch({ type: actionTypes.UPDATE_GUEST, payload: { index, guest } });
    };

    const updatePreferredContactField = (
        field: keyof PrimaryContact,
        value: string
    ) => {
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
