import { useMutation } from "@tanstack/react-query";
import { observer } from "mobx-react-lite";
import { useState } from "react";
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
    
    // קבלת סטטוסים מ-store (observer יראה עדכונים)
    const statuses = statusesStore.statuses.length > 0 
        ? statusesStore.statuses 
        : [];
    const {mutate: updateStatus} = useMutation({
        mutationFn: async (newStatusId: number) => {
            return await changeTicketStatus(String(ticketId), newStatusId, authStore.token!);
        },
        onSuccess: (updatedTicket) => {
            ticketsStore.updateTicketById(updatedTicket);
            setSelectedStatus(updatedTicket.status_id || currentStatusId);
            alert('✅ הסטטוס השתנה בהצלחה!');
        }
    });
    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const value = event.target.value;
        if (!value) return;
        const newStatusId = parseInt(value, 10);
        setSelectedStatus(newStatusId);
        updateStatus(newStatusId);
    };

    return (
        <div style={{marginTop: '10px'}}>
            <select value={String(selectedStatus)} onChange={handleChange} style={{padding: '8px', borderRadius: '4px', border: '1px solid #ccc', cursor: 'pointer'}}>
                <option value="">בחר סטטוס</option>
                {statuses.map((status: Status) => (
                    <option key={status.id} value={String(status.id)}>
                        {status.name}
                    </option>
                ))}
            </select>
        </div>
    );
});

export default ChangeStatus;