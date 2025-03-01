// AdminLogin.tsx
import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import useAuthRedirect from "../../hooks/auth/useAuthRedirect";
import Title from "../../components/main/headerComponents/Title";
import FormInput from "../shared/FormInput";
import { Button, Form } from "react-bootstrap";
import { useAdminLogin } from "../../hooks/auth/useAdminLogin";
import CustomInputField from "../shared/CustomInputField";
import { Col, Container, Row } from 'react-bootstrap';


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
        <Container fluid className="d-flex flex-column vh-100" style={{ backgroundColor: 'var(--main-light)' }}>
            <Row className="g-0 mt-5 text-center align-items-center">
                <Col>
                    <Title link={false} color="default" />
                </Col>
            </Row>
            <Row className="flex-grow-1 align-items-center justify-content-center text-center">
                <Col className="col-12">
                    <div className="container mt-5" style={{maxWidth: '400px'}}>
                        <div>
                            <h3 className="text-center mb-4"> Admin Login </h3>
                        </div>
                        {error && <div className="alert alert-danger">{error}</div>}
                        <Form onSubmit={handleLogin}>
                            <CustomInputField
                                name="username"
                                type="text"
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />

                            <CustomInputField
                                name="password"
                                type="text"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />

                            <div className="d-flex justify-content-evenly px-2">
                                <Button type="submit" className='rsvp-button width-auto dark hover' disabled={loading}>
                                    {loading ? 'Logging in...' : 'Login'}
                                </Button>
                            </div>
                        </Form>
                    </div>
                </Col>
            </Row>

        </Container>
    );
};

export default AdminLogin;
