import type { Ticket as TicketModel } from "../models";
import { Link } from "react-router-dom";
import { observer } from "mobx-react-lite";
import authStore from "../store/auth.store";
import usersStore from "../store/users.store";

interface TicketProps {
  ticket: TicketModel;
}   
const Ticket: React.FC<TicketProps> = observer(({ ticket }) => {
  const role = authStore.currentUser?.role;
  const assignedToName = usersStore.getUserNameById(ticket.assigned_to);
    
  return (
    <div style={{border: '1px solid #ccc', padding: '15px', margin: '10px', borderRadius: '5px'}}>
      <h3>{ticket.subject}</h3>
      <p><strong>תיאור:</strong> {ticket.description}</p>
      <p><strong>עדיפות:</strong> {ticket.priority_name}</p>
      <p><strong>סטטוס:</strong> {ticket.status_name}</p>
      <p><strong>תאריך יצירה:</strong> {new Date(ticket.created_at).toLocaleString('he-IL', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}</p>
     {(role==='admin' || role === 'agent') && <p><strong>נוצר על ידי:</strong> {usersStore.getUserNameById(ticket.created_by)}</p>}
      {role === 'admin' && <p><strong>משויך ל:</strong> {assignedToName}</p>}
      
      <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
        <Link 
          to={`/tickets/${ticket.id}/details`} 
          state={{ ...ticket }}
          style={{ 
            padding: '8px 16px', 
            backgroundColor: '#3498db', 
            color: 'white', 
            textDecoration: 'none', 
            borderRadius: '4px',
            fontSize: '14px'
          }}
        >
          📋 פרטי הטיקט
        </Link>
        <Link 
          to={`/tickets/${ticket.id}/comments`} 
          state={{ ...ticket }}
          style={{ 
            padding: '8px 16px', 
            backgroundColor: '#9b59b6', 
            color: 'white', 
            textDecoration: 'none', 
            borderRadius: '4px',
            fontSize: '14px'
          }}
        >
          💬 תגובות
        </Link>
      </div>
    </div>
  );
});
export default Ticket;