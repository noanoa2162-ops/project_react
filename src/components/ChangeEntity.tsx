import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { observer } from "mobx-react-lite";
import { Snackbar, Alert, TextField, MenuItem } from "@mui/material";
import type { Ticket } from "../models";

interface ChangeEntityProps<T extends { id: number | string; name: string }> {
    ticketId: number;
    currentValueId: number | string;
    options: T[];
    onUpdate: (id: string, value: any) => Promise<Ticket>;
    onSuccess: (updatedTicket: Ticket) => void;
    label: string;
    successMsg: string;
    queryKey: string;
}

const ChangeEntity = observer(<T extends { id: number | string; name: string }>({
    ticketId,
    currentValueId,
    options,
    onUpdate,
    onSuccess,
    label,
    successMsg,
    queryKey
}: ChangeEntityProps<T>) => {
    const [selectedValue, setSelectedValue] = useState<number | string>(currentValueId);
    const [showSuccess, setShowSuccess] = useState(false);
    const queryClient = useQueryClient();

    const { mutate: update } = useMutation({
        mutationFn: async (newValue: number | string) => {
            return await onUpdate(String(ticketId), newValue);
        },
        onSuccess: (updatedTicket) => {
            onSuccess(updatedTicket);
            setSelectedValue(currentValueId); // This will be updated by parent re-render or local state
            setShowSuccess(true);
            queryClient.invalidateQueries({ queryKey: [queryKey] });
        }
    });

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const value = (event.target as HTMLInputElement).value;
        if (!value) return;
        const newValue = isNaN(Number(value)) ? value : parseInt(value, 10);
        setSelectedValue(newValue);
        update(newValue);
    };

    return (
        <>
            <TextField
                select
                size="small"
                value={String(selectedValue)}
                onChange={handleChange}
                sx={{ marginTop: 1, width: '100%' }}
            >
                <MenuItem value="">{label}</MenuItem>
                {options.map((opt) => (
                    <MenuItem key={opt.id} value={String(opt.id)}>
                        {opt.name}
                    </MenuItem>
                ))}
            </TextField>
            
            <Snackbar 
                open={showSuccess} 
                autoHideDuration={3000} 
                onClose={() => setShowSuccess(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={() => setShowSuccess(false)} severity="success" sx={{ width: '100%' }}>
                    ✅ {successMsg}
                </Alert>
            </Snackbar>
        </>
    );
});

export default ChangeEntity;
