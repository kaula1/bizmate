import { z } from "zod";

// Database types
export interface Organization {
  id: string;
  name: string;
  plan: string;
  country: string;
  currency: string;
  address?: string;
  phone?: string;
  email?: string;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  user_id: string;
  org_id: string;
  role: 'owner' | 'admin' | 'staff';
  display_name?: string;
  phone?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  organization?: Organization;
}

// Auth schemas
export const signUpSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const signInSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

export const orgCreationSchema = z.object({
  name: z.string().min(1, "Organization name is required"),
  country: z.string().default("KE"),
  currency: z.string().default("KES"),
  displayName: z.string().min(1, "Your name is required"),
  phone: z.string().optional(),
});

// Product and Inventory types
export interface Product {
  id: string;
  org_id: string;
  name: string;
  description?: string;
  sku?: string;
  barcode?: string;
  category?: string;
  unit_price: number;
  cost_price?: number;
  tax_rate?: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface InventoryLevel {
  id: string;
  org_id: string;
  product_id: string;
  current_stock: number;
  min_stock_level?: number;
  max_stock_level?: number;
  reorder_point?: number;
  last_restock_date?: string;
  created_at: string;
  updated_at: string;
  product?: Product;
}

export interface ProductWithInventory extends Product {
  inventory_level?: InventoryLevel;
}

// Product schemas
export const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z.string().optional(),
  sku: z.string().optional(),
  barcode: z.string().optional(),
  category: z.string().optional(),
  unit_price: z.coerce.number().min(0, "Price must be positive"),
  cost_price: z.coerce.number().min(0).optional(),
  tax_rate: z.coerce.number().min(0).max(100).optional(),
  is_active: z.boolean().default(true),
});

export const inventoryLevelSchema = z.object({
  current_stock: z.coerce.number().min(0, "Stock must be non-negative"),
  min_stock_level: z.coerce.number().min(0).optional(),
  max_stock_level: z.coerce.number().min(0).optional(),
  reorder_point: z.coerce.number().min(0).optional(),
});

export const stockAdjustmentSchema = z.object({
  adjustment: z.coerce.number().refine((val) => val !== 0, "Adjustment cannot be zero"),
  reason: z.string().min(1, "Reason is required"),
});

export type SignUpData = z.infer<typeof signUpSchema>;
export type SignInData = z.infer<typeof signInSchema>;
export type OrgCreationData = z.infer<typeof orgCreationSchema>;
export type ProductFormData = z.infer<typeof productSchema>;
export type InventoryLevelFormData = z.infer<typeof inventoryLevelSchema>;
export type StockAdjustmentData = z.infer<typeof stockAdjustmentSchema>;