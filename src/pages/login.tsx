import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, Navigate } from "react-router-dom";
import { 
  Box, Button, TextField, Typography, Container, Paper, 
  InputAdornment, IconButton, CircularProgress, Alert, Link, Fade 
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import axios from "axios";

// Services & Stores
import { getMe, getToken, registerUser } from "../services/api.service";
import authStore from "../store/auth.store";
import { observer } from "mobx-react-lite";

interface LoginFormData {
  name: string;
  email: string;
  password: string;
}

const Login: React.FC = observer(() => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  if (authStore.isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const { register, handleSubmit, reset, formState: { errors } } = useForm<LoginFormData>({
    defaultValues: { name: "", email: "", password: "" }
  });

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: async (formData: LoginFormData) => {
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
    }
  });

  const getErrorMessage = (err: unknown) => {
    if (axios.isAxiosError(err)) {
      if (!err.response) return "לא ניתן להתחבר למערכת כרגע. אנא בדוק את החיבור לאינטרנט או נסה שוב מאוחר יותר.";
      if (err.response.status === 401) return "פרטי ההתחברות שגויים. אנא נסה שוב.";
      if (err.response.status === 409) return "כתובת האימייל כבר קיימת במערכת.";
      if (err.response.status >= 500) return "אירעה תקלה זמנית במערכת. אנחנו מטפלים בזה, אנא נסה שוב בעוד כמה דקות.";
    }
    return "אירעה שגיאה בתהליך. אנא נסה שוב.";
  };

  const onSubmit = (data: LoginFormData) => mutate(data);

  const toggleMode = () => {
    setIsLogin((prev) => !prev);
    reset();
  };

  if (authStore.isAuthenticated) {
    navigate("/dashboard");
    return null;
  }

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
              {isLogin ? "ברוכים השבים" : "צור חשבון חדש"}
            </Typography>
            
            <Typography variant="body2" sx={{ mb: 5, color: '#6B7280', fontWeight: 400 }}>
              {isLogin ? "התחבר כדי להמשיך" : "הצטרף לפלטפורמה שלנו"}
            </Typography>

            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              {!isLogin && (
                <TextField
                  fullWidth
                  margin="normal"
                  label="שם מלא"
                  variant="standard"
                  {...register("name", { 
                    required: !isLogin ? "שם מלא הוא שדה חובה" : false,
                    minLength: { value: 2, message: "השם חייב להכיל לפחות 2 תווים" },
                    maxLength: { value: 50, message: "השם ארוך מדי (מקסימום 50 תווים)" },
                    pattern: { 
                      value: /^[א-תa-zA-Z\s]+$/, 
                      message: "השם יכול להכיל רק אותיות ורווחים" 
                    }
                  })}
                  error={!!errors.name}
                  helperText={errors.name?.message}
                  sx={{ mb: 2 }}
                />
              )}

              <TextField
                fullWidth
                margin="normal"
                label="אימייל"
                autoComplete="email"
                variant="standard"
                {...register("email", { 
                    required: "אימייל הוא שדה חובה",
                    pattern: { 
                      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i, 
                      message: "כתובת אימייל לא תקינה" 
                    }
                })}
                error={!!errors.email}
                helperText={errors.email?.message}
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                margin="normal"
                label="סיסמה"
                type={showPassword ? "text" : "password"}
                variant="standard"
                {...register("password", { 
                  required: "סיסמה היא שדה חובה", 
                  minLength: { 
                    value: 4, 
                    message: "הסיסמה חייבת להכיל לפחות 4 תווים" 
                  },
                  maxLength: {
                    value: 50,
                    message: "הסיסמה ארוכה מדי (מקסימום 50 תווים)"
                  }
                })}
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
                  {getErrorMessage(error)}
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
                {isPending ? <CircularProgress size={20} color="inherit" /> : (isLogin ? "התחבר" : "הרשם")}
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
                  {isLogin ? "משתמש חדש? צור חשבון" : "יש לך חשבון? התחבר"}
                </Link>
              </Box>
            </form>
          </Paper>
        </Fade>
      </Container>
    </Box>
  );
});

export default Login;