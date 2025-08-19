import { AppLayout } from "@/components/layout/AppLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, AlertTriangle, TrendingDown } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/hooks/useAuth"
import { useProducts } from "@/hooks/useProducts"
import { useLowStockItems } from "@/hooks/useInventory"
import { ProductsTable } from "@/components/inventory/ProductsTable"
import { Skeleton } from "@/components/ui/skeleton"

const Inventory = () => {
  const { profile } = useAuth();
  const { data: products = [], isLoading: productsLoading } = useProducts();
  const { data: lowStockItems = [], isLoading: lowStockLoading } = useLowStockItems();

  const outOfStockCount = products.filter(p => 
    (p.inventory_level?.current_stock || 0) === 0
  ).length;

  const lowStockCount = lowStockItems.length;

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Inventory</h1>
            <p className="text-muted-foreground">
              Manage your products and stock levels efficiently.
            </p>
          </div>
          {!lowStockLoading && lowStockCount > 0 && (
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-warning/10 text-warning-foreground border-warning/20">
                {lowStockCount} Low Stock Items
              </Badge>
            </div>
          )}
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="bg-gradient-card border-0 shadow-soft">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Products
              </CardTitle>
              <Package className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              {productsLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div className="text-2xl font-bold text-foreground">{products.length}</div>
              )}
              <p className="text-xs text-muted-foreground">Active inventory items</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-0 shadow-soft">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Low Stock Alerts
              </CardTitle>
              <AlertTriangle className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              {lowStockLoading ? (
                <Skeleton className="h-8 w-8" />
              ) : (
                <div className="text-2xl font-bold text-warning">{lowStockCount}</div>
              )}
              <p className="text-xs text-muted-foreground">Items need reordering</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-0 shadow-soft">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Out of Stock
              </CardTitle>
              <TrendingDown className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              {productsLoading ? (
                <Skeleton className="h-8 w-8" />
              ) : (
                <div className="text-2xl font-bold text-destructive">{outOfStockCount}</div>
              )}
              <p className="text-xs text-muted-foreground">Items completely out</p>
            </CardContent>
          </Card>
        </div>

        {/* Product Management */}
        <Card className="shadow-medium">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              Product Catalog
            </CardTitle>
            <CardDescription>
              View and manage all your products and stock levels
            </CardDescription>
          </CardHeader>
          <CardContent>
            {productsLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <Skeleton className="h-12 w-12 rounded" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-[200px]" />
                      <Skeleton className="h-3 w-[150px]" />
                    </div>
                    <Skeleton className="h-8 w-20" />
                  </div>
                ))}
              </div>
            ) : (
              <ProductsTable products={products} />
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}

export default Inventory