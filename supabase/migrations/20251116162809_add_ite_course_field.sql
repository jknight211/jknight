/*
  # Add ITE Course Field for ITE-to-Poly Pathway

  1. Changes
    - Add `ite_course_name` column to `student_pathways` table
    - Stores the ITE course name for students doing ITE-to-Poly progression
    - Existing `course_name` will store the Polytechnic course

  2. Notes
    - For ITE-only students: Only `course_name` is filled (ITE course)
    - For ITE-to-Poly students: Both `ite_course_name` (ITE course) and `course_name` (Poly course) are filled
    - For direct Poly/JC students: Only `course_name` is filled
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'student_pathways' AND column_name = 'ite_course_name'
  ) THEN
    ALTER TABLE student_pathways ADD COLUMN ite_course_name text;
  END IF;
END $$;