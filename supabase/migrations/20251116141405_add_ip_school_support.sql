/*
  # Add Integrated Programme (IP) School Support

  1. Changes
    - Add `is_ip_school` boolean column to `students` table
    - IP schools are 6-year programs (Sec 1-4 + JC 1-2)
    - Non-IP schools have pathway choice after Sec 4
  
  2. Notes
    - IP schools: Raffles Institution, Hwa Chong, Dunman High, etc.
    - Students in IP schools skip pathway choice
    - Roadmap automatically shows Sec 1-4 → JC 1-2 → Career
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'students' AND column_name = 'is_ip_school'
  ) THEN
    ALTER TABLE students ADD COLUMN is_ip_school boolean DEFAULT false;
  END IF;
END $$;
