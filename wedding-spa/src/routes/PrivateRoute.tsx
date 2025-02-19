// PrivateRoute.tsx
import React, { useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import useTokenVerification from '../hooks/useTokenVerification';
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
    const isValidToken = useTokenVerification(authToken);

    // Redirect to login if the token is invalid
    if (isValidToken === false) {
        logout();
        navigate('/admin/login', { replace: true, state: { from: location } });
        return null;
    }

    // While checking the token, show a loading spinner
    if (isValidToken === null) {
        return (
            <AdminLayout>
                <div className="d-flex justify-content-center">
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                </div>
            </AdminLayout>
        );
    }

    return component;
};

export default PrivateRoute;
