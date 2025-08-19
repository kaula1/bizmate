import { AppLayout } from "@/components/layout/AppLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, TrendingUp, Users, Package, AlertTriangle, ShoppingCart } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/hooks/useAuth"

const Index = () => {
  const { profile } = useAuth();
  // Mock data for KPIs
  const kpiData = [
    {
      title: "Total Sales (30d)",
      value: "KES 247,500",
      change: "+12.5%",
      trend: "up",
      icon: TrendingUp,
      description: "Revenue this month"
    },
    {
      title: "Active Customers",
      value: "1,247",
      change: "+3.2%",
      trend: "up", 
      icon: Users,
      description: "Registered customers"
    },
    {
      title: "Products in Stock",
      value: "1,834",
      change: "-2.1%",
      trend: "down",
      icon: Package,
      description: "Available inventory"
    },
    {
      title: "Low Stock Alerts",
      value: "23",
      change: "",
      trend: "warning",
      icon: AlertTriangle,
      description: "Items need reordering"
    }
  ]

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {profile?.display_name}! Here's what's happening with your business today.
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {kpiData.map((kpi, index) => (
            <Card key={index} className="bg-gradient-card border-0 shadow-soft">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {kpi.title}
                </CardTitle>
                <kpi.icon className={`h-4 w-4 ${
                  kpi.trend === 'up' ? 'text-success' : 
                  kpi.trend === 'down' ? 'text-muted-foreground' : 
                  'text-warning'
                }`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{kpi.value}</div>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">{kpi.description}</p>
                  {kpi.change && (
                    <Badge variant={kpi.trend === 'up' ? 'default' : 'secondary'} className="text-xs">
                      {kpi.change}
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card className="bg-gradient-primary border-0 text-primary-foreground shadow-medium">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Quick Sale
              </CardTitle>
              <CardDescription className="text-primary-foreground/80">
                Start a new transaction in POS
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">Process sales, accept payments, and manage your point of sale efficiently.</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-secondary border-0 text-secondary-foreground shadow-medium">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Stock Check
              </CardTitle>
              <CardDescription className="text-secondary-foreground/80">
                Review inventory levels
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">Monitor stock levels, set reorder points, and manage your inventory.</p>
            </CardContent>
          </Card>

          <Card className="border-border shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Analytics
              </CardTitle>
              <CardDescription>
                View business insights
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Track performance metrics and generate reports for your business.</p>
            </CardContent>
          </Card>
        </div>

        {/* Welcome Message for First Time Users */}
        <Card className="border-dashed border-2 border-muted">
          <CardHeader>
            <CardTitle className="text-xl">Welcome to BizMate! 🇰🇪</CardTitle>
            <CardDescription>
              Your complete business management solution designed for Kenyan SMEs
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Get started by setting up your first product in the Inventory section, 
              then you can begin processing sales through our POS system.
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">Multi-currency support</Badge>
              <Badge variant="outline">Offline-ready PWA</Badge>
              <Badge variant="outline">Real-time analytics</Badge>
              <Badge variant="outline">Mobile-optimized</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
};

export default Index;
