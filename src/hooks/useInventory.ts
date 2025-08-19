import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { InventoryLevel, StockAdjustmentData } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

export const useLowStockItems = () => {
  const { currentOrgId } = useAuth();

  return useQuery({
    queryKey: ['low-stock-items', currentOrgId],
    queryFn: async (): Promise<InventoryLevel[]> => {
      if (!currentOrgId) throw new Error('No organization selected');

      const { data, error } = await supabase
        .from('inventory_levels')
        .select(`
          *,
          product:products(*)
        `)
        .eq('org_id', currentOrgId)
        .lte('current_stock', 'min_stock_level')
        .not('min_stock_level', 'is', null)
        .order('current_stock');

      if (error) throw error;
      return data || [];
    },
    enabled: !!currentOrgId,
  });
};

export const useStockAdjustment = () => {
  const { currentOrgId } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ 
      productId, 
      adjustment, 
      reason 
    }: { 
      productId: string; 
      adjustment: number; 
      reason: string; 
    }): Promise<void> => {
      if (!currentOrgId) throw new Error('No organization selected');

      // Get current stock level
      const { data: currentLevel, error: fetchError } = await supabase
        .from('inventory_levels')
        .select('current_stock')
        .eq('product_id', productId)
        .eq('org_id', currentOrgId)
        .single();

      if (fetchError) throw fetchError;

      const newStock = currentLevel.current_stock + adjustment;
      if (newStock < 0) {
        throw new Error('Insufficient stock for this adjustment');
      }

      // Update stock level
      const { error: updateError } = await supabase
        .from('inventory_levels')
        .update({ 
          current_stock: newStock,
          last_restock_date: adjustment > 0 ? new Date().toISOString() : undefined
        })
        .eq('product_id', productId)
        .eq('org_id', currentOrgId);

      if (updateError) throw updateError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products', currentOrgId] });
      queryClient.invalidateQueries({ queryKey: ['low-stock-items', currentOrgId] });
      toast({
        title: "Stock updated",
        description: "Stock level has been successfully updated.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error updating stock",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useUpdateInventoryLevel = () => {
  const { currentOrgId } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ 
      productId, 
      data 
    }: { 
      productId: string; 
      data: Partial<InventoryLevel>; 
    }): Promise<void> => {
      if (!currentOrgId) throw new Error('No organization selected');

      const { error } = await supabase
        .from('inventory_levels')
        .update(data)
        .eq('product_id', productId)
        .eq('org_id', currentOrgId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products', currentOrgId] });
      queryClient.invalidateQueries({ queryKey: ['low-stock-items', currentOrgId] });
      toast({
        title: "Inventory updated",
        description: "Inventory level has been successfully updated.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error updating inventory",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};