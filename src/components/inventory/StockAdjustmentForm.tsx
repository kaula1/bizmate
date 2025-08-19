import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { StockAdjustmentData, stockAdjustmentSchema } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useStockAdjustment } from "@/hooks/useInventory";
import { Minus, Plus } from "lucide-react";

interface StockAdjustmentFormProps {
  productId: string;
  productName: string;
  currentStock: number;
  trigger?: React.ReactNode;
}

export const StockAdjustmentForm = ({ 
  productId, 
  productName, 
  currentStock,
  trigger 
}: StockAdjustmentFormProps) => {
  const [open, setOpen] = useState(false);
  const stockAdjustment = useStockAdjustment();

  const form = useForm<StockAdjustmentData>({
    resolver: zodResolver(stockAdjustmentSchema),
    defaultValues: {
      adjustment: 0,
      reason: "",
    },
  });

  const onSubmit = async (data: StockAdjustmentData) => {
    try {
      await stockAdjustment.mutateAsync({
        productId,
        adjustment: data.adjustment,
        reason: data.reason,
      });
      setOpen(false);
      form.reset();
    } catch (error) {
      // Error handled by mutation
    }
  };

  const adjustment = form.watch("adjustment");
  const newStock = currentStock + adjustment;

  const defaultTrigger = (
    <Button variant="outline" size="sm" className="gap-2">
      <Plus className="h-3 w-3" />
      <Minus className="h-3 w-3" />
      Adjust Stock
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Adjust Stock</DialogTitle>
          <DialogDescription>
            Adjust stock level for {productName}
          </DialogDescription>
        </DialogHeader>
        
        <div className="rounded-lg bg-muted p-3 mb-4">
          <div className="flex justify-between text-sm">
            <span>Current Stock:</span>
            <span className="font-medium">{currentStock.toLocaleString()}</span>
          </div>
          {adjustment !== 0 && (
            <div className="flex justify-between text-sm mt-1">
              <span>New Stock:</span>
              <span className={`font-medium ${newStock < 0 ? 'text-destructive' : 'text-foreground'}`}>
                {newStock.toLocaleString()}
              </span>
            </div>
          )}
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="adjustment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Adjustment Amount</FormLabel>
                  <FormControl>
                    <Input 
                      type="number"
                      placeholder="Enter positive or negative number"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <p className="text-xs text-muted-foreground">
                    Use positive numbers to add stock, negative to reduce
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reason for Adjustment</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="e.g., Restock delivery, Damage, Theft, Sale correction"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {newStock < 0 && (
              <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3">
                <p className="text-sm text-destructive">
                  Warning: This adjustment would result in negative stock
                </p>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={stockAdjustment.isPending || newStock < 0}
              >
                Apply Adjustment
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};