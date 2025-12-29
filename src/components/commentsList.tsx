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
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, color: '#000000' }}>
                תגובות ({comments.length})
            </Typography>
            {comments.length === 0 ? (
                <Paper sx={{ p: 4, textAlign: 'center', borderRadius: '16px', bgcolor: '#ffffff', border: '1px dashed #e5e7eb' }}>
                    <Typography variant="body1" sx={{ color: '#9ca3af' }}>אין תגובות עדיין. היה הראשון להגיב!</Typography>
                </Paper>
            ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                    {comments.map((comment: Comment) => (
                        <Paper
                            key={comment.id}
                            elevation={0}
                            sx={{
                                p: 3,
                                borderRadius: '12px',
                                backgroundColor: '#ffffff',
                                border: '1px solid #f3f4f6',
                                transition: 'all 0.2s ease',
                                '&:hover': { 
                                    borderColor: '#e5e7eb',
                                    bgcolor: '#f9fafb'
                                }
                            }}
                        >
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                                <Typography sx={{ fontSize: '0.95rem', fontWeight: 700, color: '#064e3b' }}>
                                    {comment.author_name}
                                </Typography>
                                <Typography sx={{ fontSize: '0.8rem', color: '#9ca3af', fontWeight: 500 }}>
                                    {new Date(comment.created_at).toLocaleString('he-IL')}
                                </Typography>
                            </Box>
                            <Typography sx={{ fontSize: '1rem', color: '#374151', lineHeight: 1.6 }}>
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
