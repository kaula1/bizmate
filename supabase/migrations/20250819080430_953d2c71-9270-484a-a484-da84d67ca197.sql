-- Create products table
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  sku TEXT,
  barcode TEXT,
  category TEXT,
  unit_price DECIMAL(10,2) NOT NULL DEFAULT 0,
  cost_price DECIMAL(10,2),
  tax_rate DECIMAL(5,2) DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(org_id, sku)
);

-- Create inventory_levels table
CREATE TABLE public.inventory_levels (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  current_stock DECIMAL(10,2) NOT NULL DEFAULT 0,
  min_stock_level DECIMAL(10,2) DEFAULT 0,
  max_stock_level DECIMAL(10,2),
  reorder_point DECIMAL(10,2),
  last_restock_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(org_id, product_id)
);

-- Enable RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_levels ENABLE ROW LEVEL SECURITY;

-- RLS Policies for products
CREATE POLICY "Users can view products in their org"
ON public.products FOR SELECT 
USING (org_id = ANY (get_user_org_ids(auth.uid())));

CREATE POLICY "Users can create products in their org"
ON public.products FOR INSERT 
WITH CHECK (org_id = ANY (get_user_org_ids(auth.uid())));

CREATE POLICY "Users can update products in their org"
ON public.products FOR UPDATE 
USING (org_id = ANY (get_user_org_ids(auth.uid())));

CREATE POLICY "Owners and admins can delete products"
ON public.products FOR DELETE 
USING (
  org_id = ANY (get_user_org_ids(auth.uid())) 
  AND EXISTS (
    SELECT 1 FROM profiles p 
    WHERE p.user_id = auth.uid() 
    AND p.org_id = products.org_id 
    AND p.role IN ('owner', 'admin')
  )
);

-- RLS Policies for inventory_levels
CREATE POLICY "Users can view inventory in their org"
ON public.inventory_levels FOR SELECT 
USING (org_id = ANY (get_user_org_ids(auth.uid())));

CREATE POLICY "Users can create inventory in their org"
ON public.inventory_levels FOR INSERT 
WITH CHECK (org_id = ANY (get_user_org_ids(auth.uid())));

CREATE POLICY "Users can update inventory in their org"
ON public.inventory_levels FOR UPDATE 
USING (org_id = ANY (get_user_org_ids(auth.uid())));

-- Triggers for updated_at
CREATE TRIGGER update_products_updated_at
BEFORE UPDATE ON public.products
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_inventory_levels_updated_at
BEFORE UPDATE ON public.inventory_levels
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for performance
CREATE INDEX idx_products_org_id ON public.products(org_id);
CREATE INDEX idx_products_sku ON public.products(org_id, sku);
CREATE INDEX idx_inventory_levels_org_id ON public.inventory_levels(org_id);
CREATE INDEX idx_inventory_levels_product_id ON public.inventory_levels(product_id);
CREATE INDEX idx_inventory_low_stock ON public.inventory_levels(org_id, current_stock, min_stock_level) WHERE current_stock <= min_stock_level;