import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Checkbox,
  FormControlLabel,
  Link,
  Divider,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  login,
  clearError,
  AuthState,
} from '../../store/slices/authSlice';
import { RootState } from '../../store';

const StyledPaper = styled(Paper)(({ theme }) => ({
  height: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
}));

const LoginPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  maxWidth: 400,
  width: '100%',
  borderRadius: theme.spacing(2),
  boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
}));

const BrandSection = styled(Box)(({ theme }) => ({
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  color: 'white',
  textAlign: 'center',
  padding: theme.spacing(4),
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
}));

const LoginPage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector((state: RootState) => state.auth) as AuthState;

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  const [formErrors, setFormErrors] = useState({
    email: '',
    password: '',
  });

  useEffect(() => {
    if (isAuthenticated) {
      // Navigate based on user role (we'll need to get this from the user object)
      const userRole = localStorage.getItem('userRole') || 'user';
      navigate(userRole === 'admin' ? '/admin' : '/user');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    // Clear any previous errors
    dispatch(clearError());
  }, [dispatch]);

  const validateForm = (): boolean => {
    const errors = {
      email: '',
      password: '',
    };

    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    setFormErrors(errors);

    return !errors.email && !errors.password;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const result = await dispatch(login({
        email: formData.email,
        password: formData.password,
      }) as any);

      if (login.fulfilled.match(result)) {
        // Store user role for navigation
        localStorage.setItem('userRole', result.payload.user.role);

        // Remember me functionality
        if (formData.rememberMe) {
          localStorage.setItem('rememberEmail', formData.email);
        } else {
          localStorage.removeItem('rememberEmail');
        }
      }
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    // Clear errors when user starts typing
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleForgotPassword = () => {
    // TODO: Implement forgot password functionality
    console.log('Forgot password clicked');
  };

  return (
    <Grid container>
      {/* Left Side - Branding */}
      <Grid item xs={12} md={6}>
        <BrandSection>
          <Box mb={4}>
            <Typography variant="h2" component="h1" gutterBottom fontWeight="bold">
              📚 Library Management System
            </Typography>
            <Typography variant="h5" gutterBottom>
              Your Digital Library Portal
            </Typography>
          </Box>

          <Box mb={4}>
            <Typography variant="body1" paragraph>
              Access thousands of books, manage your reading journey, and explore personalized recommendations powered by AI.
            </Typography>
          </Box>

          <Box>
            <Typography variant="body2">
              Admin Portal • User Dashboard • AI-Powered Search
            </Typography>
          </Box>
        </BrandSection>
      </Grid>

      {/* Right Side - Login Form */}
      <Grid item xs={12} md={6}>
        <StyledPaper>
          <LoginPaper elevation={3}>
            <Box textAlign="center" mb={3}>
              <Typography variant="h4" component="h2" gutterBottom fontWeight="bold" color="primary">
                Welcome Back
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Sign in to access your library account
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                error={!!formErrors.email}
                helperText={formErrors.email}
                margin="normal"
                variant="outlined"
                autoComplete="email"
                autoFocus
              />

              <TextField
                fullWidth
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                error={!!formErrors.password}
                helperText={formErrors.password}
                margin="normal"
                variant="outlined"
                autoComplete="current-password"
              />

              <Box display="flex" justifyContent="space-between" alignItems="center" mt={2} mb={2}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.rememberMe}
                      onChange={handleChange}
                      name="rememberMe"
                      color="primary"
                    />
                  }
                  label="Remember me"
                />
                <Link
                  component="button"
                  type="button"
                  variant="body2"
                  onClick={handleForgotPassword}
                  sx={{ textDecoration: 'none' }}
                >
                  Forgot password?
                </Link>
              </Box>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                sx={{ mt: 2, mb: 2, py: 1.5 }}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>

            <Divider sx={{ my: 2 }}>
              <Typography variant="body2" color="textSecondary">
                OR
              </Typography>
            </Divider>

            <Box textAlign="center">
              <Typography variant="body2" color="textSecondary">
                Don't have an account?{' '}
                <Link href="/register" sx={{ textDecoration: 'none' }}>
                  Contact your administrator
                </Link>
              </Typography>
            </Box>

            <Box mt={3} pt={2} borderTop="1px solid #e0e0e0">
              <Typography variant="caption" color="textSecondary" display="block" textAlign="center">
                Secure login with role-based access
              </Typography>
              <Typography variant="caption" color="textSecondary" display="block" textAlign="center">
                Admin & User roles supported
              </Typography>
            </Box>
          </LoginPaper>
        </StyledPaper>
      </Grid>
    </Grid>
  );
};

export default LoginPage;