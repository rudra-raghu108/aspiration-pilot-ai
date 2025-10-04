alter table public.profiles
add column if not exists skills jsonb default '[]',
add column if not exists career_goals jsonb default '{}',
add column if not exists job_preferences jsonb default '{}',
add column if not exists skill_assessments jsonb default '[]',
add column if not exists career_progression jsonb default '[]';