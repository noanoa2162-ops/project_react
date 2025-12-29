import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import authStore from "../store/auth.store";
import ticketsStore from "../store/tickets.store";
import { getTickets } from "../services/api.service";
import AddPriority from "../components/addPriority";
import AddStatus from "../components/addStatus";
import PrioritiesList from "../components/prioritiesList";
import StatusesList from "../components/statusesList";
import { Container, Box, Typography, CircularProgress, Button, Paper } from "@mui/material";


const Dashboard = observer(() => {
  const navigate = useNavigate();
  const role = authStore.currentUser?.role;
  const name = authStore.currentUser?.name;

  // טעינת כרטיסים עם React Query (רק לשמירה ב-store)
  useQuery({
    queryKey: ["tickets"],
    queryFn: async () => {
      ticketsStore.setLoading(true);
      try {
        const data = await getTickets(authStore.token!);
        ticketsStore.getTickets(data);
        return data;
      } catch (err) {
        ticketsStore.setError(err instanceof Error ? err.message : 'שגיאה בטעינת כרטיסים');
        ticketsStore.setLoading(false);
        throw err;
      }
    },
    staleTime: 0,
    gcTime: Infinity,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true
  });

  if (ticketsStore.isLoading) {
    return (
      <Container maxWidth="md" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress size={80} sx={{ mb: 2 }} />
          <Typography variant="h6" color="textSecondary">טוען...</Typography>
        </Box>
      </Container>
    );
  }

  if (ticketsStore.error) {
    return (
      <Container maxWidth="md" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h3" sx={{ mb: 2 }}>❌</Typography>
          <Typography variant="h6" color="error" sx={{ mb: 2 }}>שגיאה: {ticketsStore.error}</Typography>
          <Button variant="contained" onClick={() => window.location.reload()}>נסה שוב</Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" sx={{ mb: 3, fontWeight: 'bold' }}>
        👋 שלום {name}
      </Typography>
      
      <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
        <Button variant="contained" color="primary" onClick={() => navigate('/tickets')}>
          💼 לכל הכרטיסים
        </Button>
        
        {role === 'customer' && (
          <Button variant="contained" color="success" onClick={() => navigate('/tickets/new')}>
            ➕ צור כרטיס חדש
          </Button>
        )}
      </Box>

      {role === 'admin' && (
        <Box sx={{ mt: 5, pt: 4, borderTop: '2px solid #bdc3c7' }}>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
            ⚙️ ניהול מערכת
          </Typography>
          
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 3 }}>
            <Paper sx={{ p: 2 }}>
              <AddPriority />
            </Paper>
            <Paper sx={{ p: 2 }}>
              <AddStatus />
            </Paper>
            <Box sx={{ gridColumn: '1 / -1' }}>
              <PrioritiesList />
            </Box>
            <Box sx={{ gridColumn: '1 / -1' }}>
              <StatusesList />
            </Box>
          </Box>
        </Box>
      )}
    </Container>
  );
});

export default Dashboard;
