import { useState } from "react";
import { observer } from "mobx-react-lite";
import type { Ticket } from "../models";
import statusesStore from "../store/status.store";
import prioritiesStore from "../store/priorities.store";
import usersStore from "../store/users.store";
import authStore from "../store/auth.store";
import { Box, TextField, MenuItem, Button, Typography } from "@mui/material";

interface SearchTicketsProps {
  tickets: Ticket[];
  onSearch: (filtered: Ticket[]) => void;
  onSearchTermChange?: (term: string) => void;
}

const SearchTickets: React.FC<SearchTicketsProps> = observer(({ tickets, onSearch, onSearchTermChange }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [selectedPriority, setSelectedPriority] = useState<string>('');
  const [selectedAgent, setSelectedAgent] = useState<string>('');
  
  const role = authStore.currentUser?.role;
  const agents = usersStore.users.filter(u => u.role === 'agent');

  // פונקציה מרכזית לסינון
  const applyFilters = (
    query: string = searchQuery,
    status: string = selectedStatus,
    priority: string = selectedPriority,
    agent: string = selectedAgent
  ) => {
    let filtered = [...tickets];

    // סינון לפי חיפוש טקסט
    if (query.trim() !== '') {
      filtered = filtered.filter((ticket: Ticket) =>
        ticket.subject?.toLowerCase().includes(query.toLowerCase()) ||
        ticket.description?.toLowerCase().includes(query.toLowerCase()) ||
        ticket.id?.toString().includes(query)
      );
    }

    // סינון לפי סטטוס
    if (status !== '') {
      filtered = filtered.filter((ticket: Ticket) => 
        ticket.status_name?.toLowerCase() === status.toLowerCase()
      );
    }

    // סינון לפי עדיפות
    if (priority !== '') {
      filtered = filtered.filter((ticket: Ticket) => 
        ticket.priority_name?.toLowerCase() === priority.toLowerCase()
      );
    }

    // סינון לפי Agent (רק למנהל)
    if (agent !== '' && role === 'admin') {
      if (agent === 'unassigned') {
        filtered = filtered.filter((ticket: Ticket) => 
          !ticket.assigned_to || ticket.assigned_to === null
        );
      } else {
        const agentId = parseInt(agent);
        filtered = filtered.filter((ticket: Ticket) => 
          ticket.assigned_to === agentId
        );
      }
    }

    onSearch(filtered);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    
    // עדכן את מונח החיפוש אם יש callback
    if (onSearchTermChange) {
      onSearchTermChange(query);
    }
    
    applyFilters(query, selectedStatus, selectedPriority, selectedAgent);
  };

  const handleStatusChange = (status: string) => {
    setSelectedStatus(status);
    applyFilters(searchQuery, status, selectedPriority, selectedAgent);
  };

  const handlePriorityChange = (priority: string) => {
    setSelectedPriority(priority);
    applyFilters(searchQuery, selectedStatus, priority, selectedAgent);
  };

  const handleAgentChange = (agent: string) => {
    setSelectedAgent(agent);
    applyFilters(searchQuery, selectedStatus, selectedPriority, agent);
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedStatus('');
    setSelectedPriority('');
    setSelectedAgent('');
    if (onSearchTermChange) {
      onSearchTermChange('');
    }
    // מחזיר את כל הפניות
    onSearch(tickets);
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h6" sx={{ mb: 2, color: '#2c3e50', fontWeight: 'bold' }}>
        🔍 חיפוש וסינון פניות
      </Typography>
      
      {/* חיפוש טקסט */}
      <TextField
        fullWidth
        type="text"
        placeholder="חפש לפי מזהה, כותרת או תיאור..."
        value={searchQuery}
        onChange={(e) => handleSearchChange(e.target.value)}
        sx={{ mb: 2 }}
        variant="outlined"
        size="small"
      />

      {/* פילטרים */}
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: role === 'admin' ? 'repeat(auto-fit, minmax(200px, 1fr))' : 'repeat(2, 1fr)',
        gap: 2,
        mb: 2
      }}>
        {/* סינון לפי סטטוס */}
        <TextField
          select
          label="🔄 סטטוס"
          value={selectedStatus}
          onChange={(e) => handleStatusChange(e.target.value)}
          variant="outlined"
          size="small"
          fullWidth
        >
          <MenuItem value="">כל הסטטוסים</MenuItem>
          {statusesStore.statuses.map(status => (
            <MenuItem key={status.id} value={status.name}>
              {status.name}
            </MenuItem>
          ))}
        </TextField>

        {/* סינון לפי עדיפות */}
        <TextField
          select
          label="⭐ עדיפות"
          value={selectedPriority}
          onChange={(e) => handlePriorityChange(e.target.value)}
          variant="outlined"
          size="small"
          fullWidth
        >
          <MenuItem value="">כל העדיפויות</MenuItem>
          {prioritiesStore.priorities.map(priority => (
            <MenuItem key={priority.id} value={priority.name}>
              {priority.name}
            </MenuItem>
          ))}
        </TextField>

        {/* סינון לפי Agent - רק למנהל */}
        {role === 'admin' && (
          <TextField
            select
            label="👤 סוכן"
            value={selectedAgent}
            onChange={(e) => handleAgentChange(e.target.value)}
            variant="outlined"
            size="small"
            fullWidth
          >
            <MenuItem value="">כל הסוכנים</MenuItem>
            <MenuItem value="unassigned">לא משויך</MenuItem>
            {agents.map(agent => (
              <MenuItem key={agent.id} value={String(agent.id)}>
                {agent.name}
              </MenuItem>
            ))}
          </TextField>
        )}
      </Box>

      {/* כפתור איפוס */}
      {(searchQuery || selectedStatus || selectedPriority || selectedAgent) && (
        <Button
          onClick={resetFilters}
          variant="contained"
          color="error"
          size="small"
        >
          🔄 אפס סינון
        </Button>
      )}
    </Box>
  );
});

export default SearchTickets;
