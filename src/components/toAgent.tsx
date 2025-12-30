import { observer } from "mobx-react-lite";
import { assignTo } from "../services/api.service";
import ticketsStore from "../store/tickets.store";
import usersStore from "../store/users.store";
import authStore from "../store/auth.store";
import ChangeEntity from "./ChangeEntity";

interface ToAgentProps {
    ticketId: number;
    currentAssignedTo: number | null;
}

const ToAgent: React.FC<ToAgentProps> = observer(({ ticketId, currentAssignedTo }) => {
    const agents = usersStore.users.filter(user => user.role === "agent");

    return (
        <ChangeEntity
            ticketId={ticketId}
            currentValueId={currentAssignedTo || ""}
            options={agents}
            onUpdate={(id, val) => assignTo(id, val as number, authStore.token!)}
            onSuccess={(updatedTicket) => {
                const enrichedTicket = {
                    ...updatedTicket,
                    assigned_to_name: usersStore.getUserNameById(updatedTicket.assigned_to) || updatedTicket.assigned_to_name
                };
                ticketsStore.updateTicketById(enrichedTicket);
            }}
            label="בחר סוכן"
            successMsg="הסוכן השתנה בהצלחה!"
            queryKey="tickets"
        />
    );
});

export default ToAgent;
