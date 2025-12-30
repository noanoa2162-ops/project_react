import { observer } from "mobx-react-lite";
import { useQuery } from "@tanstack/react-query";
import { Paper, Typography, Box } from "@mui/material";

interface EntityListProps<T extends { id: number | string; name: string }> {
    title: string;
    emptyMsg: string;
    queryKey: string;
    fetchFn: () => Promise<T[]>;
    onFetchSuccess: (data: T[]) => void;
    entities: T[];
    icon: string;
}

const EntityList = observer(<T extends { id: number | string; name: string }>({
    title,
    emptyMsg,
    queryKey,
    fetchFn,
    onFetchSuccess,
    entities,
    icon
}: EntityListProps<T>) => {
    useQuery({
        queryKey: [queryKey],
        queryFn: async () => {
            const data = await fetchFn();
            onFetchSuccess(data);
            return data;
        },
        staleTime: Infinity
    });

    return (
        <Paper sx={{ mt: 2.5, p: 1.875, borderRadius: 0.5 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>{icon} {title}:</Typography>
            {entities.length === 0 ? (
                <Typography sx={{ color: '#999' }}>{emptyMsg}</Typography>
            ) : (
                <Box component="ul" sx={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {entities.map((entity) => (
                        <Box component="li" key={entity.id} sx={{ p: 1, backgroundColor: '#f5f5f5', borderRadius: 0.5 }}>
                            <Typography><strong>{entity.name}</strong> (ID: {entity.id})</Typography>
                        </Box>
                    ))}
                </Box>
            )}
        </Paper>
    );
});

export default EntityList;
