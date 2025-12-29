import { observer } from "mobx-react-lite";
import { useQuery } from "@tanstack/react-query";
import { Paper, Typography, Box } from "@mui/material";
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
        <Paper sx={{ mt: 2.5, p: 1.875, borderRadius: 0.5 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>📊 עדיפויות קיימות:</Typography>
            {prioritiesStore.priorities.length === 0 ? (
                <Typography sx={{ color: '#999' }}>אין עדיפויות</Typography>
            ) : (
                <Box component="ul" sx={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {prioritiesStore.priorities.map((priority) => (
                        <Box component="li" key={priority.id} sx={{ p: 1, backgroundColor: '#f5f5f5', borderRadius: 0.5 }}>
                            <Typography><strong>{priority.name}</strong> (ID: {priority.id})</Typography>
                        </Box>
                    ))}
                </Box>
            )}
        </Paper>
    );
});

export default PrioritiesList;
