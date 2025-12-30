import { observer } from "mobx-react-lite";
import { changeTicketSPriorities } from "../services/api.service";
import ticketsStore from "../store/tickets.store";
import prioritiesStore from "../store/priorities.store";
import authStore from "../store/auth.store";
import ChangeEntity from "./ChangeEntity";

interface ChangePriorityProps {
    ticketId: number;
    currentPriorityId: number;
}

const ChangePriority: React.FC<ChangePriorityProps> = observer(({ ticketId, currentPriorityId }) => {
    return (
        <ChangeEntity
            ticketId={ticketId}
            currentValueId={currentPriorityId}
            options={prioritiesStore.priorities}
            onUpdate={(id, val) => changeTicketSPriorities(id, val as number, authStore.token!)}
            onSuccess={(updatedTicket) => {
                const enrichedTicket = {
                    ...updatedTicket,
                    priority_name: prioritiesStore.priorities.find(p => p.id === updatedTicket.priority_id)?.name || updatedTicket.priority_name
                };
                ticketsStore.updateTicketById(enrichedTicket);
            }}
            label="בחר עדיפות"
            successMsg="העדיפות השתנתה בהצלחה!"
            queryKey="tickets"
        />
    );
});

export default ChangePriority;