
import type { Comment } from "./comment";

export interface Ticket {
  id: number,
  subject: string,
  description: string,
  status_id: number | null,
  priority_id: number | null,
  status_name: string | null,
  priority_name: string | null,
  created_by: number;
  assigned_to: number | null;
  assigned_to_name: string | null;
  created_at: string;
  updated_at: string | null;
  created_by_name: string;
  created_by_email: string;
  assigned_to_email: string | null;
  comments: Comment[]
}



