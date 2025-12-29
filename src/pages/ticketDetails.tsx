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
    <Box sx={{ bgcolor: '#ffffff', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="lg">
        <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 3 }}>
          <Avatar sx={{ bgcolor: '#064e3b', width: 64, height: 64, boxShadow: '0 4px 12px rgba(6, 78, 59, 0.15)' }}>
            <TicketIcon sx={{ fontSize: 32, color: '#ffffff' }} />
          </Avatar>
          <Box>
            <Typography variant="h4" sx={{ color: '#000000', fontWeight: 800, fontSize: { xs: '1.8rem', md: '2.2rem' }, letterSpacing: '-0.02em' }}>
              פנייה #{id}
            </Typography>
            <Typography variant="body2" sx={{ color: '#6b7280', fontWeight: 500, letterSpacing: '0.01em' }}>
              מערכת ניהול פניות • Helpdesk Professional
            </Typography>
          </Box>
        </Box>
        
        <Grid container spacing={4}>
          {/* צד ימין - פרטי הפנייה */}
          <Grid size={{ xs: 12, md: 7 }}>
            <Card sx={{ borderRadius: '16px', overflow: 'hidden', boxShadow: 'none', border: '1px solid #e5e7eb' }}>
              <Box sx={{ p: 3, bgcolor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#000000', fontSize: '1.25rem' }}>
                  {ticketFromStore?.subject}
                </Typography>
              </Box>
              
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ mb: 4 }}>
                  <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
                    <DescIcon sx={{ color: '#064e3b', fontSize: 22 }} />
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#000000' }}>
                      תיאור הפנייה
                    </Typography>
                  </Stack>
                  <Paper elevation={0} sx={{ p: 3, bgcolor: '#ffffff', borderRadius: '12px', border: '1px solid #f3f4f6' }}>
                    <Typography variant="body1" sx={{ color: '#1f2937', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
                      {ticketFromStore?.description}
                    </Typography>
                  </Paper>
                </Box>

                <Divider sx={{ my: 4, borderColor: '#f3f4f6' }} />

                <Box>
                  <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 3 }}>
                    <ChatIcon sx={{ color: '#064e3b', fontSize: 22 }} />
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#000000' }}>
                      שיחה ותגובות
                    </Typography>
                  </Stack>
                  <Box>
                    <CommentsList ticketId={ticketFromStore?.id || 0} />
                    <Box sx={{ mt: 4 }}>
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
              <Card sx={{ p: 4, borderRadius: '20px', boxShadow: 'none', border: '1px solid #e5e7eb' }}>
                <Typography variant="overline" sx={{ fontWeight: 800, color: '#9ca3af', mb: 3, display: 'block', letterSpacing: '1.5px' }}>
                  סטטוס וניהול
                </Typography>
                
                <Stack spacing={4}>
                  <Box>
                    <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 700, color: '#374151' }}>
                      עדיפות
                    </Typography>
                    <Chip 
                      label={ticketFromStore?.priority_name} 
                      sx={{ 
                        fontWeight: 700, 
                        borderRadius: '10px', 
                        width: '100%', 
                        height: '48px', 
                        fontSize: '1rem',
                        bgcolor: ticketFromStore?.priority_name === 'High' ? '#fef2f2' : '#fffbeb',
                        color: ticketFromStore?.priority_name === 'High' ? '#991b1b' : '#92400e',
                        border: `1px solid ${ticketFromStore?.priority_name === 'High' ? '#fee2e2' : '#fef3c7'}`
                      }}
                    />
                    {role === "admin" && (
                      <Box sx={{ mt: 2 }}>
                        <ChangePriority 
                          ticketId={ticketFromStore?.id || 0} 
                          currentPriorityId={ticketFromStore?.priority_id || 0} 
                        />
                      </Box>
                    )}
                  </Box>

                  <Divider sx={{ borderColor: '#f3f4f6' }} />

                  <Box>
                    <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 700, color: '#374151' }}>
                      סטטוס נוכחי
                    </Typography>
                    <Chip 
                      label={ticketFromStore?.status_name} 
                      sx={{ 
                        fontWeight: 700, 
                        borderRadius: '10px', 
                        width: '100%', 
                        height: '48px', 
                        fontSize: '1rem',
                        bgcolor: ticketFromStore?.status_name === 'open' ? '#f0fdf4' : '#f9fafb',
                        color: ticketFromStore?.status_name === 'open' ? '#166534' : '#4b5563',
                        border: `1px solid ${ticketFromStore?.status_name === 'open' ? '#dcfce7' : '#e5e7eb'}`
                      }}
                    />
                    {(role === "admin" || role === "agent") && (
                      <Box sx={{ mt: 2 }}>
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
              <Card sx={{ p: 4, borderRadius: '20px', boxShadow: 'none', border: '1px solid #e5e7eb' }}>
                <Typography variant="overline" sx={{ fontWeight: 800, color: '#9ca3af', mb: 3, display: 'block', letterSpacing: '1.5px' }}>
                  פרטי מערכת
                </Typography>
                
                <Stack spacing={3.5}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                    <Avatar sx={{ width: 52, height: 52, bgcolor: '#f3f4f6', color: '#111827' }}>
                      <UserIcon sx={{ fontSize: 26 }} />
                    </Avatar>
                    <Box sx={{ minWidth: 0, flex: 1 }}>
                      <Typography variant="body2" sx={{ color: '#6b7280', fontWeight: 700, display: 'block', mb: 0.5 }}>לקוח</Typography>
                      <Typography variant="h6" sx={{ fontWeight: 800, color: '#000000', lineHeight: 1.2 }}>
                        {createdByName}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                    <Avatar sx={{ width: 52, height: 52, bgcolor: '#f3f4f6', color: '#111827' }}>
                      <DateIcon sx={{ fontSize: 26 }} />
                    </Avatar>
                    <Box sx={{ minWidth: 0, flex: 1 }}>
                      <Typography variant="body2" sx={{ color: '#6b7280', fontWeight: 700, display: 'block', mb: 0.5 }}>תאריך יצירה</Typography>
                      <Typography variant="h6" sx={{ fontWeight: 800, color: '#000000' }}>
                        {ticketFromStore?.created_at ? new Date(ticketFromStore.created_at).toLocaleDateString('he-IL') : '-'}
                      </Typography>
                    </Box>
                  </Box>

                  {role === "admin" && (
                    <>
                      <Divider sx={{ borderColor: '#f3f4f6' }} />
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                        <Avatar sx={{ width: 52, height: 52, bgcolor: '#f3f4f6', color: '#111827' }}>
                          <AgentIcon sx={{ fontSize: 26 }} />
                        </Avatar>
                        <Box sx={{ minWidth: 0, flex: 1 }}>
                          <Typography variant="body2" sx={{ color: '#6b7280', fontWeight: 700, display: 'block', mb: 0.5 }}>סוכן מטפל</Typography>
                          <Typography variant="h6" sx={{ fontWeight: 800, color: '#000000', lineHeight: 1.2 }}>
                            {ticketFromStore?.assigned_to_name || "לא משויך"}
                          </Typography>
                        </Box>
                      </Box>
                      <Box sx={{ mt: 2 }}>
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