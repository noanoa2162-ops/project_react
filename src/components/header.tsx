import { Link, useNavigate } from "react-router-dom";
import { AppBar, Toolbar, Box, Typography, Button } from "@mui/material";
import authStore from "../store/auth.store";
import { observer } from "mobx-react-lite";
import type React from "react";

const Header: React.FC = observer(() => {
    const navigate = useNavigate();
    const name = authStore.currentUser?.name;

    const handleLogout = () => {
        authStore.logout();
        localStorage.removeItem('token');
        navigate("/login");
    };

    if (!authStore.isAuthenticated) {
        return null;
    }

    return (
        <AppBar position="fixed" sx={{ backgroundColor: '#2c3e50' }}>
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', paddingX: '30px' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
                    <Typography variant="h6" sx={{ fontSize: '24px', fontWeight: 'bold' }}>
                        🎫 Helpdesk
                    </Typography>
                    <Link to="/dashboard" style={{ textDecoration: 'none' }}>
                        <Button
                            color="inherit"
                            sx={{
                                fontSize: '16px',
                                padding: '8px 16px',
                                '&:hover': {
                                    backgroundColor: 'rgba(255,255,255,0.2)'
                                }
                            }}
                        >
                            🏠 בית
                        </Button>
                    </Link>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <Typography sx={{ fontSize: '16px' }}>
                        שלום, {name} 👋
                    </Typography>
                    <Button
                        onClick={handleLogout}
                        variant="contained"
                        color="error"
                        sx={{
                            fontSize: '16px',
                            fontWeight: 'bold'
                        }}
                    >
                        🚪 יציאה
                    </Button>
                </Box>
            </Toolbar>
        </AppBar>
    );
});

export default Header;