/*
  # Add Education Pathway System

  1. New Tables
    - `student_pathways` - Tracks student's chosen educational path
      - `id` (uuid, primary key)
      - `student_id` (uuid, foreign key to students)
      - `pathway_type` (text) - 'JC', 'Polytechnic', or 'ITE'
      - `institution_name` (text) - specific JC/Poly/ITE name
      - `course_name` (text) - specific course chosen
      - `year_started` (integer)
      - `created_at` (timestamptz)
  
  2. Changes
    - Add `selected_career` (text) to students table for career outfit
    - Add `pathway_completed` (boolean) to track if pathway is set
  
  3. Security
    - Enable RLS on student_pathways table
    - Add policies for authenticated users to manage their own pathways
*/

CREATE TABLE IF NOT EXISTS student_pathways (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid REFERENCES students(id) ON DELETE CASCADE NOT NULL,
  pathway_type text NOT NULL CHECK (pathway_type IN ('JC', 'Polytechnic', 'ITE')),
  institution_name text NOT NULL,
  course_name text,
  year_started integer DEFAULT EXTRACT(YEAR FROM CURRENT_DATE),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE student_pathways ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own pathways"
  ON student_pathways FOR SELECT
  TO authenticated
  USING (auth.uid() = student_id);

CREATE POLICY "Users can insert own pathways"
  ON student_pathways FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Users can update own pathways"
  ON student_pathways FOR UPDATE
  TO authenticated
  USING (auth.uid() = student_id)
  WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Users can delete own pathways"
  ON student_pathways FOR DELETE
  TO authenticated
  USING (auth.uid() = student_id);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'students' AND column_name = 'selected_career'
  ) THEN
    ALTER TABLE students ADD COLUMN selected_career text DEFAULT NULL;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'students' AND column_name = 'pathway_completed'
  ) THEN
    ALTER TABLE students ADD COLUMN pathway_completed boolean DEFAULT false;
  END IF;
END $$;