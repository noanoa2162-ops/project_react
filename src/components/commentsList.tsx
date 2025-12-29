import { observer } from "mobx-react-lite";
import { useQuery } from "@tanstack/react-query";
import { Paper, Typography, Box, CircularProgress, Alert } from "@mui/material";
import authStore from "../store/auth.store";
import { getComments } from "../services/api.service";
import type { Comment } from "../models";

interface CommentsListProps {
    ticketId: number;
}

const CommentsList: React.FC<CommentsListProps> = observer(({ ticketId }) => {
    const { data: comments = [], isLoading, isError } = useQuery({
        queryKey: ["comments", ticketId],
        queryFn: async () => {
            return await getComments(String(ticketId), authStore.token!);
        },
        enabled: !!authStore.token
    });

    if (isLoading) return <CircularProgress />;
    if (isError) return <Alert severity="error">שגיאה בטעינת התגובות</Alert>;

    return (
        <Box sx={{ mt: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 800, mb: 3, color: '#334155' }}>
                תגובות ({comments.length})
            </Typography>
            {comments.length === 0 ? (
                <Paper sx={{ p: 4, textAlign: 'center', borderRadius: '20px', bgcolor: '#f8fafc', border: '2px dashed #e2e8f0' }}>
                    <Typography variant="body1" sx={{ color: '#94a3b8' }}>אין תגובות עדיין. היה הראשון להגיב!</Typography>
                </Paper>
            ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    {comments.map((comment: Comment) => (
                        <Paper
                            key={comment.id}
                            elevation={0}
                            sx={{
                                p: 3,
                                borderRadius: '16px',
                                backgroundColor: '#fff',
                                border: '1px solid #e2e8f0',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                                transition: 'transform 0.2s',
                                '&:hover': { transform: 'translateX(-5px)' }
                            }}
                        >
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                                <Typography sx={{ fontSize: '1rem', fontWeight: 800, color: '#3b82f6' }}>
                                    {comment.author_name}
                                </Typography>
                                <Typography sx={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 500 }}>
                                    {new Date(comment.created_at).toLocaleString('he-IL')}
                                </Typography>
                            </Box>
                            <Typography sx={{ fontSize: '1.1rem', color: '#1e293b', lineHeight: 1.5 }}>
                                {comment.content}
                            </Typography>
                        </Paper>
                    ))}
                </Box>
            )}
        </Box>
    );
});

export default CommentsList;
