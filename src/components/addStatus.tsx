import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { observer } from "mobx-react-lite";
import { Paper, Typography, Box, TextField, Button, Alert } from "@mui/material";
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
        <Paper sx={{ marginTop: '20px', padding: '15px' }}>
            <Typography variant="h6">הוסף סטטוס חדש</Typography>
            <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <TextField
                    type="text"
                    value={statusName}
                    onChange={(e) => setStatusName(e.target.value)}
                    placeholder="הכנס שם סטטוס"
                    fullWidth
                    size="small"
                />
                <Button 
                    type="submit" 
                    disabled={isPending}
                    variant="contained"
                    color="primary"
                    sx={{ minWidth: 'fit-content' }}
                >
                    {isPending ? "מוסיף..." : "הוסף"}
                </Button>
            </Box>
            {successMessage && <Alert severity="success" sx={{ marginTop: '10px' }}>✓ {successMessage}</Alert>}
            {errorMessage && <Alert severity="error" sx={{ marginTop: '10px' }}>✗ {errorMessage}</Alert>}
        </Paper>
    );
});

export default AddStatus;