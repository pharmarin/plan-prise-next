export type UserType = {
  id: number;
  admin: boolean;
  first_name?: string;
  last_name?: string;
  display_name?: string;
  student: boolean;
  rpps?: number;
  email: string;
  created_at: string;
  updated_at: string;
  active_at?: string;
};

export type LoginCredentialsType = {
  email: string;
  password: string;
  remember?: boolean;
};
