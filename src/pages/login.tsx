import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { 
  Box, Button, TextField, Typography, Container, Paper, 
  InputAdornment, IconButton, CircularProgress, Alert, Link, Fade 
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

// Services & Stores
import { getMe, getToken, registerUser } from "../services/api.service";
import authStore from "../store/auth.store";

interface HookFormProps {
  name: string;
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<HookFormProps>({
    defaultValues: { name: "", email: "", password: "" }
  });

  const { mutate, isPending, isError } = useMutation({
    mutationFn: async (formData: HookFormProps) => {
      if (!isLogin) {
        await registerUser(formData.name, formData.email, formData.password);
      }
      const loginToken = await getToken(formData.email, formData.password);
      const user = await getMe(loginToken.token);
      return { token: loginToken.token, user };
    },
    onSuccess: (data) => {
      authStore.login(data.token, data.user);
      navigate("/dashboard");
    },
    onError: (err) => console.error("Login Error:", err)
  });

  const onSubmit = (data: HookFormProps) => mutate(data);

  const toggleMode = () => {
    setIsLogin((prev) => !prev);
    reset();
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      bgcolor: '#F9FAFB', 
      p: 2
    }}>
      <Container component="main" maxWidth="xs">
        <Fade in={true} timeout={1200}>
          <Paper 
            elevation={0} 
            sx={{ 
              p: { xs: 3, sm: 6 }, 
              width: '100%', 
              borderRadius: 4, 
              textAlign: 'center',
              bgcolor: '#FFFFFF',
              border: '1px solid #E5E7EB',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)'
            }}
          >
            <Typography variant="h5" component="h1" sx={{ fontWeight: 500, mb: 1, color: '#111827', letterSpacing: '0.02em' }}>
              {isLogin ? "Welcome back" : "Create your account"}
            </Typography>
            
            <Typography variant="body2" sx={{ mb: 5, color: '#6B7280', fontWeight: 400 }}>
              {isLogin ? "Please sign in to continue" : "Join our platform"}
            </Typography>

            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              {!isLogin && (
                <TextField
                  fullWidth
                  margin="normal"
                  label="Name"
                  variant="standard"
                  {...register("name", { required: !isLogin ? "Name is required" : false })}
                  error={!!errors.name}
                  helperText={errors.name?.message}
                  sx={{ mb: 2 }}
                />
              )}

              <TextField
                fullWidth
                margin="normal"
                label="Email"
                autoComplete="email"
                variant="standard"
                {...register("email", { 
                    required: "Email is required",
                    pattern: { value: /^\S+@\S+$/i, message: "Invalid email" }
                })}
                error={!!errors.email}
                helperText={errors.email?.message}
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                margin="normal"
                label="Password"
                type={showPassword ? "text" : "password"}
                variant="standard"
                {...register("password", { required: "Password is required", minLength: { value: 4, message: "Too short" } })}
                error={!!errors.password}
                helperText={errors.password?.message}
                sx={{ mb: 4 }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} size="small" sx={{ color: '#9CA3AF' }}>
                        {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              {isError && (
                <Alert severity="error" variant="outlined" sx={{ mb: 3, border: '1px solid #FEE2E2', color: '#B91C1C', borderRadius: 2 }}>
                  Authentication failed.
                </Alert>
              )}

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={isPending}
                sx={{ 
                  py: 1.5, 
                  borderRadius: 2, 
                  bgcolor: '#111827', 
                  textTransform: 'none',
                  fontSize: '0.95rem',
                  fontWeight: 500,
                  '&:hover': {
                    bgcolor: '#374151',
                    boxShadow: 'none'
                  },
                  boxShadow: 'none'
                }}
              >
                {isPending ? <CircularProgress size={20} color="inherit" /> : (isLogin ? "Sign in" : "Sign up")}
              </Button>

              <Box sx={{ mt: 4 }}>
                <Link 
                  component="button" 
                  type="button"
                  variant="body2" 
                  onClick={toggleMode}
                  sx={{ 
                    color: '#6B7280', 
                    textDecoration: 'none',
                    fontWeight: 400,
                    // הסרת המסגרת בזמן לחיצה ופוקוס
                    '&:focus': { outline: 'none' },
                    '&:active': { outline: 'none' },
                    '&:hover': { color: '#111827' }
                  }}
                >
                  {isLogin ? "New user? Create account" : "Have an account? Sign in"}
                </Link>
              </Box>
            </form>
          </Paper>
        </Fade>
      </Container>
    </Box>
  );
};

export default Login;