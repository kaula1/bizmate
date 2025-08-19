import { BarChart3, Home, Package, ShoppingCart, Users, CreditCard, Settings, Building2 } from "lucide-react"
import { NavLink, useLocation } from "react-router-dom"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar"

const navigation = [
  { 
    title: "Dashboard", 
    url: "/", 
    icon: Home,
    description: "Overview & Analytics"
  },
  { 
    title: "POS", 
    url: "/pos", 
    icon: ShoppingCart,
    description: "Point of Sale"
  },
  { 
    title: "Inventory", 
    url: "/inventory", 
    icon: Package,
    description: "Stock Management"
  },
  { 
    title: "Customers", 
    url: "/customers", 
    icon: Users,
    description: "Customer Database"
  },
  { 
    title: "Transactions", 
    url: "/transactions", 
    icon: CreditCard,
    description: "Sales & Purchases"
  },
  { 
    title: "Analytics", 
    url: "/analytics", 
    icon: BarChart3,
    description: "Business Insights"
  },
]

const settingsNavigation = [
  { 
    title: "Organization", 
    url: "/settings/organization", 
    icon: Building2,
    description: "Org Settings"
  },
  { 
    title: "Account", 
    url: "/settings/account", 
    icon: Settings,
    description: "User Settings"
  },
]

export function AppSidebar() {
  const { state } = useSidebar()
  const collapsed = state === "collapsed"
  const location = useLocation()
  const currentPath = location.pathname

  const isActive = (path: string) => {
    if (path === "/") return currentPath === "/"
    return currentPath.startsWith(path)
  }

  const getNavClassName = (path: string) => {
    const active = isActive(path)
    return active 
      ? "bg-primary text-primary-foreground shadow-soft" 
      : "hover:bg-accent/50 text-muted-foreground hover:text-foreground"
  }

  return (
    <Sidebar 
      className={`transition-all duration-300 ${collapsed ? "w-16" : "w-64"}`}
      collapsible="icon"
    >
      <SidebarHeader className="p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
            <Building2 className="w-5 h-5 text-primary-foreground" />
          </div>
          {!collapsed && (
            <div>
              <h2 className="font-bold text-lg text-foreground">BizMate</h2>
              <p className="text-xs text-muted-foreground">Business Manager</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-4 py-2">
        <SidebarGroup>
          <SidebarGroupLabel className={collapsed ? "sr-only" : ""}>
            Main Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {navigation.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="h-11">
                    <NavLink 
                      to={item.url} 
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${getNavClassName(item.url)}`}
                    >
                      <item.icon className="w-5 h-5 flex-shrink-0" />
                      {!collapsed && (
                        <div className="flex-1 min-w-0">
                          <span className="font-medium truncate">{item.title}</span>
                          <p className="text-xs opacity-75 truncate">{item.description}</p>
                        </div>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-8">
          <SidebarGroupLabel className={collapsed ? "sr-only" : ""}>
            Settings
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {settingsNavigation.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="h-11">
                    <NavLink 
                      to={item.url} 
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${getNavClassName(item.url)}`}
                    >
                      <item.icon className="w-5 h-5 flex-shrink-0" />
                      {!collapsed && (
                        <div className="flex-1 min-w-0">
                          <span className="font-medium truncate">{item.title}</span>
                          <p className="text-xs opacity-75 truncate">{item.description}</p>
                        </div>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-border">
        {!collapsed && (
          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              Made for Kenyan SMEs
            </p>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  )
}