import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { observer } from "mobx-react-lite";
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
        <div style={{ marginTop: '20px', padding: '15px', border: '1px solid #ccc', borderRadius: '4px' }}>
            <h3>הוסף תגובה</h3>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="כתוב תגובה..."
                    style={{ 
                        padding: '10px', 
                        borderRadius: '4px', 
                        border: '1px solid #ccc',
                        fontFamily: 'Arial',
                        minHeight: '80px',
                        resize: 'vertical'
                    }}
                    disabled={isPending}
                />
                <button
                    type="submit"
                    disabled={isPending}
                    style={{
                        padding: '10px 15px',
                        backgroundColor: '#4CAF50',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        opacity: isPending ? 0.6 : 1
                    }}
                >
                    {isPending ? "שולח..." : "שלח תגובה"}
                </button>
            </form>
        </div>
    );
});

export default AddComment;
