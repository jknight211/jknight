/*
  # Academic Digital Twin Database Schema

  ## Overview
  Creates a comprehensive database structure for the Academic Digital Twin application,
  enabling students to simulate academic outcomes and track their educational journey.

  ## 1. New Tables
  
  ### `students`
  Core student profile information
  - `id` (uuid, primary key) - References auth.users
  - `full_name` (text) - Student's full name
  - `current_level` (text) - Educational level (Secondary 1-4, JC 1-2, etc.)
  - `school_name` (text) - Current school
  - `created_at` (timestamptz) - Account creation timestamp
  - `updated_at` (timestamptz) - Last profile update

  ### `academic_records`
  Historical academic performance data
  - `id` (uuid, primary key)
  - `student_id` (uuid, foreign key) - Links to students table
  - `subject_name` (text) - Subject name (e.g., "Mathematics", "Pure History")
  - `grade` (text) - Grade achieved (e.g., "A1", "B3")
  - `score` (integer) - Numeric score if applicable
  - `exam_type` (text) - Type of examination (Mid-Year, Prelim, O-Level, etc.)
  - `year` (integer) - Year of examination
  - `term` (integer) - Term/Semester number
  - `created_at` (timestamptz)

  ### `subject_enrollments`
  Current subject combinations and enrollments
  - `id` (uuid, primary key)
  - `student_id` (uuid, foreign key)
  - `subject_name` (text) - Subject name
  - `subject_type` (text) - Pure/Combined/Higher/etc.
  - `current_grade_estimate` (text) - Current performance estimate
  - `study_hours_per_week` (numeric) - Weekly study time
  - `is_active` (boolean) - Currently enrolled
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### `cca_records`
  Co-Curricular Activities participation
  - `id` (uuid, primary key)
  - `student_id` (uuid, foreign key)
  - `cca_name` (text) - Name of CCA
  - `cca_category` (text) - Sports/Performing Arts/Clubs/Uniformed Groups
  - `role` (text) - Member/Leader/etc.
  - `participation_level` (text) - School/Zonal/National/International
  - `achievements` (text) - Notable achievements
  - `start_year` (integer)
  - `end_year` (integer, nullable)
  - `leaps_points` (integer) - Estimated LEAPS 2.0 points
  - `created_at` (timestamptz)

  ### `simulations`
  Academic simulation runs and scenarios
  - `id` (uuid, primary key)
  - `student_id` (uuid, foreign key)
  - `simulation_type` (text) - Type of simulation run
  - `scenario_description` (text) - What-if scenario details
  - `input_parameters` (jsonb) - Simulation input data
  - `predicted_outcomes` (jsonb) - Predicted results
  - `confidence_score` (numeric) - Prediction confidence (0-100)
  - `recommendations` (jsonb) - AI-generated recommendations
  - `created_at` (timestamptz)

  ### `goals`
  Student academic and career goals
  - `id` (uuid, primary key)
  - `student_id` (uuid, foreign key)
  - `goal_type` (text) - Course/University/Career/etc.
  - `target_institution` (text) - Desired institution/course
  - `target_score` (text) - Required L1R5/rank points/etc.
  - `target_year` (integer) - Target achievement year
  - `status` (text) - Active/Achieved/Modified
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ## 2. Security
  
  All tables have Row Level Security (RLS) enabled with policies that:
  - Allow authenticated students to view and manage only their own data
  - Prevent unauthorized access to other students' information
  - Ensure data privacy and security compliance

  ## 3. Important Notes
  
  - All foreign keys reference the students table which links to auth.users
  - JSONB fields allow flexible storage of complex simulation data
  - Timestamps use timestamptz for timezone-aware data
  - Indexes are created on frequently queried fields for performance
*/

