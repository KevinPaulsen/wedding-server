// AuthContext.js
import React, {createContext, useState} from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [authToken, setAuthToken] = useState(sessionStorage.getItem('authToken'));

    const login = async (token) => {
        sessionStorage.setItem('authToken', token);
        setAuthToken(token);
    };

    const logout = () => {
        sessionStorage.removeItem('authToken');
        setAuthToken(null);
    };

    return (<AuthContext.Provider value={{authToken, login, logout}}>
                {children}
            </AuthContext.Provider>);
};
