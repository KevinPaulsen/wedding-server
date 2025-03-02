// PrivateRoute.tsx
import React, { useContext, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import useTokenVerification from '../hooks/auth/useTokenVerification';
import { Spinner } from 'react-bootstrap';
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

    // Call the token verification hook.
    const { isValid, loading, error } = useTokenVerification(authToken);

    // useEffect to handle redirection when token is invalid or there's an error.
    useEffect(() => {
        if (isValid === false || error) {
            logout();
            navigate('/admin/login', { replace: true, state: { from: location } });
        }
    }, [isValid, error, logout, navigate, location]);

    // While token verification is in progress (or isValid is still null), show a spinner.
    if (loading || isValid === null) {
        return (
            <AdminLayout title="">
                <div className="d-flex justify-content-center">
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                </div>
            </AdminLayout>
        );
    }

    // If token is invalid or an error exists, render nothing (redirection will occur).
    if (isValid === false || error) {
        return null;
    }

    // Otherwise, render the protected component.
    return component;
};

export default PrivateRoute;
