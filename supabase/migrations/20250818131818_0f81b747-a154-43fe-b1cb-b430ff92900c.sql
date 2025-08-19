-- Create role enum
CREATE TYPE public.app_role AS ENUM ('owner', 'admin', 'staff');

-- Create organizations table
CREATE TABLE public.organizations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  plan TEXT NOT NULL DEFAULT 'basic',
  country TEXT NOT NULL DEFAULT 'KE',
  currency TEXT NOT NULL DEFAULT 'KES',
  address TEXT,
  phone TEXT,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create profiles table (links users to orgs with roles)
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  org_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  role app_role NOT NULL DEFAULT 'staff',
  display_name TEXT,
  phone TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, org_id)
);

-- Enable RLS
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to get user's orgs (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.get_user_org_ids(user_uuid UUID)
RETURNS UUID[] AS $$
  SELECT ARRAY_AGG(org_id) 
  FROM public.profiles 
  WHERE user_id = user_uuid AND is_active = true;
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- RLS Policies for organizations
CREATE POLICY "Users can view their organizations" 
ON public.organizations FOR SELECT 
USING (id = ANY(public.get_user_org_ids(auth.uid())));

CREATE POLICY "Users can update their organizations" 
ON public.organizations FOR UPDATE 
USING (id = ANY(public.get_user_org_ids(auth.uid())));

CREATE POLICY "Users can create organizations" 
ON public.organizations FOR INSERT 
WITH CHECK (true); -- Anyone can create an org

-- RLS Policies for profiles
CREATE POLICY "Users can view profiles in their orgs" 
ON public.profiles FOR SELECT 
USING (org_id = ANY(public.get_user_org_ids(auth.uid())));

CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE 
USING (user_id = auth.uid());

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

CREATE POLICY "Users can create their first profile" 
ON public.profiles FOR INSERT 
WITH CHECK (user_id = auth.uid());

-- Indexes for performance
CREATE INDEX idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX idx_profiles_org_id ON public.profiles(org_id);
CREATE INDEX idx_profiles_user_org ON public.profiles(user_id, org_id);
CREATE INDEX idx_organizations_created_at ON public.organizations(created_at);

-- Update trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Update triggers
CREATE TRIGGER update_organizations_updated_at
  BEFORE UPDATE ON public.organizations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();