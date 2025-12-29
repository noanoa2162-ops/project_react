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
        <AppBar position="fixed" elevation={0} sx={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e5e7eb' }}>
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', paddingX: '40px', height: '70px' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
                    <Typography variant="h6" sx={{ fontSize: '22px', fontWeight: 800, color: '#000000', letterSpacing: '-0.02em' }}>
                        🎫 Helpdesk
                    </Typography>
                    <Link to="/dashboard" style={{ textDecoration: 'none' }}>
                        <Button
                            sx={{
                                fontSize: '15px',
                                fontWeight: 600,
                                color: '#4b5563',
                                padding: '8px 16px',
                                borderRadius: '8px',
                                '&:hover': {
                                    backgroundColor: '#f3f4f6',
                                    color: '#000000'
                                }
                            }}
                        >
                            🏠 בית
                        </Button>
                    </Link>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: '25px' }}>
                    <Typography sx={{ fontSize: '15px', fontWeight: 600, color: '#374151' }}>
                        שלום, <span style={{ color: '#064e3b', fontWeight: 800 }}>{name}</span> 👋
                    </Typography>
                    <Button
                        onClick={handleLogout}
                        variant="outlined"
                        sx={{
                            fontSize: '14px',
                            fontWeight: 700,
                            color: '#000000',
                            borderColor: '#e5e7eb',
                            borderRadius: '8px',
                            px: 3,
                            '&:hover': {
                                borderColor: '#000000',
                                backgroundColor: '#f9fafb'
                            }
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