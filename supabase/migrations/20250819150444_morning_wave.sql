/*
  # Customer Management System

  1. New Tables
    - `customers`
      - `id` (uuid, primary key)
      - `org_id` (uuid, foreign key to organizations)
      - `name` (text, required)
      - `phone` (text, optional)
      - `email` (text, optional)
      - `address` (text, optional)
      - `notes` (text, optional)
      - `is_active` (boolean, default true)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `customers` table
    - Add policies for org-based access control
    - Users can view/manage customers in their org

  3. Indexes
    - Performance indexes for org_id, email, phone
    - Search optimization for name and email
*/

-- Create customers table
CREATE TABLE IF NOT EXISTS public.customers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  address TEXT,
  notes TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT customers_email_check CHECK (email IS NULL OR email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Enable RLS
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;

-- RLS Policies for customers
CREATE POLICY "Users can view customers in their org"
ON public.customers FOR SELECT 
USING (org_id = ANY(public.get_user_org_ids(auth.uid())));

CREATE POLICY "Users can create customers in their org"
ON public.customers FOR INSERT 
WITH CHECK (org_id = ANY(public.get_user_org_ids(auth.uid())));

CREATE POLICY "Users can update customers in their org"
ON public.customers FOR UPDATE 
USING (org_id = ANY(public.get_user_org_ids(auth.uid())));

CREATE POLICY "Owners and admins can delete customers"
ON public.customers FOR DELETE 
USING (
  org_id = ANY(public.get_user_org_ids(auth.uid())) 
  AND EXISTS (
    SELECT 1 FROM public.profiles p 
    WHERE p.user_id = auth.uid() 
    AND p.org_id = customers.org_id 
    AND p.role IN ('owner', 'admin')
  )
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_customers_org_id ON public.customers(org_id);
CREATE INDEX IF NOT EXISTS idx_customers_email ON public.customers(org_id, email) WHERE email IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_customers_phone ON public.customers(org_id, phone) WHERE phone IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_customers_name ON public.customers(org_id, name);
CREATE INDEX IF NOT EXISTS idx_customers_active ON public.customers(org_id, is_active);

-- Create search index for customer names and emails
CREATE INDEX IF NOT EXISTS idx_customers_search ON public.customers 
USING gin((name || ' ' || COALESCE(email, '')) gin_trgm_ops);

-- Add updated_at trigger
CREATE TRIGGER update_customers_updated_at
BEFORE UPDATE ON public.customers
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add unique constraint for email per org (if email is provided)
CREATE UNIQUE INDEX IF NOT EXISTS idx_customers_org_email_unique 
ON public.customers(org_id, email) 
WHERE email IS NOT NULL AND is_active = true;