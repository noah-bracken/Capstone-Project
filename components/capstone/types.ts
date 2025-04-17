export type ClassType = {
    class_id: string;
    class_name: string;
    teacher_id: number;
    created_at: string;
  };
  
  export interface ClassData extends ClassType {
    students: { user_id: number; first_name: string; last_name: string }[];
  }

  export type AttendanceRecord = {
    user_id: number;
    first_name: string;
    last_name: string;
    status: 'present' | 'absent' | 'late';
  };

  export type Session = {
    session_id: number;
    generated_at: string;
  };
  