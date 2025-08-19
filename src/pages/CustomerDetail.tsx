import { useParams, useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { useCustomer } from "@/hooks/useCustomers";
import { CustomerProfile } from "@/components/customers/CustomerProfile";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const CustomerDetail = () => {
  const { customerId } = useParams<{ customerId: string }>();
  const navigate = useNavigate();
  const { data: customer, isLoading, error } = useCustomer(customerId!);

  if (isLoading) {
    return (
      <AppLayout>
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Skeleton className="h-10 w-10 rounded" />
            <div className="space-y-2">
              <Skeleton className="h-8 w-[200px]" />
              <Skeleton className="h-4 w-[300px]" />
            </div>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <Skeleton className="h-[200px]" />
            <Skeleton className="h-[200px]" />
          </div>
        </div>
      </AppLayout>
    );
  }

  if (error || !customer) {
    return (
      <AppLayout>
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/customers")}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Customers
            </Button>
          </div>
          
          <Card className="border-destructive/20">
            <CardContent className="flex items-center justify-center py-12">
              <div className="text-center space-y-4">
                <AlertCircle className="w-12 h-12 text-destructive mx-auto" />
                <div>
                  <h3 className="text-lg font-semibold">Customer Not Found</h3>
                  <p className="text-muted-foreground">
                    The customer you're looking for doesn't exist or you don't have permission to view it.
                  </p>
                </div>
                <Button onClick={() => navigate("/customers")}>
                  Return to Customers
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/customers")}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Customers
          </Button>
        </div>
        
        <CustomerProfile customer={customer} />
      </div>
    </AppLayout>
  );
};

export default CustomerDetail;