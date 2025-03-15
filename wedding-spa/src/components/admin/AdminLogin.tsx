// components/admin/AdminLogin.tsx
import React, {useContext, useEffect, useState} from 'react';
import {AuthContext} from '../../context/AuthContext';
import {useNavigate} from 'react-router-dom';
import useAuthRedirect from "../../hooks/auth/useAuthRedirect";
import Title from "../../components/main/headerComponents/Title";
import {Alert, Box, Button, Container, Grid2, Typography} from '@mui/material';
import {useAdminLogin} from "../../hooks/auth/useAdminLogin";
import CustomInputField from "../shared/CustomInputField";

const AdminLogin: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const {login} = useContext(AuthContext)!;
  const navigate = useNavigate();

  // Redirect if already logged in.
  useAuthRedirect();

  // Use our specialized hook that wraps the adminLogin API call.
  const {execute: doAdminLogin, error, loading, data} = useAdminLogin();

  // When the API call returns data (i.e. a token), log in and navigate.
  useEffect(() => {
    if (data && data.token) {
      login(data.token).then(() => navigate('/admin/dashboard'));
    }
  }, [data, login, navigate]);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await doAdminLogin(username, password);
  };

  return (
      <Container
          maxWidth={false}
          sx={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column'
          }}
      >
        {/* Title Row */}
        <Grid2
            container
            sx={{mt: 5, textAlign: 'center'}}
            justifyContent="center"
            alignItems="center"
        >
          <Grid2>
            <Title link={false} color="default"/>
          </Grid2>
        </Grid2>

        {/* Form Row */}
        <Grid2
            container
            sx={{
              flexGrow: 1,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center'
            }}
        >
          <Grid2 size={12}>
            <Box
                sx={{
                  mt: 5,
                  mx: 'auto',
                  maxWidth: 400,
                  width: '100%'
                }}
            >
              <Typography variant="h4" component="h3" align="center" mb={2}>
                Admin Login
              </Typography>
              {error && (
                  <Alert severity="error" sx={{mb: 2}}>
                    {error}
                  </Alert>
              )}
              <Box component="form" onSubmit={handleLogin} noValidate>
                <CustomInputField
                    name="username"
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <CustomInputField
                    name="password"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-evenly',
                      px: 2,
                      mt: 2
                    }}
                >
                  <Button
                      type="submit"
                      variant="contained"
                      disabled={loading}
                  >
                    {loading ? 'Logging in...' : 'Login'}
                  </Button>
                </Box>
              </Box>
            </Box>
          </Grid2>
        </Grid2>
      </Container>
  );
};

export default AdminLogin;
