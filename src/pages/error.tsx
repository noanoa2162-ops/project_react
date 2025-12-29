import { useNavigate } from "react-router-dom";
import { Container, Box, Typography, Button, Stack } from "@mui/material";

interface ErrorProps {
  message?: string;
} 
const Error: React.FC<ErrorProps> = ({ message }) => {
  const navigate = useNavigate();
  
  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
          py: 4,
          textAlign: 'center'
        }}
      >
        {/* Error Icon */}
        <Box
          sx={{
            fontSize: '120px',
            mb: 2
          }}
        >
          🔍
        </Box>
        
        {/* 404 Title */}
        <Typography
          variant="h2"
          component="h1"
          sx={{
            color: '#e74c3c',
            fontWeight: 'bold',
            mb: 2
          }}
        >
          404
        </Typography>
        
        {/* Error Message */}
        <Typography
          variant="h5"
          component="h2"
          sx={{
            color: '#2c3e50',
            mb: 3
          }}
        >
          {message || "העמוד לא נמצא"}
        </Typography>
        
        {/* Description */}
        <Typography
          variant="body1"
          sx={{
            color: '#7f8c8d',
            mb: 4,
            maxWidth: '500px',
            lineHeight: 1.6
          }}
        >
          מצטערים, העמוד שחיפשת אינו קיים או שאין לך הרשאה לגשת אליו.
        </Typography>
        
        {/* Action Buttons */}
        <Stack direction="row" spacing={2}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={() => navigate('/dashboard')}
          >
            🏠 חזור לדף הבית
          </Button>
          
          <Button
            variant="contained"
            color="success"
            size="large"
            onClick={() => navigate('/tickets')}
          >
            📋 לכל הכרטיסים
          </Button>
        </Stack>
      </Box>
    </Container>
  );
};
export default Error;