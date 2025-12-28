import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { observer } from "mobx-react-lite";
import type { Ticket as TicketModel } from "../models";
import { getTickets } from "../services/api.service";
import authStore from "../store/auth.store";
import ticketsStore from "../store/tickets.store";
import TicketComponent from "../components/ticket";
import SearchTickets from "../components/searchTickets";
import { useQuery } from "@tanstack/react-query";

const AllTickets: React.FC = observer(() => {
  const navigate = useNavigate();
  const [filteredTickets, setFilteredTickets] = useState<TicketModel[]>([]);

  // בדוק אם יש token - אם לא, חזור ללוגין
  if (!authStore.token) {
    navigate('/login');
    return null;
  }

  const { data } = useQuery({
    queryKey: ["tickets"],
    queryFn: async () => {
      ticketsStore.setLoading(true);
      try {
        const ticketsData = await getTickets(authStore.token!);
        ticketsStore.getTickets(ticketsData);
        return ticketsData;
      } catch (err) {
        ticketsStore.setError(err instanceof Error ? err.message : 'שגיאה בטעינת כרטיסים');
        ticketsStore.setLoading(false);
        throw err;
      }
    },
    staleTime: 0,
    gcTime: Infinity,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true
  });

  // אתחל את filteredTickets בעם הכרטיסים בעת הטעינה הראשונה
  if (data && filteredTickets.length === 0) {
    setFilteredTickets(data);
  }

  if (ticketsStore.isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px' }}>
        <div style={{ fontSize: '48px', marginBottom: '20px' }}>⏳</div>
        <p style={{ fontSize: '18px', color: '#7f8c8d' }}>טוען כרטיסים...</p>
      </div>
    );
  }

  if (ticketsStore.error) {
    return (
      <div style={{ textAlign: 'center', padding: '100px' }}>
        <div style={{ fontSize: '48px', marginBottom: '20px' }}>❌</div>
        <p style={{ fontSize: '18px', color: '#e74c3c' }}>שגיאה: {ticketsStore.error}</p>
        <button 
          onClick={() => window.location.reload()} 
          style={{ marginTop: '20px', padding: '10px 20px', cursor: 'pointer', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '4px', fontSize: '16px' }}
        >
          נסה שוב
        </button>
      </div>
    );
  }

  const tickets = ticketsStore.tickets || [];
  
  // הצגת כרטיסים - או חיפוש אם יש, או את כל הכרטיסים
  const displayTickets = filteredTickets.length > 0 ? filteredTickets : tickets;

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ color: '#2c3e50', marginBottom: '20px' }}>📋 כל הכרטיסים</h1>

      {/* אזור חיפוש */}
      <div style={{ marginBottom: '30px', padding: '15px', backgroundColor: '#ecf0f1', borderRadius: '8px' }}>
        <SearchTickets 
          tickets={tickets}
          onSearch={setFilteredTickets}
        />
        {filteredTickets.length === 0 && tickets.length > 0 && filteredTickets !== tickets ? (
          <p style={{ color: '#e74c3c' }}>❌ לא נמצאו כרטיסים התואמים החיפוש</p>
        ) : (
          <p style={{ color: '#7f8c8d', fontSize: '14px' }}>
            מוצגים {displayTickets.length} מתוך {tickets.length} כרטיסים
          </p>
        )}
      </div>

      {/* רשימת כרטיסים */}
      {displayTickets.length === 0 ? (
        <div style={{
          backgroundColor: '#ecf0f1',
          padding: '40px',
          borderRadius: '8px',
          textAlign: 'center',
          color: '#7f8c8d'
        }}>
          <p style={{ fontSize: '18px' }}>😔 לא נמצאו כרטיסים</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '15px' }}>
          {displayTickets.map((ticket: TicketModel) => (
            <TicketComponent 
              key={ticket.id}
              ticket={ticket} 
            />
          ))}
        </div>
      )}
    </div>
  );
});

export default AllTickets;
