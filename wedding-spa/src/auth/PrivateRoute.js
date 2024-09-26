import {useContext, useEffect} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import {AuthContext} from './AuthContext';

function PrivateRoute({component}) {
    const {authToken} = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (!authToken) {
            navigate('/admin/login', {replace: true, state: {from: location}});
        }
    }, [authToken, navigate, location]);

    return authToken ? component : null;
}

export default PrivateRoute;
