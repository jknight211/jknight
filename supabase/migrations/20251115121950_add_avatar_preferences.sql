/*
  # Add Avatar Preferences to Students Table

  1. Changes
    - Add `avatar_preferences` column to `students` table to store 3D avatar customization
  
  2. Details
    - Column type: JSONB for flexible storage of avatar settings
    - Stores skin color, hair color, shirt color, and emotion state
    - Optional field with default null value
  
  3. Notes
    - Existing students will have null avatar preferences until they customize
    - No data loss as this is a new optional column
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'students' AND column_name = 'avatar_preferences'
  ) THEN
    ALTER TABLE students ADD COLUMN avatar_preferences jsonb DEFAULT NULL;
  END IF;
END $$;