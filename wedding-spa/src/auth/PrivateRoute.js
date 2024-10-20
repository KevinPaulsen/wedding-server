import {useContext} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import {AuthContext} from './AuthContext';
import useTokenVerification from '../hooks/useTokenVerification';
import {Spinner} from "react-bootstrap";
import AdminLayout from "../components/admin/AdminLayout";

function PrivateRoute({component}) {
    const {authToken, logout} = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const isValidToken = useTokenVerification(authToken);

    // Redirect to login if the token is invalid
    if (isValidToken === false) {
        logout()
        navigate('/admin/login', {replace: true, state: {from: location}});
        return null;
    }

    // While checking the token, we can show a loading spinner or return null
    if (isValidToken === null) {
        return (<AdminLayout children={<div className="d-flex justify-content-center">
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                </div>}/>);
    }

    return component;
}

export default PrivateRoute;