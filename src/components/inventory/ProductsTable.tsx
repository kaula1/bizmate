import { useState } from "react";
import { ProductWithInventory } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ProductForm } from "./ProductForm";
import { StockAdjustmentForm } from "./StockAdjustmentForm";
import { useDeleteProduct } from "@/hooks/useProducts";
import { Search, MoreHorizontal, Edit, Trash2 } from "lucide-react";

interface ProductsTableProps {
  products: ProductWithInventory[];
}

export const ProductsTable = ({ products }: ProductsTableProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const deleteProduct = useDeleteProduct();

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStockStatus = (product: ProductWithInventory) => {
    const stock = product.inventory_level?.current_stock || 0;
    const minStock = product.inventory_level?.min_stock_level || 0;

    if (stock === 0) return { label: "Out of Stock", variant: "destructive" as const };
    if (stock <= minStock) return { label: "Low Stock", variant: "secondary" as const, className: "bg-warning/10 text-warning-foreground border-warning/20" };
    return { label: "In Stock", variant: "secondary" as const };
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
    }).format(amount);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <ProductForm />
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Product</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[70px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  {products.length === 0 ? "No products found. Add your first product to get started." : "No products match your search."}
                </TableCell>
              </TableRow>
            ) : (
              filteredProducts.map((product) => {
                const stockStatus = getStockStatus(product);
                const currentStock = product.inventory_level?.current_stock || 0;
                
                return (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{product.name}</div>
                        {product.description && (
                          <div className="text-sm text-muted-foreground">
                            {product.description}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {product.sku || "-"}
                    </TableCell>
                    <TableCell>
                      {product.category || "-"}
                    </TableCell>
                    <TableCell className="font-medium">
                      {formatCurrency(product.unit_price)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">
                          {currentStock.toLocaleString()}
                        </span>
                        <StockAdjustmentForm
                          productId={product.id}
                          productName={product.name}
                          currentStock={currentStock}
                          trigger={
                            <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                              Adjust
                            </Button>
                          }
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={stockStatus.variant}
                        className={stockStatus.className}
                      >
                        {stockStatus.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <ProductForm
                            product={product}
                            trigger={
                              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Product
                              </DropdownMenuItem>
                            }
                          />
                          <DropdownMenuItem
                            onClick={() => deleteProduct.mutate(product.id)}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Product
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};