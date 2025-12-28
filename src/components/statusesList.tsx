import { observer } from "mobx-react-lite";
import { useQuery } from "@tanstack/react-query";
import statusesStore from "../store/status.store";
import authStore from "../store/auth.store";
import { getStatuses } from "../services/api.service";

const StatusesList: React.FC = observer(() => {
    // טעינה מהשרת בפעם הראשונה
    useQuery({
        queryKey: ["statuses"],
        queryFn: async () => {
            const data = await getStatuses(authStore.token!);
            statusesStore.setStatuses(data);
            return data;
        },
        staleTime: Infinity
    });
    return (
        <div style={{ marginTop: '20px', padding: '15px', border: '1px solid #ddd', borderRadius: '4px' }}>
            <h3>סטטוסים קיימים:</h3>
            {statusesStore.statuses.length === 0 ? (
                <p style={{ color: '#999' }}>אין סטטוסים</p>
            ) : (
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {statusesStore.statuses.map((status) => (
                        <li key={status.id} style={{ padding: '8px', backgroundColor: '#f5f5f5', marginBottom: '5px', borderRadius: '4px' }}>
                            <strong>{status.name}</strong> (ID: {status.id})
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
});

export default StatusesList;
