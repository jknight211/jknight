/*
  # Add ITE-to-Poly Progression Option

  1. Changes
    - Add `ite_to_poly` boolean column to `students` table
    - When true, ITE students will have two pathway choices:
      1. After Sec 4: Choose ITE
      2. After ITE: Choose Polytechnic
  
  2. Notes
    - Allows ITE graduates to progress to Polytechnic
    - Creates second pathway choice step in roadmap
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'students' AND column_name = 'ite_to_poly'
  ) THEN
    ALTER TABLE students ADD COLUMN ite_to_poly boolean DEFAULT false;
  END IF;
END $$;
