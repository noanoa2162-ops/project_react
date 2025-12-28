import { observer } from "mobx-react-lite";
import { useQuery } from "@tanstack/react-query";
import prioritiesStore from "../store/priorities.store";
import authStore from "../store/auth.store";
import { getPriorities } from "../services/api.service";

const PrioritiesList: React.FC = observer(() => {
    // טעינה מהשרת בפעם הראשונה
    useQuery({
        queryKey: ["priorities"],
        queryFn: async () => {
            const data = await getPriorities(authStore.token!);
            prioritiesStore.setPriorities(data);
            return data;
        },
        staleTime: Infinity
    });
    return (
        <div style={{ marginTop: '20px', padding: '15px', border: '1px solid #ddd', borderRadius: '4px' }}>
            <h3>עדיפויות קיימות:</h3>
            {prioritiesStore.priorities.length === 0 ? (
                <p style={{ color: '#999' }}>אין עדיפויות</p>
            ) : (
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {prioritiesStore.priorities.map((priority) => (
                        <li key={priority.id} style={{ padding: '8px', backgroundColor: '#f5f5f5', marginBottom: '5px', borderRadius: '4px' }}>
                            <strong>{priority.name}</strong> (ID: {priority.id})
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
});

export default PrioritiesList;
