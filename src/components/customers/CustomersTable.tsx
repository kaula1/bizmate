import { useState } from "react";
import { Customer } from "@/lib/types";
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
import { CustomerForm } from "./CustomerForm";
import { useDeleteCustomer } from "@/hooks/useCustomers";
import { Search, MoreHorizontal, Edit, Trash2, Phone, Mail, MapPin, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface CustomersTableProps {
  customers: Customer[];
  onSearchChange: (search: string) => void;
  searchTerm: string;
}

export const CustomersTable = ({ customers, onSearchChange, searchTerm }: CustomersTableProps) => {
  const deleteCustomer = useDeleteCustomer();
  const navigate = useNavigate();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-KE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        <CustomerForm />
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Customer</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[70px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  {searchTerm ? "No customers match your search." : "No customers found. Add your first customer to get started."}
                </TableCell>
              </TableRow>
            ) : (
              customers.map((customer) => (
                <TableRow 
                  key={customer.id}
                  className="cursor-pointer hover:bg-muted/30"
                  onClick={() => navigate(`/customers/${customer.id}`)}
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-full">
                        <User className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium">{customer.name}</div>
                        {customer.notes && (
                          <div className="text-sm text-muted-foreground truncate max-w-[200px]">
                            {customer.notes}
                          </div>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {customer.phone && (
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="w-3 h-3 text-muted-foreground" />
                          <span>{customer.phone}</span>
                        </div>
                      )}
                      {customer.email && (
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="w-3 h-3 text-muted-foreground" />
                          <span className="truncate max-w-[150px]">{customer.email}</span>
                        </div>
                      )}
                      {!customer.phone && !customer.email && (
                        <span className="text-sm text-muted-foreground">No contact info</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {customer.address ? (
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                        <span className="truncate max-w-[150px]">{customer.address}</span>
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">No address</span>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDate(customer.created_at)}
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={customer.is_active ? "secondary" : "outline"}
                      className={customer.is_active ? "bg-success/10 text-success-foreground border-success/20" : ""}
                    >
                      {customer.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <CustomerForm
                          customer={customer}
                          trigger={
                            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit Customer
                            </DropdownMenuItem>
                          }
                        />
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteCustomer.mutate(customer.id);
                          }}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Customer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};