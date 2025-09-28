-- Create practice_tests table
CREATE TABLE public.practice_tests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  subject TEXT NOT NULL,
  grade TEXT NOT NULL,
  duration INTEGER NOT NULL DEFAULT 60,
  difficulty TEXT NOT NULL DEFAULT 'Medium',
  status TEXT NOT NULL DEFAULT 'draft',
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create practice_test_questions table
CREATE TABLE public.practice_test_questions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  test_id UUID NOT NULL REFERENCES public.practice_tests(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  question_type TEXT NOT NULL DEFAULT 'multiple_choice',
  options JSONB,
  correct_answer TEXT NOT NULL,
  explanation TEXT,
  points INTEGER NOT NULL DEFAULT 1,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create practice_test_attempts table
CREATE TABLE public.practice_test_attempts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  test_id UUID NOT NULL REFERENCES public.practice_tests(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  score INTEGER NOT NULL DEFAULT 0,
  total_points INTEGER NOT NULL DEFAULT 0,
  time_taken INTEGER, -- in seconds
  answers JSONB,
  completed BOOLEAN NOT NULL DEFAULT false,
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Create notifications table
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'info',
  target_users TEXT[], -- array of user roles or 'all' for everyone
  active BOOLEAN NOT NULL DEFAULT true,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create saved_papers table for user bookmarks
CREATE TABLE public.saved_papers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  paper_id UUID NOT NULL REFERENCES public.papers(id) ON DELETE CASCADE,
  saved_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, paper_id)
);

-- Enable RLS on all new tables
ALTER TABLE public.practice_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.practice_test_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.practice_test_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_papers ENABLE ROW LEVEL SECURITY;

-- RLS Policies for practice_tests
CREATE POLICY "Admins can manage all practice tests"
ON public.practice_tests
FOR ALL
USING (is_admin(auth.uid()));

CREATE POLICY "Anyone can view published practice tests"
ON public.practice_tests
FOR SELECT
USING (status = 'published');

CREATE POLICY "Users can view their own draft tests"
ON public.practice_tests
FOR SELECT
USING (auth.uid() = created_by);

-- RLS Policies for practice_test_questions
CREATE POLICY "Admins can manage all questions"
ON public.practice_test_questions
FOR ALL
USING (is_admin(auth.uid()));

CREATE POLICY "Anyone can view questions for published tests"
ON public.practice_test_questions
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.practice_tests pt 
    WHERE pt.id = test_id AND pt.status = 'published'
  )
);

-- RLS Policies for practice_test_attempts
CREATE POLICY "Users can manage their own attempts"
ON public.practice_test_attempts
FOR ALL
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all attempts"
ON public.practice_test_attempts
FOR SELECT
USING (is_admin(auth.uid()));

-- RLS Policies for notifications
CREATE POLICY "Admins can manage notifications"
ON public.notifications
FOR ALL
USING (is_admin(auth.uid()));

CREATE POLICY "Everyone can view active notifications"
ON public.notifications
FOR SELECT
USING (
  active = true AND 
  (expires_at IS NULL OR expires_at > now()) AND
  (target_users IS NULL OR 'all' = ANY(target_users) OR 
   EXISTS (
     SELECT 1 FROM public.profiles 
     WHERE user_id = auth.uid() AND role::text = ANY(target_users)
   ))
);

-- RLS Policies for saved_papers
CREATE POLICY "Users can manage their own saved papers"
ON public.saved_papers
FOR ALL
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all saved papers"
ON public.saved_papers
FOR SELECT
USING (is_admin(auth.uid()));

-- Add triggers for updated_at timestamps
CREATE TRIGGER update_practice_tests_updated_at
  BEFORE UPDATE ON public.practice_tests
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_practice_tests_status ON public.practice_tests(status);
CREATE INDEX idx_practice_tests_grade_subject ON public.practice_tests(grade, subject);
CREATE INDEX idx_practice_test_questions_test_id ON public.practice_test_questions(test_id);
CREATE INDEX idx_practice_test_attempts_user_id ON public.practice_test_attempts(user_id);
CREATE INDEX idx_practice_test_attempts_test_id ON public.practice_test_attempts(test_id);
CREATE INDEX idx_notifications_active_expires ON public.notifications(active, expires_at);
CREATE INDEX idx_saved_papers_user_id ON public.saved_papers(user_id);