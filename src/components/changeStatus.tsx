import { observer } from "mobx-react-lite";
import { changeTicketStatus } from "../services/api.service";
import ticketsStore from "../store/tickets.store";
import statusesStore from "../store/status.store";
import authStore from "../store/auth.store";
import ChangeEntity from "./ChangeEntity";

interface changeStatusProps {
    ticketId: number;
    currentStatusId: number;
}

const ChangeStatus: React.FC<changeStatusProps> = observer(({ ticketId, currentStatusId }) => {
    return (
        <ChangeEntity
            ticketId={ticketId}
            currentValueId={currentStatusId}
            options={statusesStore.statuses}
            onUpdate={(id, val) => changeTicketStatus(id, val as number, authStore.token!)}
            onSuccess={(updatedTicket) => {
                const enrichedTicket = {
                    ...updatedTicket,
                    status_name: statusesStore.statuses.find(s => s.id === updatedTicket.status_id)?.name || updatedTicket.status_name
                };
                ticketsStore.updateTicketById(enrichedTicket);
            }}
            label="בחר סטטוס"
            successMsg="הסטטוס השתנה בהצלחה!"
            queryKey="tickets"
        />
    );
});

export default ChangeStatus;