import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { observer } from "mobx-react-lite";
import { Paper, Typography, Box, TextField, Button, Alert } from "@mui/material";
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
            setSuccessMessage("עדיפות חדשה נוספה בהצלחה!");
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
        <Paper sx={{ marginTop: '20px', padding: '15px' }}>
            <Typography variant="h6">הוסף עדיפות חדשה</Typography>
            <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <TextField
                    type="text"
                    value={priorityName}
                    onChange={(e) => setPriorityName(e.target.value)}
                    placeholder="שם העדיפות החדשה"
                    disabled={isPending}
                    fullWidth
                    size="small"
                />
                <Button
                    type="submit"
                    variant="contained"
                    color="success"
                    disabled={isPending}
                    sx={{ minWidth: 'fit-content' }}
                >
                    {isPending ? "מוסיף..." : "הוסף"}
                </Button>
            </Box>
            {successMessage && (
                <Alert severity="success" sx={{ marginTop: '10px' }}>
                    ✓ {successMessage}
                </Alert>
            )}
            {errorMessage && (
                <Alert severity="error" sx={{ marginTop: '10px' }}>
                    ✗ {errorMessage}
                </Alert>
            )}
        </Paper>
    );
});

export default AddPriority;

