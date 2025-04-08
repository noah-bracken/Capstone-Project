export type ClassType = {
    class_id: string;
    class_name: string;
    teacher_id: number;
    created_at: string;
  };
  
  export interface ClassData extends ClassType {
    students: { user_id: number; first_name: string; last_name: string }[];
  }