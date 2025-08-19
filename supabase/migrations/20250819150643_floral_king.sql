@@ .. @@
 FROM public.products p
 WHERE p.is_active = true;
+
+-- Seed customers data
+INSERT INTO public.customers (
+  id,
+  org_id,
+  name,
+  phone,
+  email,
+  address,
+  notes,
+  is_active
+) VALUES 
+-- Regular customers
+(gen_random_uuid(), (SELECT id FROM organizations LIMIT 1), 'John Kamau', '+254712345678', 'john.kamau@email.com', 'Nairobi, Kenya', 'Regular customer, prefers electronics', true),
+(gen_random_uuid(), (SELECT id FROM organizations LIMIT 1), 'Mary Wanjiku', '+254723456789', 'mary.wanjiku@gmail.com', 'Kiambu, Kenya', 'Bulk buyer for office supplies', true),
+(gen_random_uuid(), (SELECT id FROM organizations LIMIT 1), 'Peter Ochieng', '+254734567890', NULL, 'Kisumu, Kenya', 'Cash customer, no email provided', true),
+(gen_random_uuid(), (SELECT id FROM organizations LIMIT 1), 'Grace Akinyi', NULL, 'grace.akinyi@yahoo.com', NULL, 'Online customer, ships nationwide', true),
+(gen_random_uuid(), (SELECT id FROM organizations LIMIT 1), 'David Mwangi', '+254745678901', 'david.mwangi@company.co.ke', 'Mombasa, Kenya', 'Corporate account - ABC Company', true),
+(gen_random_uuid(), (SELECT id FROM organizations LIMIT 1), 'Sarah Njeri', '+254756789012', 'sarah.njeri@email.com', 'Nakuru, Kenya', 'Frequent buyer of clothing items', true),
+(gen_random_uuid(), (SELECT id FROM organizations LIMIT 1), 'James Kiprop', '+254767890123', NULL, 'Eldoret, Kenya', 'Prefers phone orders', true),
+(gen_random_uuid(), (SELECT id FROM organizations LIMIT 1), 'Lucy Wambui', '+254778901234', 'lucy.wambui@gmail.com', 'Thika, Kenya', 'VIP customer - high value purchases', true),
+(gen_random_uuid(), (SELECT id FROM organizations LIMIT 1), 'Michael Otieno', '+254789012345', 'michael.otieno@email.com', 'Machakos, Kenya', 'Seasonal buyer - electronics', true),
+(gen_random_uuid(), (SELECT id FROM organizations LIMIT 1), 'Anne Mutua', '+254790123456', 'anne.mutua@company.com', 'Nairobi, Kenya', 'Business customer - office supplies', true),
+
+-- Some inactive customers for testing
+(gen_random_uuid(), (SELECT id FROM organizations LIMIT 1), 'Former Customer', '+254701234567', 'former@email.com', 'Nairobi, Kenya', 'Account closed due to relocation', false),
+(gen_random_uuid(), (SELECT id FROM organizations LIMIT 1), 'Test Customer', NULL, NULL, NULL, 'Test account - can be deleted', false);