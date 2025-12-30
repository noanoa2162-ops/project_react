import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { observer } from "mobx-react-lite";
import { Paper, Typography, Box, TextField, Button, Alert } from "@mui/material";

interface AddEntityProps<T> {
    title: string;
    placeholder: string;
    successMsg: string;
    errorMsg: string;
    onAdd: (name: string) => Promise<T>;
    onSuccess: (entity: T) => void;
    checkExists: (name: string) => boolean;
    existsMsg: string;
    queryKey: string;
}

const AddEntity = observer(<T,>({
    title,
    placeholder,
    successMsg,
    errorMsg,
    onAdd,
    onSuccess,
    checkExists,
    existsMsg,
    queryKey
}: AddEntityProps<T>) => {
    const queryClient = useQueryClient();
    const [name, setName] = useState<string>("");
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const { mutate: addNew, isPending } = useMutation({
        mutationFn: async (name: string) => {
            return await onAdd(name);
        },
        onSuccess: (newEntity) => {
            onSuccess(newEntity);
            queryClient.invalidateQueries({ queryKey: [queryKey] });
            setName("");
            setErrorMessage(null);
            setSuccessMessage(successMsg);
            setTimeout(() => setSuccessMessage(null), 2000);
        },
        onError: () => {
            setErrorMessage(errorMsg);
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage(null);
        
        if (!name.trim()) {
            setErrorMessage("השדה לא יכול להיות ריק");
            return;
        }

        if (checkExists(name)) {
            setErrorMessage(existsMsg);
            return;
        }

        addNew(name);
    };

    return (
        <Paper sx={{ marginTop: '20px', padding: '15px' }}>
            <Typography variant="h6">{title}</Typography>
            <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <TextField
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={placeholder}
                    disabled={isPending}
                    fullWidth
                    size="small"
                />
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
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

export default AddEntity;
