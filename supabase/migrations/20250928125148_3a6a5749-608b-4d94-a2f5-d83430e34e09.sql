-- Add grade column to papers table
ALTER TABLE public.papers ADD COLUMN grade text;

-- Add index for better performance when filtering by grade
CREATE INDEX idx_papers_grade ON public.papers(grade);

-- Update existing papers to have a default grade if needed
UPDATE public.papers SET grade = '12' WHERE grade IS NULL;