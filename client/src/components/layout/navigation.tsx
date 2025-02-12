import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { 
  Menu, 
  Home,
  FileText, 
  Search,
  Users,
  FolderOpen,
  Settings,
  HelpCircle
} from "lucide-react";
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

const NavLink = ({ href, icon: Icon, children }: { 
  href: string; 
  icon: React.ElementType;
  children: React.ReactNode 
}) => {
  const [location] = useLocation();
  const isActive = location === href;

  return (
    <Link href={href}>
      <Button 
        variant={isActive ? "secondary" : "ghost"} 
        className="w-full justify-start gap-2"
      >
        <Icon className="h-4 w-4" />
        {children}
      </Button>
    </Link>
  );
};

export default function Navigation() {
  const [open, setOpen] = useState(false);
  const isMobile = useIsMobile();

  const NavContent = () => (
    <div className="space-y-2">
      <NavLink href="/" icon={Home}>Dashboard</NavLink>
      <NavLink href="/ai-documents" icon={FileText}>AI-Written Documents</NavLink>
      <NavLink href="/review" icon={Search}>Document Review</NavLink>
      <NavLink href="/consultation" icon={Users}>Legal Consultation</NavLink>
      <NavLink href="/documents" icon={FolderOpen}>Document Management</NavLink>
      <NavLink href="/settings" icon={Settings}>Settings & Profile</NavLink>
      <NavLink href="/help" icon={HelpCircle}>Help & Support</NavLink>
    </div>
  );

  return (
    <nav className="border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center border-b px-4">
        <Link href="/" className="flex items-center space-x-2">
          <span className="font-bold">Vidhik AI</span>
        </Link>
      </div>

      {isMobile ? (
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden ml-2">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[240px] sm:w-[280px]">
            <div className="flex flex-col space-y-4 mt-4">
              <NavContent />
            </div>
          </SheetContent>
        </Sheet>
      ) : (
        <div className="h-[calc(100vh-3.5rem)] w-64 border-r p-4">
          <NavContent />
        </div>
      )}
    </nav>
  );
}