-- Drop the existing insert policy
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;

-- Create a new policy that allows profile creation during signup
CREATE POLICY "Enable insert for authentication service"
  ON public.profiles FOR INSERT
  WITH CHECK (
    -- Allow insert if user is authenticated and inserting their own profile
    (auth.uid() IS NOT NULL AND user_id = auth.uid())
    OR
    -- Allow insert during signup (when auth.uid() is null but we're creating a new user)
    (auth.uid() IS NULL AND EXISTS (
      SELECT 1 FROM auth.users 
      WHERE id = user_id 
      AND created_at > now() - interval '5 minutes'
    ))
  );