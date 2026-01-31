import { ReactNode, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Building2, 
  Package, 
  FileText, 
  Settings,
  Menu,
  X,
  ChevronLeft,
  Home,
  ChevronRight,
} from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ProfileDropdown } from "@/components/layout/ProfileDropdown";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface AppLayoutProps {
  children: ReactNode;
}

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Facilities", href: "/facilities", icon: Building2 },
  { name: "Inventory", href: "/inventory", icon: Package },
  { name: "Reports", href: "/reports", icon: FileText },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function AppLayout({ children }: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const location = useLocation();
  const pathParts = location.pathname.split("/").filter(Boolean);

  return (
    <div className="min-h-screen flex bg-secondary">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-foreground/10 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 bg-sidebar border-r border-sidebar-border transition-all duration-300 lg:static lg:z-auto flex flex-col",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          sidebarCollapsed ? "w-16" : "w-60"
        )}
      >
        {/* Logo area */}
        <div className={cn(
          "h-16 border-b border-sidebar-border flex items-center gap-3 shrink-0",
          sidebarCollapsed ? "px-3 justify-center" : "px-4"
        )}>
          <div className="w-9 h-9 rounded overflow-hidden shrink-0">
            <img src="/PUPLogo.png" alt="PUP Logo" className="w-9 h-9 object-cover" />
          </div>
          {!sidebarCollapsed && (
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-semibold text-foreground truncate">PUP Facility</span>
              <span className="text-xs text-muted-foreground truncate">Management System</span>
            </div>
          )}
          <Button 
            variant="ghost" 
            size="icon" 
            className="ml-auto lg:hidden shrink-0"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className={cn("flex-1 p-3 space-y-1", sidebarCollapsed && "px-2")}>
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <NavLink
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded transition-all",
                  sidebarCollapsed && "justify-center px-2",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
                onClick={() => setSidebarOpen(false)}
                title={sidebarCollapsed ? item.name : undefined}
              >
                <item.icon className={cn("h-4 w-4 shrink-0", isActive && "text-primary-foreground")} />
                {!sidebarCollapsed && <span>{item.name}</span>}
              </NavLink>
            );
          })}
        </nav>

        {/* Collapse button - desktop only */}
        <div className="hidden lg:block p-3 border-t border-sidebar-border">
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "w-full justify-center text-muted-foreground hover:text-foreground",
              !sidebarCollapsed && "justify-start"
            )}
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          >
            <ChevronLeft className={cn("h-4 w-4 transition-transform", sidebarCollapsed && "rotate-180")} />
            {!sidebarCollapsed && <span className="ml-2 text-xs">Collapse</span>}
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top header */}
        <header className="h-16 bg-card border-b border-border flex items-center px-4 lg:px-6 gap-4 shrink-0 shadow-soft">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-muted-foreground hover:text-foreground"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex-1 min-w-0">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <NavLink to="/" className="inline-flex items-center gap-2">
                      <Home className="h-4 w-4" />
                    </NavLink>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                {pathParts.map((part, idx) => {
                  const accumulated = "/" + pathParts.slice(0, idx + 1).join("/");
                  const isLast = idx === pathParts.length - 1;
                  const name =
                    navigation.find((n) => n.href === accumulated)?.name ||
                    decodeURIComponent(part).replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

                  return (
                    <>
                      <BreadcrumbSeparator key={"sep-" + accumulated}>
                        <ChevronRight className="h-3 w-3 text-slate-300" />
                      </BreadcrumbSeparator>
                      <BreadcrumbItem key={accumulated}>
                        {isLast ? (
                          <BreadcrumbPage className="text-black font-medium">{name}</BreadcrumbPage>
                        ) : (
                          <BreadcrumbLink asChild>
                            <NavLink to={accumulated} className="text-sm font-normal" style={{ color: "#800000" }}>
                              {name}
                            </NavLink>
                          </BreadcrumbLink>
                        )}
                      </BreadcrumbItem>
                    </>
                  );
                })}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="flex items-center gap-4 shrink-0">
            <span className="text-xs text-muted-foreground hidden sm:block">
              Polytechnic University of the Philippines
            </span>
            <ProfileDropdown />
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-6 overflow-auto scrollbar-thin">
          {children}
        </main>
      </div>
    </div>
  );
}
