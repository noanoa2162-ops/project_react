import { observer } from "mobx-react-lite";
import { useQuery } from "@tanstack/react-query";
import { Paper, Typography, Box } from "@mui/material";
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
        <Paper sx={{ mt: 2.5, p: 1.875, borderRadius: 0.5 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>🔄 סטטוסים קיימים:</Typography>
            {statusesStore.statuses.length === 0 ? (
                <Typography sx={{ color: '#999' }}>אין סטטוסים</Typography>
            ) : (
                <Box component="ul" sx={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {statusesStore.statuses.map((status) => (
                        <Box component="li" key={status.id} sx={{ p: 1, backgroundColor: '#f5f5f5', borderRadius: 0.5 }}>
                            <Typography><strong>{status.name}</strong> (ID: {status.id})</Typography>
                        </Box>
                    ))}
                </Box>
            )}
        </Paper>
    );
});

export default StatusesList;
