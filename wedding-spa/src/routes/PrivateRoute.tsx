// src/routes/PrivateRoute.tsx
import React, {useContext, useEffect} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import {AuthContext} from '../context/AuthContext';
import useTokenVerification from '../hooks/auth/useTokenVerification';

// MUI imports
import {Box, CircularProgress} from '@mui/material';

import AdminLayout from '../components/admin/AdminLayout';

interface PrivateRouteProps {
    component: React.ReactElement;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ component }) => {
    const authContext = useContext(AuthContext);
    if (!authContext) {
        throw new Error('AuthContext must be used within an AuthProvider');
    }
    const { authToken, logout } = authContext;
    const navigate = useNavigate();
    const location = useLocation();

    // Verify token
    const { isValid, loading, error } = useTokenVerification(authToken);

    useEffect(() => {
        if (isValid === false || error) {
            logout();
            navigate('/admin/login', { replace: true, state: { from: location } });
        }
    }, [isValid, error, logout, navigate, location]);

    // While token verification is in progress, show a loading indicator
    if (loading || isValid === null) {
        return (
            <AdminLayout title="">
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '100%',
                    }}
                >
                    <CircularProgress aria-label="Loading..." />
                </Box>
            </AdminLayout>
        );
    }

    // If token is invalid or there's an error, render nothing (redirection occurs)
    if (!isValid || error) {
        return null;
    }

    // Otherwise, render the protected component
    return component;
};

export default PrivateRoute;
