import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { Customer, CustomerFormData } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

export const useCustomers = (search?: string) => {
  const { currentOrgId } = useAuth();

  return useQuery({
    queryKey: ['customers', currentOrgId, search],
    queryFn: async (): Promise<Customer[]> => {
      if (!currentOrgId) throw new Error('No organization selected');

      let query = supabase
        .from('customers')
        .select('*')
        .eq('org_id', currentOrgId)
        .eq('is_active', true)
        .order('name');

      if (search && search.trim()) {
        query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%`);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    },
    enabled: !!currentOrgId,
  });
};

export const useCustomer = (customerId: string) => {
  const { currentOrgId } = useAuth();

  return useQuery({
    queryKey: ['customer', customerId, currentOrgId],
    queryFn: async (): Promise<Customer> => {
      if (!currentOrgId) throw new Error('No organization selected');

      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('id', customerId)
        .eq('org_id', currentOrgId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!currentOrgId && !!customerId,
  });
};

export const useCreateCustomer = () => {
  const { currentOrgId } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: CustomerFormData): Promise<Customer> => {
      if (!currentOrgId) throw new Error('No organization selected');

      // Clean up empty strings to null for optional fields
      const cleanData = {
        ...data,
        phone: data.phone?.trim() || null,
        email: data.email?.trim() || null,
        address: data.address?.trim() || null,
        notes: data.notes?.trim() || null,
      };

      const { data: customer, error } = await supabase
        .from('customers')
        .insert({
          ...cleanData,
          org_id: currentOrgId,
        })
        .select()
        .single();

      if (error) throw error;
      return customer;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers', currentOrgId] });
      toast({
        title: "Customer created",
        description: "Customer has been successfully created.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error creating customer",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useUpdateCustomer = () => {
  const { currentOrgId } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: CustomerFormData }): Promise<Customer> => {
      if (!currentOrgId) throw new Error('No organization selected');

      // Clean up empty strings to null for optional fields
      const cleanData = {
        ...data,
        phone: data.phone?.trim() || null,
        email: data.email?.trim() || null,
        address: data.address?.trim() || null,
        notes: data.notes?.trim() || null,
      };

      const { data: customer, error } = await supabase
        .from('customers')
        .update(cleanData)
        .eq('id', id)
        .eq('org_id', currentOrgId)
        .select()
        .single();

      if (error) throw error;
      return customer;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['customers', currentOrgId] });
      queryClient.invalidateQueries({ queryKey: ['customer', id, currentOrgId] });
      toast({
        title: "Customer updated",
        description: "Customer has been successfully updated.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error updating customer",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useDeleteCustomer = () => {
  const { currentOrgId } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      if (!currentOrgId) throw new Error('No organization selected');

      const { error } = await supabase
        .from('customers')
        .update({ is_active: false })
        .eq('id', id)
        .eq('org_id', currentOrgId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers', currentOrgId] });
      toast({
        title: "Customer deleted",
        description: "Customer has been successfully deleted.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error deleting customer",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};