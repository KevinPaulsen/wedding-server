import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../auth/AuthContext';

const useAuthRedirect = () => {
    const { authToken } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (authToken) {
            navigate('/admin/dashboard');
        }
    }, [authToken, navigate]);
};

export default useAuthRedirect;
