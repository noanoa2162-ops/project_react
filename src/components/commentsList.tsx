import { observer } from "mobx-react-lite";
import { useQuery } from "@tanstack/react-query";
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

    if (isLoading) return <p>טוען תגובות...</p>;
    if (isError) return <p style={{ color: 'red' }}>שגיאה בטעינת התגובות</p>;

    return (
        <div style={{ marginTop: '20px', padding: '15px', border: '1px solid #ddd', borderRadius: '4px' }}>
            <h3>תגובות ({comments.length})</h3>
            {comments.length === 0 ? (
                <p style={{ color: '#999' }}>אין תגובות עדיין</p>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {comments.map((comment: Comment) => (
                        <div key={comment.id} style={{ 
                            padding: '10px', 
                            backgroundColor: '#f5f5f5', 
                            borderLeft: '4px solid #2196F3',
                            borderRadius: '4px'
                        }}>
                            <div style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>
                                <strong>{comment.author_name}</strong> - {new Date(comment.created_at).toLocaleString('he-IL')}
                            </div>
                            <div>{comment.content}</div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
});

export default CommentsList;
