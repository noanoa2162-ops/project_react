import { useLocation, useParams } from "react-router-dom";
import { observer } from "mobx-react-lite";
import type { Ticket } from "../models";
import ticketsStore from "../store/tickets.store";
import CommentsList from "../components/commentsList";
import AddComment from "../components/addComment";

const TicketComments: React.FC = observer(() => {
  const {id} = useParams<{ id: string }>();
  const {state} = useLocation();

  const currentTicket = state as Ticket;
  const ticketFromStore = ticketsStore.tickets.find(t => t.id === currentTicket?.id) || currentTicket;
  
  return (
    <div style={{ width: '500px', margin: 'auto', padding: '20px' }}>
      <h1>💬 תגובות - {ticketFromStore?.subject}</h1>
      
      <div style={{ marginTop: '20px' }}>
        <CommentsList ticketId={ticketFromStore?.id || 0} />
        <AddComment ticketId={ticketFromStore?.id || 0} />
      </div>
    </div>
  );
});

export default TicketComments;