-- Create students table
CREATE TABLE IF NOT EXISTS students (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  current_level text NOT NULL,
  school_name text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE students ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can view own profile"
  ON students FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Students can insert own profile"
  ON students FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Students can update own profile"
  ON students FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Create academic_records table
CREATE TABLE IF NOT EXISTS academic_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  subject_name text NOT NULL,
  grade text,
  score integer,
  exam_type text NOT NULL,
  year integer NOT NULL,
  term integer,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE academic_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can view own academic records"
  ON academic_records FOR SELECT
  TO authenticated
  USING (student_id = auth.uid());

CREATE POLICY "Students can insert own academic records"
  ON academic_records FOR INSERT
  TO authenticated
  WITH CHECK (student_id = auth.uid());

CREATE POLICY "Students can update own academic records"
  ON academic_records FOR UPDATE
  TO authenticated
  USING (student_id = auth.uid())
  WITH CHECK (student_id = auth.uid());

CREATE POLICY "Students can delete own academic records"
  ON academic_records FOR DELETE
  TO authenticated
  USING (student_id = auth.uid());

-- Create subject_enrollments table
CREATE TABLE IF NOT EXISTS subject_enrollments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  subject_name text NOT NULL,
  subject_type text NOT NULL,
  current_grade_estimate text,
  study_hours_per_week numeric DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE subject_enrollments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can view own enrollments"
  ON subject_enrollments FOR SELECT
  TO authenticated
  USING (student_id = auth.uid());

CREATE POLICY "Students can insert own enrollments"
  ON subject_enrollments FOR INSERT
  TO authenticated
  WITH CHECK (student_id = auth.uid());

CREATE POLICY "Students can update own enrollments"
  ON subject_enrollments FOR UPDATE
  TO authenticated
  USING (student_id = auth.uid())
  WITH CHECK (student_id = auth.uid());

CREATE POLICY "Students can delete own enrollments"
  ON subject_enrollments FOR DELETE
  TO authenticated
  USING (student_id = auth.uid());

-- Create cca_records table
CREATE TABLE IF NOT EXISTS cca_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  cca_name text NOT NULL,
  cca_category text NOT NULL,
  role text DEFAULT 'Member',
  participation_level text DEFAULT 'School',
  achievements text DEFAULT '',
  start_year integer NOT NULL,
  end_year integer,
  leaps_points integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE cca_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can view own CCA records"
  ON cca_records FOR SELECT
  TO authenticated
  USING (student_id = auth.uid());

CREATE POLICY "Students can insert own CCA records"
  ON cca_records FOR INSERT
  TO authenticated
  WITH CHECK (student_id = auth.uid());

CREATE POLICY "Students can update own CCA records"
  ON cca_records FOR UPDATE
  TO authenticated
  USING (student_id = auth.uid())
  WITH CHECK (student_id = auth.uid());

CREATE POLICY "Students can delete own CCA records"
  ON cca_records FOR DELETE
  TO authenticated
  USING (student_id = auth.uid());

-- Create simulations table
CREATE TABLE IF NOT EXISTS simulations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  simulation_type text NOT NULL,
  scenario_description text NOT NULL,
  input_parameters jsonb NOT NULL DEFAULT '{}',
  predicted_outcomes jsonb NOT NULL DEFAULT '{}',
  confidence_score numeric DEFAULT 0,
  recommendations jsonb DEFAULT '[]',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE simulations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can view own simulations"
  ON simulations FOR SELECT
  TO authenticated
  USING (student_id = auth.uid());

CREATE POLICY "Students can insert own simulations"
  ON simulations FOR INSERT
  TO authenticated
  WITH CHECK (student_id = auth.uid());

CREATE POLICY "Students can delete own simulations"
  ON simulations FOR DELETE
  TO authenticated
  USING (student_id = auth.uid());

-- Create goals table
CREATE TABLE IF NOT EXISTS goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  goal_type text NOT NULL,
  target_institution text NOT NULL,
  target_score text,
  target_year integer NOT NULL,
  status text DEFAULT 'Active',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE goals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can view own goals"
  ON goals FOR SELECT
  TO authenticated
  USING (student_id = auth.uid());

CREATE POLICY "Students can insert own goals"
  ON goals FOR INSERT
  TO authenticated
  WITH CHECK (student_id = auth.uid());

CREATE POLICY "Students can update own goals"
  ON goals FOR UPDATE
  TO authenticated
  USING (student_id = auth.uid())
  WITH CHECK (student_id = auth.uid());

CREATE POLICY "Students can delete own goals"
  ON goals FOR DELETE
  TO authenticated
  USING (student_id = auth.uid());

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_academic_records_student ON academic_records(student_id);
CREATE INDEX IF NOT EXISTS idx_subject_enrollments_student ON subject_enrollments(student_id);
CREATE INDEX IF NOT EXISTS idx_cca_records_student ON cca_records(student_id);
CREATE INDEX IF NOT EXISTS idx_simulations_student ON simulations(student_id);
CREATE INDEX IF NOT EXISTS idx_goals_student ON goals(student_id);