import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../auth/AuthContext';

const useAuthRedirect = (): void => {
    const { authToken } = useContext(AuthContext)!;
    const navigate = useNavigate();

    useEffect(() => {
        if (authToken) {
            navigate('/admin/dashboard');
        }
    }, [authToken, navigate]);
};

export default useAuthRedirect;
