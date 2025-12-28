import { useMutation, useQuery } from "@tanstack/react-query";
import { observer } from "mobx-react-lite";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { getPriorities, newTicket } from "../services/api.service";
import authStore from "../store/auth.store";
import ticketsStore from "../store/tickets.store";
import prioritiesStore from "../store/priorities.store";
import type { Priority } from "../models";

interface NewTicketFormData {
  subject: string;
  description: string;
  priority_id: number;
}

const NewTicket = observer(() => {
  const navigate = useNavigate();
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
      
      // הפניה לדף הבית (Dashboard)
      navigate('/dashboard');
    },
    onError: (error) => {
      console.error("Error creating ticket:", error);
    }
  });

  const onSubmit = (data: NewTicketFormData) => {
    createTicket(data);
  };

  return (
    <div style={{ maxWidth: '500px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>יצירת כרטיס חדש</h2>
      
      <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        
        {/* שדה הנושא */}
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>נושא:</label>
          <input
            type="text"
            placeholder="כתוב נושא לכרטיס"
            {...register("subject", {
              required: "נושא הוא שדה חובה",
              minLength: { value: 3, message: "נושא חייב להיות לפחות 3 תווים" }
            })}
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '4px',
              border: errors.subject ? '2px solid red' : '1px solid #ccc',
              boxSizing: 'border-box'
            }}
            disabled={isPending}
          />
          {errors.subject && <p style={{ color: 'red', fontSize: '12px', margin: '5px 0 0 0' }}>{errors.subject.message}</p>}
        </div>

        {/* שדה התיאור */}
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>תיאור:</label>
          <textarea
            placeholder="תאר את הבעיה או הבקשה"
            {...register("description", {
              required: "תיאור הוא שדה חובה",
              minLength: { value: 10, message: "תיאור חייב להיות לפחות 10 תווים" }
            })}
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '4px',
              border: errors.description ? '2px solid red' : '1px solid #ccc',
              fontFamily: 'Arial',
              minHeight: '120px',
              resize: 'vertical',
              boxSizing: 'border-box'
            }}
            disabled={isPending}
          />
          {errors.description && <p style={{ color: 'red', fontSize: '12px', margin: '5px 0 0 0' }}>{errors.description.message}</p>}
        </div>

        {/* שדה העדיפות */}
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>עדיפות:</label>
          <select
            {...register("priority_id", {
              required: "עדיפות היא שדה חובה"
            })}
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '4px',
              border: errors.priority_id ? '2px solid red' : '1px solid #ccc',
              boxSizing: 'border-box'
            }}
            disabled={isPending}
          >
            <option value="">בחר עדיפות</option>
            {prioritiesStore.priorities.map((priority: Priority) => (
              <option key={priority.id} value={priority.id}>
                {priority.name}
              </option>
            ))}
          </select>
          {errors.priority_id && <p style={{ color: 'red', fontSize: '12px', margin: '5px 0 0 0' }}>{errors.priority_id.message}</p>}
        </div>

        {/* כפתור שליחה */}
        <button
          type="submit"
          disabled={isPending}
          style={{
            padding: '12px 20px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: isPending ? 'not-allowed' : 'pointer',
            fontSize: '16px',
            fontWeight: 'bold',
            opacity: isPending ? 0.6 : 1
          }}
        >
          {isPending ? "יוצר כרטיס..." : "יצור כרטיס"}
        </button>
      </form>
    </div>
  );
});

export default NewTicket;   