alter table public.profiles
add column if not exists parsed_resume jsonb default null,
add column if not exists job_matches jsonb default null;