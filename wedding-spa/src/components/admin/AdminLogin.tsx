// AdminLogin.tsx
import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import useAuthRedirect from "../../hooks/auth/useAuthRedirect";
import FormInput from "../shared/FormInput";
import { Button, Form } from "react-bootstrap";
import { useAdminLogin } from "../../hooks/auth/useAdminLogin";

const AdminLogin: React.FC = () => {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const { login } = useContext(AuthContext)!;
    const navigate = useNavigate();

    // Redirect if already logged in.
    useAuthRedirect();

    // Use our specialized hook that wraps the adminLogin API call.
    const { execute: doAdminLogin, error, loading, data } = useAdminLogin();

    // When the API call returns data (i.e. a token), log in and navigate.
    useEffect(() => {
        if (data && data.token) {
            login(data.token);
            navigate('/admin/dashboard');
        }
    }, [data, login, navigate]);

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Call the hook's execute function with username and password.
        await doAdminLogin(username, password);
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
};

export default AdminLogin;
