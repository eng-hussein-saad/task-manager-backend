export interface User {
  user_id: number;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  created_at?: string;
  updated_at?: string;
}

export interface Task {
  task_id: number;
  task_title: string;
  task_description: string | null;
  is_read: boolean;
  user_id: number | null;
  created_at?: string;
  updated_at?: string;
}

export interface JwtPayloadData {
  user_id: number;
  email: string;
}
