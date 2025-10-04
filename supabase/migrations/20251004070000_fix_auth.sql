-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

-- Create new, more permissive policies
CREATE POLICY "Enable read access for authenticated users"
  ON public.profiles FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Enable insert access for authenticated users"
  ON public.profiles FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Enable update for users based on user_id"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- Grant permissions to authenticated users
GRANT ALL ON public.profiles TO authenticated;
GRANT USAGE ON SEQUENCE profiles_id_seq TO authenticated;