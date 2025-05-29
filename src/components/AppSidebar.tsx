
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { Home, User, Settings, Users, LogOut, FileText } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function AppSidebar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const userItems = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: Home,
    },
    {
      title: "Profile",
      url: "/profile",
      icon: User,
    },
  ];

  const adminItems = [
    {
      title: "Admin Dashboard",
      url: "/admin/dashboard",
      icon: Users,
    },
    {
      title: "All Candidates",
      url: "/admin/candidates",
      icon: FileText,
    },
  ];

  if (!user) return null;

  return (
    <Sidebar className="border-r border-hirrd-border">
      <SidebarHeader className="p-4 border-b border-hirrd-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-hirrd-accent rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">H</span>
          </div>
          <span className="font-semibold text-lg gradient-text">Hirrd</span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-gray-400">Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {userItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={location.pathname === item.url}>
                    <Link to={item.url} className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-hirrd-secondary transition-colors">
                      <item.icon className="w-5 h-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {user.isAdmin && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-gray-400">Admin</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {adminItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={location.pathname === item.url}>
                      <Link to={item.url} className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-hirrd-secondary transition-colors">
                        <item.icon className="w-5 h-5" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-hirrd-border">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 bg-hirrd-secondary rounded-full flex items-center justify-center">
            <User className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user.name}</p>
            <p className="text-xs text-gray-400 truncate">{user.email}</p>
          </div>
        </div>
        <Button 
          variant="ghost" 
          onClick={logout}
          className="w-full justify-start gap-2 text-gray-400 hover:text-white hover:bg-hirrd-secondary"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
