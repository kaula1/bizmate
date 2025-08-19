import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { Product, ProductFormData, ProductWithInventory } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

export const useProducts = () => {
  const { currentOrgId } = useAuth();
  const { toast } = useToast();

  return useQuery({
    queryKey: ['products', currentOrgId],
    queryFn: async (): Promise<ProductWithInventory[]> => {
      if (!currentOrgId) throw new Error('No organization selected');

      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          inventory_level:inventory_levels(*)
        `)
        .eq('org_id', currentOrgId)
        .eq('is_active', true)
        .order('name');

      if (error) throw error;

      return data.map(product => ({
        ...product,
        inventory_level: Array.isArray(product.inventory_level) 
          ? product.inventory_level[0] 
          : product.inventory_level
      }));
    },
    enabled: !!currentOrgId,
  });
};

export const useCreateProduct = () => {
  const { currentOrgId } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: ProductFormData): Promise<Product> => {
      if (!currentOrgId) throw new Error('No organization selected');

      const { data: product, error } = await supabase
        .from('products')
        .insert({
          ...data,
          org_id: currentOrgId,
        })
        .select()
        .single();

      if (error) throw error;

      // Create initial inventory level
      await supabase
        .from('inventory_levels')
        .insert({
          org_id: currentOrgId,
          product_id: product.id,
          current_stock: 0,
          min_stock_level: 0,
        });

      return product;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products', currentOrgId] });
      toast({
        title: "Product created",
        description: "Product has been successfully created.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error creating product",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useUpdateProduct = () => {
  const { currentOrgId } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: ProductFormData }): Promise<Product> => {
      if (!currentOrgId) throw new Error('No organization selected');

      const { data: product, error } = await supabase
        .from('products')
        .update(data)
        .eq('id', id)
        .eq('org_id', currentOrgId)
        .select()
        .single();

      if (error) throw error;
      return product;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products', currentOrgId] });
      toast({
        title: "Product updated",
        description: "Product has been successfully updated.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error updating product",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useDeleteProduct = () => {
  const { currentOrgId } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      if (!currentOrgId) throw new Error('No organization selected');

      const { error } = await supabase
        .from('products')
        .update({ is_active: false })
        .eq('id', id)
        .eq('org_id', currentOrgId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products', currentOrgId] });
      toast({
        title: "Product deleted",
        description: "Product has been successfully deleted.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error deleting product",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};