import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { observer } from "mobx-react-lite";
import { newPriorities } from "../services/api.service";
import authStore from "../store/auth.store";
import prioritiesStore from "../store/priorities.store";

interface addPriorityProps {
}
const AddPriority: React.FC<addPriorityProps> = observer(() => {
    const queryClient = useQueryClient();
    const [priorityName, setPriorityName] = useState<string>("");
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const { mutate: addNewPriority, isPending } = useMutation({
        mutationFn: async (name: string) => {
            return await newPriorities(name, authStore.token!);
        },
        onSuccess: (newPriority) => {
            // עדכון ה-store
            prioritiesStore.addPriority(newPriority);
            // רענון שאילתת העדיפויות
            queryClient.invalidateQueries({ queryKey: ["priorities"] });
            
            // ניקוי input
            setPriorityName("");
            setErrorMessage(null);
            
            // הודעת הצלחה ל-2 שניות
            setSuccessMessage("עדיפות חדשה הוסוהה בהצלחה!");
            setTimeout(() => {
                setSuccessMessage(null);
            }, 2000);
        },
        onError: (error) => {
            console.error("Error adding priority:", error);
            setErrorMessage("שגיאה בהוספת העדיפות");
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage(null);
        
        if (!priorityName.trim()) {
            setErrorMessage("שם העדיפות לא יכול להיות ריק");
            return;
        }

        // בדיקה אם השם כבר קיים
        const exists = prioritiesStore.priorities.some(
            (p) => p.name.toLowerCase() === priorityName.toLowerCase()
        );

        if (exists) {
            setErrorMessage(`עדיפות בשם "${priorityName}" כבר קיימת`);
            return;
        }

        addNewPriority(priorityName);
    };

    return (
        <div style={{ marginTop: '20px', padding: '15px', border: '1px solid #ccc', borderRadius: '4px' }}>
            <h3>הוסף עדיפות חדשה</h3>
            <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px' }}>
                <input
                    type="text"
                    value={priorityName}
                    onChange={(e) => setPriorityName(e.target.value)}
                    placeholder="שם העדיפות החדשה"
                    style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', flex: 1 }}
                    disabled={isPending}
                />
                <button
                    type="submit"
                    style={{
                        padding: '8px 15px',
                        backgroundColor: '#4CAF50',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        opacity: isPending ? 0.6 : 1
                    }}
                    disabled={isPending}
                >
                    {isPending ? "מוסיף..." : "הוסף"}
                </button>
            </form>
            {successMessage && (
                <div style={{ marginTop: '10px', color: 'green', fontWeight: 'bold' }}>
                    ✓ {successMessage}
                </div>
            )}
            {errorMessage && (
                <div style={{ marginTop: '10px', color: 'red', fontWeight: 'bold' }}>
                    ✗ {errorMessage}
                </div>
            )}
        </div>
    );
});

export default AddPriority;

