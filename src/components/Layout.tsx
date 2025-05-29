
import { SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { useAuth } from "@/contexts/AuthContext";

interface LayoutProps {
  children: React.ReactNode;
  showSidebar?: boolean;
}

export function Layout({ children, showSidebar = true }: LayoutProps) {
  const { user } = useAuth();

  if (!showSidebar || !user) {
    return <div className="min-h-screen bg-hirrd-bg">{children}</div>;
  }

  return (
    <div className="min-h-screen flex w-full bg-hirrd-bg">
      <AppSidebar />
      <main className="flex-1">
        <div className="p-4 border-b border-hirrd-border">
          <SidebarTrigger className="text-gray-400 hover:text-white" />
        </div>
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
