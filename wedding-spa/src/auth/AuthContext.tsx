// AuthContext.js
import React, { createContext, useState, ReactNode } from 'react';

export interface AuthContextType {
    authToken: string | null;
    login: (token: string) => Promise<void>;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [authToken, setAuthToken] = useState<string | null>(sessionStorage.getItem('authToken'));

    const login = async (token: string): Promise<void> => {
        sessionStorage.setItem('authToken', token);
        setAuthToken(token);
    };

    const logout = (): void => {
        sessionStorage.removeItem('authToken');
        setAuthToken(null);
    };

    return (
        <AuthContext.Provider value={{ authToken, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
