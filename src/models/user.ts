export interface User {
  id: number;
  name: string;
  email: string;
  role: 'customer' | 'admin' |'agent';
  created_at: string;
}