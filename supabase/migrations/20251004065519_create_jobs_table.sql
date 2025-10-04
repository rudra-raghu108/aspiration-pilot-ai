create table if not exists public.jobs (
    id uuid default gen_random_uuid() primary key,
    title text not null,
    company text not null,
    description text,
    required_skills text[] not null default '{}',
    location text,
    salary_range text,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- Set up Row Level Security
alter table public.jobs enable row level security;

-- Create policy to allow all users to read jobs
create policy "Jobs are viewable by all users"
    on public.jobs
    for select
    using (true);

-- Create policy to allow only authenticated users to create jobs
create policy "Authenticated users can create jobs"
    on public.jobs
    for insert
    with check (auth.role() = 'authenticated');

-- Create update trigger for updated_at
create or replace function handle_updated_at()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

create trigger jobs_updated_at
    before update on public.jobs
    for each row
    execute procedure handle_updated_at();