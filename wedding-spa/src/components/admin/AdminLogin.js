import {useContext, useState} from 'react';
import {AuthContext} from '../../auth/AuthContext';
import {useNavigate} from 'react-router-dom';
import useAuthRedirect from "../../hooks/useAuthRedirect";
import FormInput from "../FormInput";
import {Button, Form} from "react-bootstrap";
import {adminLogin} from "../../services/ApiService";

function AdminLogin() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const {login} = useContext(AuthContext);
    const navigate = useNavigate();

    useAuthRedirect();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const data = await adminLogin(username, password);
            login(data.token); // Update auth state
            navigate('/admin/dashboard'); // Redirect using React Router
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-5">
            <h2>Login</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            <Form onSubmit={handleLogin}>
                <FormInput
                    label="Username"
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <FormInput
                    label="Password"
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <Button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Logging in...' : 'Login'}
                </Button>
            </Form>
        </div>
    );
}

export default AdminLogin;
