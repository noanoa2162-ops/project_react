import { useLocation, useParams } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { useQuery } from "@tanstack/react-query";
import type { Ticket } from "../models";
import authStore from "../store/auth.store";
import ticketsStore from "../store/tickets.store";
import usersStore from "../store/users.store";
import statusesStore from "../store/status.store";
import prioritiesStore from "../store/priorities.store";
import { getStatuses, getPriorities, getUsers } from "../services/api.service";
import ChangePriority from "../components/changePriority";
import ChangeStatus from "../components/changStatus";
import ToAgent from "../components/toAgent";
import CommentsList from "../components/commentsList";
import AddComment from "../components/addComment";
import { 
  Container, 
  Box, 
  Typography, 
  Paper, 
  Chip, 
  Card, 
  CardContent,
  Grid, 
  Divider, 
  Stack,
  Avatar
} from "@mui/material";
import { 
  ConfirmationNumber as TicketIcon,
  Description as DescIcon,
  Event as DateIcon,
  Person as UserIcon,
  SupportAgent as AgentIcon,
  Chat as ChatIcon
} from "@mui/icons-material";

interface TicketDetailsProps {

}
const TicketDetails: React.FC<TicketDetailsProps> = observer(() => {
  const {id} = useParams<{ id: string }>();

  const role = authStore.currentUser?.role;
  const {state} = useLocation();

  const currentTicket = state as Ticket;
  // קבלת הטיקט מ-store אם הוא שם (כדי לראות עדכונים)
  const ticketFromStore = ticketsStore.tickets.find(t => t.id === currentTicket?.id) || currentTicket;
  
  const createdByName = ticketFromStore?.created_by_name || usersStore.getUserNameById(ticketFromStore?.created_by);

  // טעינת סטטוסים
  useQuery({
    queryKey: ["statuses"],
    queryFn: async () => {
      const data = await getStatuses(authStore.token!);
      statusesStore.setStatuses(data);
      return data;
    },
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnWindowFocus: true
  });

  // טעינת עדיפויות ועדכון ה-store
  useQuery({
    queryKey: ["priorities"],
    queryFn: async () => {
      const data = await getPriorities(authStore.token!);
      prioritiesStore.setPriorities(data);
      return data;
    },
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnWindowFocus: true
  });

  // טעינת סוכנים ועדכון ה-store
  useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const data = await getUsers(authStore.token!);
      usersStore.setUsers(data);
      return data;
    },
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnWindowFocus: true
  });
  
  return (
    <Box sx={{ bgcolor: '#f4f7f9', minHeight: '100vh', py: 3 }}>
      <Container maxWidth="lg">
        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 3 }}>
          <Avatar sx={{ bgcolor: '#3498db', width: 60, height: 60, boxShadow: '0 4px 12px rgba(52, 152, 219, 0.2)' }}>
            <TicketIcon sx={{ fontSize: 32 }} />
          </Avatar>
          <Box>
            <Typography variant="h4" sx={{ color: '#2c3e50', fontWeight: 900, fontSize: { xs: '1.8rem', md: '2.2rem' } }}>
              פנייה #{id}
            </Typography>
            <Typography variant="body2" sx={{ color: '#7f8c8d', fontWeight: 500, opacity: 0.8 }}>
              מרכז ניהול פניות ותמיכה טכנית • מערכת Helpdesk
            </Typography>
          </Box>
        </Box>
        
        <Grid container spacing={4}>
          {/* צד ימין - פרטי הפנייה */}
          <Grid size={{ xs: 12, md: 7 }}>
            <Card sx={{ borderRadius: '20px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.05)' }}>
              <Box sx={{ p: 2.5, bgcolor: '#fff', borderBottom: '1px solid #f0f0f0' }}>
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#2c3e50', fontSize: '1.25rem' }}>
                  {ticketFromStore?.subject}
                </Typography>
              </Box>
              
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ mb: 3 }}>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
                    <DescIcon sx={{ color: '#3498db', fontSize: 20 }} />
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#34495e' }}>
                      תיאור הפנייה
                    </Typography>
                  </Stack>
                  <Paper elevation={0} sx={{ p: 2.5, bgcolor: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                    <Typography variant="body2" sx={{ color: '#1e293b', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                      {ticketFromStore?.description}
                    </Typography>
                  </Paper>
                </Box>

                <Divider sx={{ my: 3, opacity: 0.1 }} />

                <Box>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                    <ChatIcon sx={{ color: '#3498db', fontSize: 20 }} />
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#34495e' }}>
                      שיחה ותגובות
                    </Typography>
                  </Stack>
                  <Box>
                    <CommentsList ticketId={ticketFromStore?.id || 0} />
                    <Box sx={{ mt: 3 }}>
                      <AddComment ticketId={ticketFromStore?.id || 0} />
                    </Box>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* צד שמאל - סרגל צד */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Stack spacing={3}>
              {/* כרטיס סטטוס ועדיפות */}
              <Card sx={{ p: 4, borderRadius: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.05)' }}>
                <Typography variant="overline" sx={{ fontWeight: 800, color: '#94a3b8', mb: 2, display: 'block', letterSpacing: '1px' }}>
                  סטטוס וניהול
                </Typography>
                
                <Stack spacing={3}>
                  <Box>
                    <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 700, color: '#64748b' }}>
                      עדיפות
                    </Typography>
                    <Chip 
                      label={ticketFromStore?.priority_name} 
                      color={ticketFromStore?.priority_name === 'High' ? 'error' : 'warning'}
                      size="medium"
                      sx={{ fontWeight: 700, borderRadius: '8px', width: '100%', height: '45px', fontSize: '1rem' }}
                    />
                    {role === "admin" && (
                      <Box sx={{ mt: 1.5 }}>
                        <ChangePriority 
                          ticketId={ticketFromStore?.id || 0} 
                          currentPriorityId={ticketFromStore?.priority_id || 0} 
                        />
                      </Box>
                    )}
                  </Box>

                  <Divider />

                  <Box>
                    <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 700, color: '#64748b' }}>
                      סטטוס נוכחי
                    </Typography>
                    <Chip 
                      label={ticketFromStore?.status_name} 
                      variant="outlined"
                      color={ticketFromStore?.status_name === 'open' ? 'success' : 'default'}
                      size="medium"
                      sx={{ fontWeight: 700, borderRadius: '8px', width: '100%', height: '45px', fontSize: '1rem' }}
                    />
                    {(role === "admin" || role === "agent") && (
                      <Box sx={{ mt: 1.5 }}>
                        <ChangeStatus 
                          ticketId={ticketFromStore?.id || 0} 
                          currentStatusId={ticketFromStore?.status_id || 0} 
                        />
                      </Box>
                    )}
                  </Box>
                </Stack>
              </Card>

              {/* כרטיס מידע נוסף */}
              <Card sx={{ p: 4, borderRadius: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.05)' }}>
                <Typography variant="overline" sx={{ fontWeight: 800, color: '#94a3b8', mb: 2, display: 'block', letterSpacing: '1px' }}>
                  פרטי מערכת
                </Typography>
                
                <Stack spacing={3}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
                    <Avatar sx={{ width: 48, height: 48, bgcolor: '#eff6ff', color: '#3b82f6' }}>
                      <UserIcon sx={{ fontSize: 24 }} />
                    </Avatar>
                    <Box sx={{ minWidth: 0, flex: 1 }}>
                      <Typography variant="body2" sx={{ color: '#94a3b8', fontWeight: 700, display: 'block', mb: 0.2 }}>לקוח</Typography>
                      <Typography variant="h6" sx={{ fontWeight: 800, color: '#1e293b', lineHeight: 1.2 }}>
                        {createdByName}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
                    <Avatar sx={{ width: 48, height: 48, bgcolor: '#f0fdf4', color: '#22c55e' }}>
                      <DateIcon sx={{ fontSize: 24 }} />
                    </Avatar>
                    <Box sx={{ minWidth: 0, flex: 1 }}>
                      <Typography variant="body2" sx={{ color: '#94a3b8', fontWeight: 700, display: 'block', mb: 0.2 }}>תאריך יצירה</Typography>
                      <Typography variant="h6" sx={{ fontWeight: 800, color: '#1e293b' }}>
                        {ticketFromStore?.created_at ? new Date(ticketFromStore.created_at).toLocaleDateString('he-IL') : '-'}
                      </Typography>
                    </Box>
                  </Box>

                  {role === "admin" && (
                    <>
                      <Divider />
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
                        <Avatar sx={{ width: 48, height: 48, bgcolor: '#fff7ed', color: '#f59e0b' }}>
                          <AgentIcon sx={{ fontSize: 24 }} />
                        </Avatar>
                        <Box sx={{ minWidth: 0, flex: 1 }}>
                          <Typography variant="body2" sx={{ color: '#94a3b8', fontWeight: 700, display: 'block', mb: 0.2 }}>סוכן מטפל</Typography>
                          <Typography variant="h6" sx={{ fontWeight: 800, color: '#1e293b', lineHeight: 1.2 }}>
                            {ticketFromStore?.assigned_to_name || "לא משויך"}
                          </Typography>
                        </Box>
                      </Box>
                      <Box sx={{ mt: 1.5 }}>
                        <ToAgent 
                          ticketId={ticketFromStore?.id || 0} 
                          currentAssignedTo={ticketFromStore?.assigned_to || null} 
                        />
                      </Box>
                    </>
                  )}
                </Stack>
              </Card>
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
});
export default TicketDetails;