import React, {createContext, useContext, useReducer} from 'react';

// Define initial state
const initialState = {
    step: {
        rsvpCompleted: false,
        preferredInfoCompleted: false,
        rsvpStatusCompleted: false,
        guestInfoCompleted: false,
    },
    formData: {
        rsvpCode: null,
        lastname: null,
        rsvpStatus: null,
        preferredContact: {
            name: null,
            phone: null,
            email: null,
            address: null,
        },
        allowedGuestCount: 0,
        guests: [],
    },
    editingGuest: null,
};

// Define action types
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
};

// Reducer function
function reducer(state, action) {
    switch (action.type) {
        case actionTypes.SET_STEP:
            return {
                ...state, step: {
                    ...state.step, ...action.payload,
                },
            };
        case actionTypes.RESET_STEP:
            return {
                ...state, step: initialState.step,
            };
        case actionTypes.SET_FORM_DATA:
            return {
                ...state, formData: {
                    ...state.formData, ...action.payload,
                },
            };
        case actionTypes.RESET_FORM_DATA:
            return {
                ...state, formData: initialState.formData,
            };
        case actionTypes.ADD_GUEST:
            return {
                ...state, formData: {
                    ...state.formData, guests: [...state.formData.guests, action.payload],
                },
            };
        case actionTypes.DELETE_GUEST:
            return {
                ...state,
                formData: {
                    ...state.formData,
                    guests: state.formData.guests.filter((_, i) => i !== action.payload),
                },
            };
        case actionTypes.SET_EDITING_GUEST:
            return {
                ...state, editingGuest: action.payload,
            };
        case actionTypes.UPDATE_GUEST:
            return {
                ...state, formData: {
                    ...state.formData,
                    guests: state.formData.guests.map((guest, idx) => idx === action.payload.index
                                                                      ? action.payload.guest : guest),
                },
            };
        case actionTypes.UPDATE_PREFERRED_CONTACT_FIELD:
            return {
                ...state, formData: {
                    ...state.formData, preferredContact: {
                        ...state.formData.preferredContact, [action.payload.field]: action.payload.value,
                    },
                },
            };
        default:
            return state;
    }
}

// Create the Flow Context
const FlowContext = createContext();

export const useFlow = () => useContext(FlowContext);

// Provide Flow Context to the app
export const FlowProvider = ({children}) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    // Action creators
    const setStep = (stepData) => {
        dispatch({type: actionTypes.SET_STEP, payload: stepData});
    };

    const resetStepState = () => {
        dispatch({type: actionTypes.RESET_STEP});
    };

    const setFormData = (formData) => {
        dispatch({type: actionTypes.SET_FORM_DATA, payload: formData});
    };

    const resetFormData = () => {
        dispatch({type: actionTypes.RESET_FORM_DATA});
    };

    const addGuest = (guest) => {
        dispatch({type: actionTypes.ADD_GUEST, payload: guest});
    };

    const deleteGuest = (index) => {
        dispatch({ type: actionTypes.DELETE_GUEST, payload: index });
    };

    const setEditingGuest = (guest) => {
        dispatch({type: actionTypes.SET_EDITING_GUEST, payload: guest});
    };

    const updateGuest = (index, guest) => {
        dispatch({ type: actionTypes.UPDATE_GUEST, payload: { index, guest } });
    };

    const updatePreferredContactField = (field, value) => {
        dispatch({
                     type: actionTypes.UPDATE_PREFERRED_CONTACT_FIELD, payload: {field, value},
                 });
    };

    return (<FlowContext.Provider
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
            </FlowContext.Provider>);
};
