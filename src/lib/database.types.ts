export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      students: {
        Row: {
          id: string
          full_name: string
          current_level: string
          school_name: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name: string
          current_level: string
          school_name: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string
          current_level?: string
          school_name?: string
          created_at?: string
          updated_at?: string
        }
      }
      academic_records: {
        Row: {
          id: string
          student_id: string
          subject_name: string
          grade: string | null
          score: number | null
          exam_type: string
          year: number
          term: number | null
          created_at: string
        }
        Insert: {
          id?: string
          student_id: string
          subject_name: string
          grade?: string | null
          score?: number | null
          exam_type: string
          year: number
          term?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          student_id?: string
          subject_name?: string
          grade?: string | null
          score?: number | null
          exam_type?: string
          year?: number
          term?: number | null
          created_at?: string
        }
      }
      subject_enrollments: {
        Row: {
          id: string
          student_id: string
          subject_name: string
          subject_type: string
          current_grade_estimate: string | null
          study_hours_per_week: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          student_id: string
          subject_name: string
          subject_type: string
          current_grade_estimate?: string | null
          study_hours_per_week?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          student_id?: string
          subject_name?: string
          subject_type?: string
          current_grade_estimate?: string | null
          study_hours_per_week?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      cca_records: {
        Row: {
          id: string
          student_id: string
          cca_name: string
          cca_category: string
          role: string
          participation_level: string
          achievements: string
          start_year: number
          end_year: number | null
          leaps_points: number
          created_at: string
        }
        Insert: {
          id?: string
          student_id: string
          cca_name: string
          cca_category: string
          role?: string
          participation_level?: string
          achievements?: string
          start_year: number
          end_year?: number | null
          leaps_points?: number
          created_at?: string
        }
        Update: {
          id?: string
          student_id?: string
          cca_name?: string
          cca_category?: string
          role?: string
          participation_level?: string
          achievements?: string
          start_year?: number
          end_year?: number | null
          leaps_points?: number
          created_at?: string
        }
      }
      simulations: {
        Row: {
          id: string
          student_id: string
          simulation_type: string
          scenario_description: string
          input_parameters: Json
          predicted_outcomes: Json
          confidence_score: number
          recommendations: Json
          created_at: string
        }
        Insert: {
          id?: string
          student_id: string
          simulation_type: string
          scenario_description: string
          input_parameters?: Json
          predicted_outcomes?: Json
          confidence_score?: number
          recommendations?: Json
          created_at?: string
        }
        Update: {
          id?: string
          student_id?: string
          simulation_type?: string
          scenario_description?: string
          input_parameters?: Json
          predicted_outcomes?: Json
          confidence_score?: number
          recommendations?: Json
          created_at?: string
        }
      }
      goals: {
        Row: {
          id: string
          student_id: string
          goal_type: string
          target_institution: string
          target_score: string | null
          target_year: number
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          student_id: string
          goal_type: string
          target_institution: string
          target_score?: string | null
          target_year: number
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          student_id?: string
          goal_type?: string
          target_institution?: string
          target_score?: string | null
          target_year?: number
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
