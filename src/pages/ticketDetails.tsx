import { useLocation, useParams } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { useQuery } from "@tanstack/react-query";
import type { Ticket } from "../models";
import authStore from "../store/auth.store";
import ticketsStore from "../store/tickets.store";
import usersStore from "../store/users.store";
import statusesStore from "../store/status.store";
import prioritiesStore from "../store/priorities.store";
import { getStatuses, getPriorities, getUsers } from "../services/api.service";
import ChangePriority from "../components/changePriority";
import ChangeStatus from "../components/changStatus";
import ToAgent from "../components/toAgent";

interface TicketDetailsProps {

}
const TicketDetails: React.FC<TicketDetailsProps> = observer(() => {
  const {id} = useParams<{ id: string }>();

  const role = authStore.currentUser?.role;
  const {state} = useLocation();

  const currentTicket = state as Ticket;
  // קבלת הטיקט מ-store אם הוא שם (כדי לראות עדכונים)
  const ticketFromStore = ticketsStore.tickets.find(t => t.id === currentTicket?.id) || currentTicket;
  
  const createdByName = usersStore.getUserNameById(ticketFromStore?.created_by);

  // טעינת סטטוסים
  useQuery({
    queryKey: ["statuses"],
    queryFn: async () => {
      const data = await getStatuses(authStore.token!);
      statusesStore.setStatuses(data);
      return data;
    },
    staleTime: 0,
    gcTime: Infinity,
    refetchOnWindowFocus: true
  });

  // טעינת עדיפויות ועדכון ה-store
  useQuery({
    queryKey: ["priorities"],
    queryFn: async () => {
      const data = await getPriorities(authStore.token!);
      prioritiesStore.setPriorities(data);
      return data;
    },
    staleTime: 0,
    gcTime: Infinity,
    refetchOnWindowFocus: true
  });

  // טעינת סוכנים ועדכון ה-store
  useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const data = await getUsers(authStore.token!);
      usersStore.setUsers(data);
      return data;
    },
    staleTime: 0,
    gcTime: Infinity,
    refetchOnWindowFocus: true
  });
  
  
  return (<div style={{ width: '500px', margin: 'auto' }}>
    <div>id:{id}</div>
    <div>subjet:{ticketFromStore?.subject}</div>
    <div>description:{ticketFromStore?.description}</div>

    <div>priority:{ticketFromStore?.priority_name}
      {role === "admin" && <ChangePriority ticketId={ticketFromStore?.id || 0} currentPriorityId={ticketFromStore?.priority_id || 0} />}
    </div>
    <div>status:{ticketFromStore?.status_name}
      {(role === "admin" || role === "agent") && <ChangeStatus ticketId={ticketFromStore?.id || 0} currentStatusId={ticketFromStore?.status_id || 0} />}
    </div>
    <div>created at:{ticketFromStore?.created_at ? new Date(ticketFromStore.created_at).toLocaleString('he-IL', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }) : ''}</div>
    {(role === "admin" || role === "agent") && <div>ע"י מי נוצר:{createdByName}</div>}
    {role === "admin" && <div>משויך ל:{ticketFromStore?.assigned_to_name || "לא משויך"}
      <ToAgent ticketId={ticketFromStore?.id || 0} currentAssignedTo={ticketFromStore?.assigned_to || null} />
    </div>}

  </div>);
});
export default TicketDetails;