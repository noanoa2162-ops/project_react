import { useMutation, useQueryClient } from "@tanstack/react-query";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import { Snackbar, Alert, TextField, MenuItem } from "@mui/material";
import { assignTo } from "../services/api.service";
import authStore from "../store/auth.store";
import ticketsStore from "../store/tickets.store";
import usersStore from "../store/users.store";
import type { User } from "../models";

interface ToAgentProps {
    ticketId: number;
    currentAssignedTo: number | null;
}

const ToAgent: React.FC<ToAgentProps> = observer(({ ticketId, currentAssignedTo }) => {
    const [selectedAgent, setSelectedAgent] = useState<string>(currentAssignedTo ? String(currentAssignedTo) : "");
    const [showSuccess, setShowSuccess] = useState(false);
    const queryClient = useQueryClient();
    
    // קבלת סוכנים מ-store (observer יראה עדכונים)
    const agents = usersStore.users.length > 0 
        ? usersStore.users.filter(user => user.role === "agent")
        : [];
    
    const { mutate: updateAssignment, isPending } = useMutation({
        mutationFn: async (newAssignedTo: number) => {
            return await assignTo(String(ticketId), newAssignedTo, authStore.token!);
        },
        onSuccess: (updatedTicket) => {
            // עדכון הטיקט בstore עם כל הנתונים החדשים
            const enrichedTicket = {
                ...updatedTicket,
                assigned_to_name: usersStore.getUserNameById(updatedTicket.assigned_to) || updatedTicket.assigned_to_name
            };
            ticketsStore.updateTicketById(enrichedTicket);
            setSelectedAgent(String(updatedTicket.assigned_to || ""));
            setShowSuccess(true);
            
            // עדכן את הקאש של React Query
            queryClient.invalidateQueries({ queryKey: ["tickets"] });
        }
    });

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const value = (event.target as HTMLInputElement).value;
        if (!value) return;
        const newAssignedTo = parseInt(value, 10);
        setSelectedAgent(value);
        updateAssignment(newAssignedTo);
    };

    return (
        <>
            <TextField
                select
                size="small"
                value={selectedAgent}
                onChange={handleChange}
                disabled={isPending}
                sx={{ marginTop: 1, width: '100%' }}
            >
                <MenuItem value="">בחר סוכן</MenuItem>
                {agents.map((agent: User) => (
                    <MenuItem key={agent.id} value={String(agent.id)}>
                        {agent.name}
                    </MenuItem>
                ))}
            </TextField>
            
            <Snackbar 
                open={showSuccess} 
                autoHideDuration={3000} 
                onClose={() => setShowSuccess(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={() => setShowSuccess(false)} severity="success" sx={{ width: '100%' }}>
                    ✅ הסוכן השתנה בהצלחה!
                </Alert>
            </Snackbar>
        </>
    );
});

export default ToAgent;
