import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { observer } from "mobx-react-lite";
import { Paper, Typography, Box, TextField, Button } from "@mui/material";
import authStore from "../store/auth.store";
import { addCommentToTicket } from "../services/api.service";

interface AddCommentProps {
    ticketId: number;
}

const AddComment: React.FC<AddCommentProps> = observer(({ ticketId }) => {
    const [commentText, setCommentText] = useState<string>("");
    const queryClient = useQueryClient();

    const { mutate: addComment, isPending } = useMutation({
        mutationFn: async (content: string) => {
            return await addCommentToTicket(String(ticketId), content, authStore.token!);
        },
        onSuccess: () => {
            // ניקוי ה-input
            setCommentText("");
            // רענון רשימת התגובות
            queryClient.invalidateQueries({ queryKey: ["comments", ticketId] });
        },
        onError: (error) => {
            console.error("Error adding comment:", error);
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!commentText.trim()) return;
        addComment(commentText);
    };

    return (
        <Paper elevation={0} sx={{ p: 4, borderRadius: '24px', bgcolor: '#f8fafc', border: '1px solid #e2e8f0' }}>
            <Typography variant="h5" sx={{ fontWeight: 800, mb: 3, color: '#334155' }}>הוסף תגובה חדשה</Typography>
            <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <TextField
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="כתוב כאן את תגובתך..."
                    multiline
                    rows={3}
                    disabled={isPending}
                    fullWidth
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            borderRadius: '16px',
                            bgcolor: '#fff',
                            fontSize: '1.1rem',
                            '& fieldset': { borderWidth: '1px' },
                        }
                    }}
                />
                <Button
                    type="submit"
                    disabled={isPending}
                    variant="contained"
                    size="medium"
                    sx={{ 
                        alignSelf: 'flex-end',
                        px: 5,
                        py: 1.2,
                        borderRadius: '12px',
                        fontSize: '1rem',
                        fontWeight: 800,
                        boxShadow: '0 6px 12px rgba(0,0,0,0.08)',
                        textTransform: 'none'
                    }}
                >
                    {isPending ? "שולח..." : "שלח תגובה"}
                </Button>
            </Box>
        </Paper>
    );
});

export default AddComment;
