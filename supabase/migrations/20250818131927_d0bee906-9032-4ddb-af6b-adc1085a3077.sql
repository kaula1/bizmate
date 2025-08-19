-- Fix function search path mutable warnings
DROP FUNCTION IF EXISTS public.get_user_org_ids(UUID);
DROP FUNCTION IF EXISTS public.update_updated_at_column();

-- Recreate functions with proper search_path
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