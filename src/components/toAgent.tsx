import { useMutation } from "@tanstack/react-query";
import { observer } from "mobx-react-lite";
import { useState } from "react";
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
    
    // קבלת סוכנים מ-store (observer יראה עדכונים)
    const agents = usersStore.users.length > 0 
        ? usersStore.users.filter(user => user.role === "agent")
        : [];
    
    const { mutate: updateAssignment, isPending } = useMutation({
        mutationFn: async (newAssignedTo: number) => {
            return await assignTo(String(ticketId), newAssignedTo, authStore.token!);
        },
        onSuccess: (updatedTicket) => {
            ticketsStore.updateTicketById(updatedTicket);
            setSelectedAgent(String(updatedTicket.assigned_to || ""));
            alert('✅ הסוכן השתנה בהצלחה!');
        }
    });

    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const value = event.target.value;
        if (!value) return;
        const newAssignedTo = parseInt(value, 10);
        setSelectedAgent(value);
        updateAssignment(newAssignedTo);
    };

    return (
        <div style={{ marginTop: '10px' }}>
            <select value={selectedAgent} onChange={handleChange} disabled={isPending} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', cursor: 'pointer' }}>
                <option value="">בחר סוכן</option>
                {agents.map((agent: User) => (
                    <option key={agent.id} value={String(agent.id)}>    
                        {agent.name}
                    </option>
                ))}
            </select>
        </div>
    );
});

export default ToAgent;
