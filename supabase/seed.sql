-- Seed data for inventory management demo
-- This script adds sample products and inventory levels for testing

INSERT INTO public.products (
  id,
  org_id, 
  name, 
  description, 
  sku, 
  category, 
  unit_price, 
  cost_price, 
  tax_rate,
  is_active
) VALUES 
-- Electronics
(gen_random_uuid(), (SELECT id FROM organizations LIMIT 1), 'Samsung Galaxy A54', 'Mid-range smartphone with great camera', 'SGH-A54-128', 'Electronics', 25000.00, 22000.00, 16.00, true),
(gen_random_uuid(), (SELECT id FROM organizations LIMIT 1), 'iPhone 13', 'Apple smartphone with A15 chip', 'APL-IP13-128', 'Electronics', 75000.00, 65000.00, 16.00, true),
(gen_random_uuid(), (SELECT id FROM organizations LIMIT 1), 'Wireless Earbuds', 'Bluetooth earbuds with noise cancellation', 'WEB-NC-001', 'Electronics', 3500.00, 2800.00, 16.00, true),
(gen_random_uuid(), (SELECT id FROM organizations LIMIT 1), 'USB-C Cable', 'Fast charging USB-C cable 1m', 'CBL-USBC-1M', 'Accessories', 500.00, 300.00, 16.00, true),
(gen_random_uuid(), (SELECT id FROM organizations LIMIT 1), 'Phone Case', 'Protective silicone phone case', 'CSE-SIL-001', 'Accessories', 800.00, 400.00, 16.00, true),

-- Clothing
(gen_random_uuid(), (SELECT id FROM organizations LIMIT 1), 'Cotton T-Shirt', 'Plain cotton t-shirt - various colors', 'TSH-COT-PLN', 'Clothing', 1200.00, 600.00, 16.00, true),
(gen_random_uuid(), (SELECT id FROM organizations LIMIT 1), 'Denim Jeans', 'Classic blue denim jeans', 'JNS-DNM-BLU', 'Clothing', 2500.00, 1800.00, 16.00, true),
(gen_random_uuid(), (SELECT id FROM organizations LIMIT 1), 'Leather Belt', 'Genuine leather belt - brown', 'BLT-LTR-BRN', 'Accessories', 1800.00, 1200.00, 16.00, true),

-- Office Supplies
(gen_random_uuid(), (SELECT id FROM organizations LIMIT 1), 'Ballpoint Pen', 'Blue ink ballpoint pen', 'PEN-BLU-001', 'Office', 50.00, 25.00, 16.00, true),
(gen_random_uuid(), (SELECT id FROM organizations LIMIT 1), 'A4 Paper Ream', '500 sheets white A4 paper', 'PPR-A4-500', 'Office', 350.00, 280.00, 16.00, true),
(gen_random_uuid(), (SELECT id FROM organizations LIMIT 1), 'Notebook', 'Spiral bound notebook 200 pages', 'NTB-SP-200', 'Office', 200.00, 120.00, 16.00, true),

-- Home & Garden  
(gen_random_uuid(), (SELECT id FROM organizations LIMIT 1), 'Kitchen Knife Set', '5-piece stainless steel knife set', 'KNF-ST-5PC', 'Kitchen', 3200.00, 2000.00, 16.00, true),
(gen_random_uuid(), (SELECT id FROM organizations LIMIT 1), 'Plant Pot', 'Ceramic plant pot with drainage', 'POT-CER-MED', 'Garden', 650.00, 400.00, 16.00, true);

-- Create corresponding inventory levels
INSERT INTO public.inventory_levels (
  id,
  org_id,
  product_id,
  current_stock,
  min_stock_level,
  reorder_point,
  last_restock_date
)
SELECT 
  gen_random_uuid(),
  p.org_id,
  p.id,
  CASE 
    -- Electronics - varied stock levels
    WHEN p.name LIKE '%Samsung%' THEN 15
    WHEN p.name LIKE '%iPhone%' THEN 8
    WHEN p.name LIKE '%Wireless Earbuds%' THEN 25
    WHEN p.name LIKE '%USB-C Cable%' THEN 2  -- Low stock item
    WHEN p.name LIKE '%Phone Case%' THEN 45
    
    -- Clothing - seasonal stock
    WHEN p.name LIKE '%T-Shirt%' THEN 120
    WHEN p.name LIKE '%Jeans%' THEN 35
    WHEN p.name LIKE '%Belt%' THEN 0  -- Out of stock item
    
    -- Office Supplies - high volume items
    WHEN p.name LIKE '%Pen%' THEN 500
    WHEN p.name LIKE '%Paper%' THEN 25
    WHEN p.name LIKE '%Notebook%' THEN 1  -- Low stock item
    
    -- Home & Garden
    WHEN p.name LIKE '%Knife Set%' THEN 12
    WHEN p.name LIKE '%Plant Pot%' THEN 8
    
    ELSE 10
  END as current_stock,
  
  CASE 
    -- Set minimum stock levels
    WHEN p.category = 'Electronics' THEN 10
    WHEN p.category = 'Clothing' THEN 20
    WHEN p.category = 'Office' THEN 50
    WHEN p.category = 'Kitchen' THEN 5
    WHEN p.category = 'Garden' THEN 10
    WHEN p.category = 'Accessories' THEN 15
    ELSE 5
  END as min_stock_level,
  
  CASE 
    -- Set reorder points
    WHEN p.category = 'Electronics' THEN 15
    WHEN p.category = 'Clothing' THEN 30
    WHEN p.category = 'Office' THEN 100
    WHEN p.category = 'Kitchen' THEN 8
    WHEN p.category = 'Garden' THEN 15
    WHEN p.category = 'Accessories' THEN 20
    ELSE 8
  END as reorder_point,
  
  -- Random recent restock dates for some items
  CASE 
    WHEN random() > 0.5 THEN now() - interval '1 day' * (random() * 30)::int
    ELSE NULL
  END as last_restock_date
  
FROM public.products p
WHERE p.is_active = true;