import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import authStore from "../store/auth.store";
import ticketsStore from "../store/tickets.store";
import { getTickets } from "../services/api.service";
import AddPriority from "../components/addPriority";
import AddStatus from "../components/addStatus";
import PrioritiesList from "../components/prioritiesList";
import StatusesList from "../components/statusesList";


const Dashboard = observer(() => {
  const navigate = useNavigate();
  const role = authStore.currentUser?.role;
  const name = authStore.currentUser?.name;

  // טעינת כרטיסים עם React Query (רק לשמירה ב-store)
  useQuery({
    queryKey: ["tickets"],
    queryFn: async () => {
      ticketsStore.setLoading(true);
      try {
        const data = await getTickets(authStore.token!);
        ticketsStore.getTickets(data);
        return data;
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

  if (ticketsStore.isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px' }}>
        <div style={{ fontSize: '48px', marginBottom: '20px' }}>⏳</div>
        <p style={{ fontSize: '18px', color: '#7f8c8d' }}>טוען...</p>
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

  return (
    <>
     
      <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
        <h1>שלום {name}</h1>
        
        <button onClick={() => navigate('/tickets')} style={{ padding: '10px 15px', marginBottom: '20px', fontSize: '16px', cursor: 'pointer', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '4px' }}>
          💼 לכל הכרטיסים
        </button>
        
        {role == 'customer' && (
          <div style={{ marginBottom: '20px' }}>
            <button onClick={() => navigate('/tickets/new')} style={{ padding: '10px 15px', backgroundColor: '#27ae60', color: 'white', fontSize: '16px', cursor: 'pointer', border: 'none', borderRadius: '4px' }}>
              ➕ צור כרטיס חדש
            </button>
          </div>
        )}

        {role == 'agent' && (
          <div style={{ marginBottom: '20px' }}>
            <button onClick={() => navigate('/tickets')} style={{ padding: '10px 15px', backgroundColor: '#e67e22', color: 'white', fontSize: '16px', cursor: 'pointer', border: 'none', borderRadius: '4px' }}>
              📋 הכרטיסים שלי
            </button>
          </div>
        )}

        {role == 'admin' && (
          <div style={{ marginTop: '40px', paddingTop: '20px', borderTop: '2px solid #bdc3c7' }}>
            <h2>⚙️ ניהול מערכת</h2>
            <AddPriority />
            <PrioritiesList />
            <AddStatus />
            <StatusesList />
          </div>
        )}
      </div>
    </>
  );
});


export default Dashboard;
