import { useMutation, useQuery } from "@tanstack/react-query";
import { observer } from "mobx-react-lite";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { getPriorities, newTicket } from "../services/api.service";
import authStore from "../store/auth.store";
import ticketsStore from "../store/tickets.store";
import prioritiesStore from "../store/priorities.store";
import type { Priority } from "../models";
import { Container, Box, TextField, MenuItem, Button, Typography, Paper, Alert } from "@mui/material";
import { useState } from "react";

interface NewTicketFormData {
  subject: string;
  description: string;
  priority_id: number;
}

const NewTicket = observer(() => {
  const navigate = useNavigate();
  const [showSuccess, setShowSuccess] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset } = useForm<NewTicketFormData>({
    defaultValues: {
      subject: "",
      description: "",
      priority_id: 1
    }
  });

  // טעינת עדיפויות
  useQuery({
    queryKey: ["priorities"],
    queryFn: async () => {
      const data = await getPriorities(authStore.token!);
      prioritiesStore.setPriorities(data);
      return data;
    },
    staleTime: Infinity,
    enabled: !!authStore.token
  });

  // יצירת טיקט חדש
  const { mutate: createTicket, isPending } = useMutation({
    mutationFn: async (formData: NewTicketFormData) => {
      return await newTicket(
        formData.subject,
        formData.description,
        formData.priority_id,
        authStore.token!
      );
    },
    onSuccess: (newTicketData) => {
      // הוספה לstore
      ticketsStore.addTicket(newTicketData);
      
      // ניקוי הטופס
      reset();
      
      // הצגת הודעת הצלחה
      setShowSuccess(true);
      
      // הפניה לדף הבית (Dashboard) אחרי 2 שניות
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    },
    onError: (error) => {
      console.error("Error creating ticket:", error);
    }
  });

  const onSubmit = (data: NewTicketFormData) => {
    createTicket(data);
  };

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      {showSuccess && (
        <Alert severity="success" sx={{ mb: 3, fontSize: '1rem' }}>
          ✅ כרטיס נוצר בהצלחה! מעביר אותך לדף הבית...
        </Alert>
      )}
      <Paper sx={{ p: 4, boxShadow: 2 }}>
        <Typography variant="h4" component="h1" sx={{ mb: 4, fontWeight: 'bold', color: '#2c3e50' }}>
          📝 יצירת כרטיס חדש
        </Typography>
        
        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* שדה הנושא */}
          <TextField
            label="נושא"
            placeholder="כתוב נושא לכרטיס"
            fullWidth
            disabled={isPending}
            {...register("subject", {
              required: "נושא הוא שדה חובה",
              minLength: { value: 3, message: "נושא חייב להיות לפחות 3 תווים" }
            })}
            error={!!errors.subject}
            helperText={errors.subject?.message}
            variant="outlined"
          />

          {/* שדה התיאור */}
          <TextField
            label="תיאור"
            placeholder="תאר את הבעיה או הבקשה"
            fullWidth
            multiline
            minRows={5}
            disabled={isPending}
            {...register("description", {
              required: "תיאור הוא שדה חובה",
              minLength: { value: 10, message: "תיאור חייב להיות לפחות 10 תווים" }
            })}
            error={!!errors.description}
            helperText={errors.description?.message}
            variant="outlined"
          />

          {/* שדה העדיפות */}
          <TextField
            select
            label="עדיפות"
            fullWidth
            disabled={isPending}
            defaultValue={1}
            {...register("priority_id", {
              required: "עדיפות היא שדה חובה"
            })}
            error={!!errors.priority_id}
            helperText={errors.priority_id?.message}
            variant="outlined"
          >
            {prioritiesStore.priorities.map((priority: Priority) => (
              <MenuItem key={priority.id} value={priority.id}>
                {priority.name}
              </MenuItem>
            ))}
          </TextField>

          {/* כפתור שליחה */}
          <Button
            type="submit"
            variant="contained"
            color="success"
            size="large"
            disabled={isPending}
            sx={{ mt: 2 }}
          >
            {isPending ? "⏳ יוצר כרטיס..." : "✅ יצור כרטיס"}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
});

export default NewTicket;   