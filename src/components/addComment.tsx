import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { observer } from "mobx-react-lite";
import { Paper, Typography, Box, TextField, Button } from "@mui/material";
import { addCommentToTicket } from "../services/api.service";
import authStore from "../store/auth.store";

interface AddCommentProps {
    ticketId: number;
}

const AddComment: React.FC<AddCommentProps> = observer(({ ticketId }) => {
    const [commentText, setCommentText] = useState<string>("");
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const queryClient = useQueryClient();

    const { mutate: addComment, isPending } = useMutation({
        mutationFn: async (content: string) => {
            return await addCommentToTicket(String(ticketId), content, authStore.token!);
        },
        onSuccess: () => {
            setCommentText("");
            setErrorMsg(null);
            queryClient.invalidateQueries({ queryKey: ["comments", ticketId] });
        },
        onError: () => {
            setErrorMsg("שגיאה בשליחת התגובה. נסה שוב.");
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!commentText.trim()) {
            setErrorMsg("לא ניתן לשלוח תגובה ריקה");
            return;
        }
        if (commentText.length < 2) {
            setErrorMsg("התגובה קצרה מדי");
            return;
        }
        addComment(commentText);
    };

    return (
        <Paper elevation={0} sx={{ p: 4, borderRadius: '20px', bgcolor: '#ffffff', border: '1px solid #e5e7eb' }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, color: '#000000' }}>הוסף תגובה חדשה</Typography>
            <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <TextField
                    value={commentText}
                    onChange={(e) => {
                        setCommentText(e.target.value);
                        if (errorMsg) setErrorMsg(null);
                    }}
                    placeholder="כתוב כאן את תגובתך..."
                    multiline
                    rows={3}
                    disabled={isPending}
                    error={!!errorMsg}
                    helperText={errorMsg}
                    fullWidth
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            borderRadius: '12px',
                            bgcolor: '#f9fafb',
                            fontSize: '1rem',
                            '& fieldset': { borderColor: errorMsg ? '#d32f2f' : '#e5e7eb' },
                            '&:hover fieldset': { borderColor: errorMsg ? '#d32f2f' : '#d1d5db' },
                            '&.Mui-focused fieldset': { borderColor: errorMsg ? '#d32f2f' : '#064e3b' },
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
                        px: 4,
                        py: 1.2,
                        borderRadius: '10px',
                        fontSize: '0.95rem',
                        fontWeight: 700,
                        bgcolor: '#064e3b',
                        '&:hover': { bgcolor: '#065f46' },
                        boxShadow: 'none',
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
