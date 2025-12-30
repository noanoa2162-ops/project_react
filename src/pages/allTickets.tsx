import { useNavigate } from "react-router-dom";
import { useState, useMemo } from "react";
import { observer } from "mobx-react-lite";
import type { Ticket as TicketModel } from "../models";
import { getTickets } from "../services/api.service";
import authStore from "../store/auth.store";
import ticketsStore from "../store/tickets.store";
import TicketComponent from "../components/ticket";
import SearchTickets from "../components/searchTickets";
import { useQuery } from "@tanstack/react-query";
import { Box, Container, Typography, CircularProgress, Alert, Button, Paper } from "@mui/material";

const AllTickets: React.FC = observer(() => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredTickets, setFilteredTickets] = useState<TicketModel[] | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ["tickets"],
    queryFn: async () => {
      const data = await getTickets(authStore.token!);
      ticketsStore.getTickets(data);
      return data;
    },
    staleTime: 0,
    gcTime: Infinity,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    enabled: !!authStore.token
  });

  // פילטור הפניות עם useMemo
  const displayTickets = useMemo(() => {
    if (filteredTickets !== null) return filteredTickets;
    return data || [];
  }, [data, filteredTickets]);

  if (isLoading) {
    return (
      <Container maxWidth="md" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress size={80} sx={{ mb: 2 }} />
          <Typography variant="h6" color="textSecondary">טוען פניות...</Typography>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <Box sx={{ textAlign: 'center', width: '100%' }}>
          <Typography variant="h3" sx={{ mb: 2 }}>⚠️</Typography>
          <Typography variant="h5" color="error" sx={{ mb: 2 }}>אירעה שגיאה</Typography>
          <Typography variant="body1" color="textSecondary" sx={{ mb: 3, maxWidth: '500px', mx: 'auto' }}>
            לא הצלחנו לטעון את הפניות כרגע. אנא נסה שוב בעוד מספר רגעים.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button variant="contained" color="primary" onClick={() => window.location.reload()}>
              🔄 נסה שוב
            </Button>
            <Button variant="outlined" onClick={() => navigate('/dashboard')}>
              🏠 חזור לדף הבית
            </Button>
          </Box>
        </Box>
      </Container>
    );
  }

  const role = authStore.currentUser?.role;

  return (
    <Container maxWidth="lg" sx={{ py: 5, bgcolor: '#ffffff', minHeight: '100vh' }}>
      <Box sx={{ mb: 5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#000000', letterSpacing: '-0.02em' }}>
            ניהול פניות
          </Typography>
          <Typography variant="body2" sx={{ color: '#6b7280', mt: 0.5, fontWeight: 500 }}>
            צפייה, סינון וניהול של כל פניות התמיכה במערכת
          </Typography>
        </Box>
        {role === 'customer' && (
          <Button 
            variant="contained" 
            onClick={() => navigate("/tickets/new")}
            sx={{ 
              bgcolor: '#064e3b', 
              '&:hover': { bgcolor: '#065f46' },
              borderRadius: '10px',
              px: 4,
              py: 1.2,
              fontWeight: 700,
              boxShadow: 'none',
              textTransform: 'none'
            }}
          >
            + פנייה חדשה
          </Button>
        )}
      </Box>

      {/* אזור חיפוש */}
      <Paper elevation={0} sx={{ p: 3, mb: 4, borderRadius: '16px', border: '1px solid #e5e7eb', bgcolor: '#f9fafb' }}>
        <SearchTickets 
          tickets={data || []}
          onSearch={(filtered) => {
            setFilteredTickets(filtered);
          }}
          onSearchTermChange={setSearchTerm}
        />
        {displayTickets.length === 0 && (data || []).length > 0 ? (
          <Alert severity="info" sx={{ mt: 2, borderRadius: '10px' }}>לא נמצאו פניות התואמות את הסינון</Alert>
        ) : (
          <Typography variant="caption" sx={{ display: 'block', mt: 2, color: '#6b7280', fontWeight: 500 }}>
            מוצגות {displayTickets.length} מתוך {(data || []).length} פניות
          </Typography>
        )}
      </Paper>

      {/* רשימת פניות */}
      {displayTickets.length === 0 ? (
        <Paper sx={{ p: 8, textAlign: 'center', borderRadius: '20px', border: '1px dashed #e5e7eb', bgcolor: '#ffffff' }}>
          <Typography variant="h2" sx={{ mb: 2 }}>
            {role === 'customer' ? '📝' : role === 'agent' ? '📋' : '📊'}
          </Typography>
          <Typography variant="h5" sx={{ color: '#000000', mb: 2, fontWeight: 700 }}>
            {(searchTerm || displayTickets.length === 0) ? 'לא נמצאו פניות' : 
             role === 'customer' ? 'אין לך פניות עדיין' :
             role === 'agent' ? 'אין פניות שהוקצו אליך' :
             'אין פניות במערכת'}
          </Typography>
          <Typography variant="body1" sx={{ color: '#6b7280', mb: 3 }}>
            {searchTerm ? 'נסה לשנות את מונח החיפוש או הסינונים' :
             role === 'customer' ? 'צור פנייה חדשה כדי להתחיל' :
             role === 'agent' ? 'המתן להקצאת פניות מהמנהל' :
             'לקוחות יכולים ליצור פניות חדשות'}
          </Typography>
          {role === 'customer' && !searchTerm && (
            <Button 
              variant="contained" 
              onClick={() => navigate('/tickets/new')}
              sx={{ 
                bgcolor: '#064e3b', 
                '&:hover': { bgcolor: '#065f46' },
                borderRadius: '10px',
                px: 4,
                fontWeight: 700,
                boxShadow: 'none'
              }}
            >
              ➕ צור פנייה חדשה
            </Button>
          )}
        </Paper>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          {displayTickets.map((ticket: TicketModel) => (
            <TicketComponent key={ticket.id} ticket={ticket} />
          ))}
        </Box>
      )}
    </Container>
  );
});

export default AllTickets;
