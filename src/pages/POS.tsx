import { AppLayout } from "@/components/layout/AppLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ShoppingCart, Package, Users, Calculator } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"

const POS = () => {
  const { profile } = useAuth();
  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Point of Sale</h1>
          <p className="text-muted-foreground">
            Fast and efficient sales processing for your business.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* POS Interface */}
          <Card className="lg:col-span-2 bg-gradient-card border-0 shadow-medium">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5 text-primary" />
                POS Terminal
              </CardTitle>
              <CardDescription>
                Add products to cart and process sales
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="min-h-[400px] flex items-center justify-center text-muted-foreground">
                POS interface coming soon...
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="space-y-4">
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <ShoppingCart className="h-5 w-5 text-secondary" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                  <p className="font-medium text-sm">New Sale</p>
                  <p className="text-xs text-muted-foreground">Start a new transaction</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="font-medium text-sm">Quick Add Customer</p>
                  <p className="text-xs text-muted-foreground">Register new customer</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="font-medium text-sm">Stock Check</p>
                  <p className="text-xs text-muted-foreground">Verify product availability</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}

export default POS