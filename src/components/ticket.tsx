import type { Ticket as TicketModel } from "../models";
import { Link } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Button, 
  Chip, 
  Divider, 
  Stack,
  Tooltip,
  Avatar
} from "@mui/material";
import { 
  AccessTime as TimeIcon, 
  Person as PersonIcon, 
  AssignmentInd as AgentIcon,
  PriorityHigh as PriorityIcon,
  Info as InfoIcon
} from "@mui/icons-material";
import authStore from "../store/auth.store";
import usersStore from "../store/users.store";

interface TicketProps {
  ticket: TicketModel;
}   

const Ticket: React.FC<TicketProps> = observer(({ ticket }) => {
  const role = authStore.currentUser?.role;
  const assignedToName = ticket.assigned_to_name || usersStore.getUserNameById(ticket.assigned_to);
  
  // פונקציה לקבלת צבע לפי סטטוס
  const getStatusColor = (status: string | null) => {
    switch (status?.toLowerCase()) {
      case 'open': return 'success';
      case 'closed': return 'error';
      case 'pending': return 'warning';
      default: return 'default';
    }
  };

  // פונקציה לקבלת צבע לפי עדיפות
  const getPriorityColor = (priority: string | null) => {
    switch (priority?.toLowerCase()) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'info';
      default: return 'default';
    }
  };

  return (
    <Card 
      sx={{ 
        borderRadius: '16px',
        transition: 'all 0.2s ease',
        border: '1px solid #e5e7eb',
        boxShadow: 'none',
        '&:hover': {
          borderColor: '#064e3b',
          bgcolor: '#f9fafb'
        }
      }}
    >
      <CardContent sx={{ p: 3 }}>
        {/* כותרת ומזהה */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 700, 
                color: '#000000',
                mb: 0.5,
                lineHeight: 1.2
              }}
            >
              {ticket.subject}
            </Typography>
            <Typography variant="caption" sx={{ color: '#9ca3af', fontWeight: 500 }}>
              #ID: {ticket.id}
            </Typography>
          </Box>
          <Stack direction="row" spacing={1}>
            <Chip 
              label={ticket.priority_name || 'ללא עדיפות'} 
              size="small" 
              sx={{ 
                fontWeight: 700,
                bgcolor: ticket.priority_name === 'High' ? '#fef2f2' : '#f3f4f6',
                color: ticket.priority_name === 'High' ? '#991b1b' : '#374151',
                border: '1px solid transparent'
              }}
            />
            <Chip 
              label={ticket.status_name || 'ללא סטטוס'} 
              size="small" 
              variant="outlined"
              sx={{ 
                fontWeight: 700,
                borderColor: '#e5e7eb',
                color: '#4b5563'
              }}
            />
          </Stack>
        </Box>

        {/* תיאור */}
        <Typography 
          variant="body2" 
          sx={{ 
            color: '#555', 
            mb: 3,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            minHeight: '40px'
          }}
        >
          {ticket.description}
        </Typography>

        <Divider sx={{ mb: 2 }} />

        {/* מידע נוסף */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center', justifyContent: 'space-between' }}>
          <Stack direction="row" spacing={2} alignItems="center">
            {/* יוצר הכרטיס */}
            {(role === 'admin' || role === 'agent') && (
              <Tooltip title="יוצר הפנייה">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Avatar sx={{ width: 24, height: 24, bgcolor: '#e3f2fd', color: '#1976d2' }}>
                    <PersonIcon sx={{ fontSize: 16 }} />
                  </Avatar>
                  <Typography variant="caption" sx={{ fontWeight: 500 }}>
                    {ticket.created_by_name || usersStore.getUserNameById(ticket.created_by)}
                  </Typography>
                </Box>
              </Tooltip>
            )}

            {/* תאריך */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary' }}>
              <TimeIcon sx={{ fontSize: 16 }} />
              <Typography variant="caption">
                {new Date(ticket.created_at).toLocaleDateString('he-IL')}
              </Typography>
            </Box>

            {/* משויך ל (רק למנהל) */}
            {role === 'admin' && assignedToName && (
              <Tooltip title="סוכן מטפל">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <AgentIcon sx={{ fontSize: 16, color: '#2ecc71' }} />
                  <Typography variant="caption" sx={{ color: '#27ae60', fontWeight: 500 }}>
                    {assignedToName}
                  </Typography>
                </Box>
              </Tooltip>
            )}
          </Stack>

          <Link 
            to={`/tickets/${ticket.id}`} 
            state={{ ...ticket }}
            style={{ textDecoration: 'none' }}
          >
            <Button 
              variant="contained" 
              size="small"
              startIcon={<InfoIcon />}
              sx={{ 
                borderRadius: '8px',
                textTransform: 'none',
                boxShadow: 'none',
                '&:hover': { boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }
              }}
            >
              פרטים ותגובות
            </Button>
          </Link>
        </Box>
      </CardContent>
    </Card>
  );
});

export default Ticket;