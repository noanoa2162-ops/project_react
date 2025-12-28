import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { observer } from "mobx-react-lite";
import authStore from "../store/auth.store";
import { newStatuses } from "../services/api.service";
import statusesStore from "../store/status.store";

interface addStatusProps {

}
const AddStatus: React.FC<addStatusProps> = observer(() => {
    const queryClient = useQueryClient();
    const [statusName, setStatusName] = useState<string>('');
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const { mutate: addNewStatus, isPending } = useMutation({
        mutationFn: async (name: string) => {
            return await newStatuses(name, authStore.token!);
        },
        onSuccess: (newStatus) => {
            statusesStore.addStatus(newStatus);
            // רענון שאילתת הסטטוסים
            queryClient.invalidateQueries({ queryKey: ["statuses"] });
            // ניקוי input
            setStatusName("");
            setErrorMessage(null);
            setSuccessMessage("סטטוס חדש הוסף בהצלחה!");
            setTimeout(() => {
                setSuccessMessage(null);
            }, 2000);
        },
        onError: (error) => {
            console.error("Error adding status:", error);
            setErrorMessage("שגיאה בהוספת הסטטוס");
        }
    });
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage(null);
        
        if (!statusName.trim()) {
            setErrorMessage("שם הסטטוס לא יכול להיות ריק");
            return;
        }

        // בדיקה אם השם כבר קיים
        const exists = statusesStore.statuses.some(
            (s) => s.name.toLowerCase() === statusName.toLowerCase()
        );

        if (exists) {
            setErrorMessage(`סטטוס בשם "${statusName}" כבר קיים`);
            return;
        }

        addNewStatus(statusName);
    };

    return (
        <div style={{ marginTop: '20px', padding: '15px', border: '1px solid #ccc', borderRadius: '4px' }}>
            <h3>הוסף סטטוס חדש</h3>
            <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px' }}>
                <input
                    type="text"
                    value={statusName}
                    onChange={(e) => setStatusName(e.target.value)}
                    placeholder="הכנס שם סטטוס"
                    style={{ flex: 1, padding: '8px' }}
                />
                <button 
                    type="submit" 
                    disabled={isPending} 
                    style={{ padding: '8px 16px', backgroundColor: '#2196F3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    {isPending ? "מוסיף..." : "הוסף"}
                </button>
            </form>
            {successMessage && <p style={{ color: 'green', marginTop: '10px', fontWeight: 'bold' }}>✓ {successMessage}</p>}
            {errorMessage && <p style={{ color: 'red', marginTop: '10px', fontWeight: 'bold' }}>✗ {errorMessage}</p>}
        </div>
    );
});

export default AddStatus;