import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { observer } from "mobx-react-lite";
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
            ticketsStore.updateTicketById(updatedTicket);
            setSelectedPriority(updatedTicket.priority_id || currentPriorityId);
            alert('✅ העדיפות השתנתה בהצלחה!');
        }
    });

    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const value = event.target.value;
        if (!value) return;
        const newPriorityId = parseInt(value, 10);
        setSelectedPriority(newPriorityId);
        updatePriority(newPriorityId);
    };

    return (
        <div style={{marginTop: '10px'}}>
            <select value={String(selectedPriority)} onChange={handleChange} style={{padding: '8px', borderRadius: '4px', border: '1px solid #ccc', cursor: 'pointer'}}>
                <option value="">בחר עדיפות</option>
                {priorities.map((priority: Priority) => (
                    <option key={priority.id} value={String(priority.id)}>
                        {priority.name}
                    </option>
                ))}
            </select>
        </div>
    );
});

export default ChangePriority;