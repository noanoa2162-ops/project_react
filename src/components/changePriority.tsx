import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { observer } from "mobx-react-lite";
import { Snackbar, Alert, TextField, MenuItem } from "@mui/material";
import { changeTicketSPriorities } from "../services/api.service";
import authStore from "../store/auth.store";
import ticketsStore from "../store/tickets.store";
import prioritiesStore from "../store/priorities.store";
import type { Priority } from "../models";

interface ChangePriorityProps {
    ticketId: number;
    currentPriorityId: number;
}

const ChangePriority: React.FC<ChangePriorityProps> = observer(({ ticketId, currentPriorityId }) => {
    const [selectedPriority, setSelectedPriority] = useState<number>(currentPriorityId);
    const [showSuccess, setShowSuccess] = useState(false);
    const queryClient = useQueryClient();
    
    // קבלת רשימת העדיפויות מ-store (observer יראה עדכונים)
    const priorities = prioritiesStore.priorities.length > 0 
        ? prioritiesStore.priorities 
        : [];

    // mutation לעדכון העדיפות
    const { mutate: updatePriority } = useMutation({
        mutationFn: async (newPriorityId: number) => {
            return await changeTicketSPriorities(String(ticketId), newPriorityId, authStore.token!);
        },
        onSuccess: (updatedTicket) => {
            // עדכון הטיקט בstore עם כל הנתונים החדשים
            const enrichedTicket = {
                ...updatedTicket,
                priority_name: prioritiesStore.priorities.find(p => p.id === updatedTicket.priority_id)?.name || updatedTicket.priority_name
            };
            ticketsStore.updateTicketById(enrichedTicket);
            setSelectedPriority(updatedTicket.priority_id || currentPriorityId);
            setShowSuccess(true);
            
            // עדכן את הקאש של React Query
            queryClient.invalidateQueries({ queryKey: ["tickets"] });
        }
    });

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const value = (event.target as HTMLInputElement).value;
        if (!value) return;
        const newPriorityId = parseInt(value, 10);
        setSelectedPriority(newPriorityId);
        updatePriority(newPriorityId);
    };

    return (
        <>
            <TextField
                select
                size="small"
                value={String(selectedPriority)}
                onChange={handleChange}
                sx={{ marginTop: 1, width: '100%' }}
            >
                <MenuItem value="">בחר עדיפות</MenuItem>
                {priorities.map((priority: Priority) => (
                    <MenuItem key={priority.id} value={String(priority.id)}>
                        {priority.name}
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
                    ✅ העדיפות השתנתה בהצלחה!
                </Alert>
            </Snackbar>
        </>
    );
});

export default ChangePriority;