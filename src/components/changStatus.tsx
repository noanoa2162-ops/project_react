import { useMutation, useQueryClient } from "@tanstack/react-query";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import { Snackbar, Alert, TextField, MenuItem } from "@mui/material";
import { changeTicketStatus } from "../services/api.service";
import authStore from "../store/auth.store";
import ticketsStore from "../store/tickets.store";
import statusesStore from "../store/status.store";
import type { Status } from "../models";

interface changeStatusProps {
    ticketId: number;
    currentStatusId: number;
}
const ChangeStatus: React.FC<changeStatusProps> = observer(({ ticketId, currentStatusId }) => {
    const [selectedStatus, setSelectedStatus] = useState<number>(currentStatusId);
    const [showSuccess, setShowSuccess] = useState(false);
    const queryClient = useQueryClient();
    
    // קבלת סטטוסים מ-store (observer יראה עדכונים)
    const statuses = statusesStore.statuses.length > 0 
        ? statusesStore.statuses 
        : [];
    const {mutate: updateStatus} = useMutation({
        mutationFn: async (newStatusId: number) => {
            return await changeTicketStatus(String(ticketId), newStatusId, authStore.token!);
        },
        onSuccess: (updatedTicket) => {
            // עדכון הטיקט בstore עם כל הנתונים החדשים
            const enrichedTicket = {
                ...updatedTicket,
                status_name: statusesStore.statuses.find(s => s.id === updatedTicket.status_id)?.name || updatedTicket.status_name
            };
            ticketsStore.updateTicketById(enrichedTicket);
            setSelectedStatus(updatedTicket.status_id || currentStatusId);
            setShowSuccess(true);
            
            // עדכן את הקאש של React Query
            queryClient.invalidateQueries({ queryKey: ["tickets"] });
        }
    });
    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const value = (event.target as HTMLInputElement).value;
        if (!value) return;
        const newStatusId = parseInt(value, 10);
        setSelectedStatus(newStatusId);
        updateStatus(newStatusId);
    };

    return (
        <>
            <TextField
                select
                size="small"
                value={String(selectedStatus)}
                onChange={handleChange}
                sx={{ marginTop: 1, width: '100%' }}
            >
                <MenuItem value="">בחר סטטוס</MenuItem>
                {statuses.map((status: Status) => (
                    <MenuItem key={status.id} value={String(status.id)}>
                        {status.name}
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
                    ✅ הסטטוס השתנה בהצלחה!
                </Alert>
            </Snackbar>
        </>
    );
});

export default ChangeStatus;