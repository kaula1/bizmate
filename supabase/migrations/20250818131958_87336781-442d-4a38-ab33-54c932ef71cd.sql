-- Drop policies that depend on the function
DROP POLICY IF EXISTS "Users can view their organizations" ON public.organizations;
DROP POLICY IF EXISTS "Users can update their organizations" ON public.organizations;
DROP POLICY IF EXISTS "Users can view profiles in their orgs" ON public.profiles;
DROP POLICY IF EXISTS "Owners and admins can manage profiles in their orgs" ON public.profiles;

-- Drop and recreate functions with proper search_path
DROP FUNCTION IF EXISTS public.get_user_org_ids(UUID) CASCADE;
DROP FUNCTION IF EXISTS public.update_updated_at_column() CASCADE;

CREATE OR REPLACE FUNCTION public.get_user_org_ids(user_uuid UUID)
RETURNS UUID[] AS $$
  SELECT ARRAY_AGG(org_id) 
  FROM public.profiles 
  WHERE user_id = user_uuid AND is_active = true;
$$ LANGUAGE SQL SECURITY DEFINER STABLE SET search_path = public;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Recreate RLS policies
CREATE POLICY "Users can view their organizations" 
ON public.organizations FOR SELECT 
USING (id = ANY(public.get_user_org_ids(auth.uid())));

CREATE POLICY "Users can update their organizations" 
ON public.organizations FOR UPDATE 
USING (id = ANY(public.get_user_org_ids(auth.uid())));

CREATE POLICY "Users can view profiles in their orgs" 
ON public.profiles FOR SELECT 
USING (org_id = ANY(public.get_user_org_ids(auth.uid())));

CREATE POLICY "Owners and admins can manage profiles in their orgs" 
ON public.profiles FOR ALL 
USING (
  org_id = ANY(public.get_user_org_ids(auth.uid())) 
  AND EXISTS (
    SELECT 1 FROM public.profiles p 
    WHERE p.user_id = auth.uid() 
    AND p.org_id = profiles.org_id 
    AND p.role IN ('owner', 'admin')
  )
);

-- Recreate triggers
CREATE TRIGGER update_organizations_updated_at
  BEFORE UPDATE ON public.organizations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();