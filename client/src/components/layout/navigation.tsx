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
  HelpCircle,
  BellRing,
  LogOut,
  User,
  Inbox,
  Lock,
  Settings,
} from "lucide-react";
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";

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
  const [showProfile, setShowProfile] = useState(false);
  const [showInbox, setShowInbox] = useState(false);
  const [notifications] = useState([
    // Demo notifications - in real app, these would come from your backend
    {
      id: 1,
      message: "Your document review is complete",
      timestamp: "10 mins ago"
    }
  ]);
  const isMobile = useIsMobile();
  const { toast } = useToast();

  const handleMenuAction = (action: string) => {
    switch (action) {
      case 'profile':
        setShowProfile(true);
        break;
      case 'inbox':
        setShowInbox(true);
        break;
      case 'lock':
        toast({
          title: "Lock Screen",
          description: "Locking your screen",
        });
        break;
      case 'logout':
        toast({
          title: "Logout",
          description: "Logging out...",
        });
        break;
    }
  };

  const NavContent = () => (
    <div className="space-y-2">
      <NavLink href="/" icon={Home}>Dashboard</NavLink>
      <NavLink href="/ai-documents" icon={FileText}>AI-Written Documents</NavLink>
      <NavLink href="/review" icon={Search}>Document Review</NavLink>
      <NavLink href="/consultation" icon={Users}>Legal Consultation</NavLink>
      <NavLink href="/documents" icon={FolderOpen}>Document Management</NavLink>
      <NavLink href="/pricing" icon={FileText}>Pricing</NavLink>
      <NavLink href="/help" icon={HelpCircle}>Help & Support</NavLink>
    </div>
  );

  const ProfileMenu = () => (
    <div className="flex items-center gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon" className="relative">
            <BellRing className="h-5 w-5" />
            {notifications.length > 0 && (
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-600" />
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-80">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="font-medium">Notifications</h4>
              {notifications.length > 0 && (
                <Button variant="ghost" size="sm" className="h-auto p-0">
                  Mark all as read
                </Button>
              )}
            </div>
            <div className="space-y-2">
              {notifications.length > 0 ? (
                notifications.map(notification => (
                  <div key={notification.id} className="flex items-start gap-2 p-2 hover:bg-muted rounded-lg">
                    <BellRing className="h-4 w-4 mt-1 text-muted-foreground" />
                    <div>
                      <p className="text-sm">{notification.message}</p>
                      <p className="text-xs text-muted-foreground">{notification.timestamp}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No messages from admin
                </p>
              )}
            </div>
          </div>
        </PopoverContent>
      </Popover>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/placeholder-avatar.jpg" alt="Profile" />
              <AvatarFallback>SP</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <div className="flex items-center gap-2 p-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/placeholder-avatar.jpg" alt="Profile" />
              <AvatarFallback>SP</AvatarFallback>
            </Avatar>
            <div className="flex flex-col space-y-0.5">
              <p className="text-sm font-medium">Shaun Park</p>
              <p className="text-xs text-muted-foreground">Project Leader</p>
            </div>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => handleMenuAction('profile')}>
            <User className="mr-2 h-4 w-4" />
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleMenuAction('inbox')}>
            <Inbox className="mr-2 h-4 w-4" />
            Inbox
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleMenuAction('lock')}>
            <Lock className="mr-2 h-4 w-4" />
            Lock Screen
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-red-600"
            onClick={() => handleMenuAction('logout')}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Log Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Profile Dialog */}
      <Dialog open={showProfile} onOpenChange={setShowProfile}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Profile</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src="/placeholder-avatar.jpg" alt="Profile" />
                <AvatarFallback>SP</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-lg font-medium">Shaun Park</h3>
                <p className="text-sm text-muted-foreground">Project Leader</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span>@shaunpark</span>
              </div>
              <div className="flex items-center gap-2">
                <Inbox className="h-4 w-4 text-muted-foreground" />
                <span>shaun.park@example.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Settings className="h-4 w-4 text-muted-foreground" />
                <span>Account Settings</span>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Inbox Dialog */}
      <Dialog open={showInbox} onOpenChange={setShowInbox}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Inbox</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {notifications.length > 0 ? (
              notifications.map(notification => (
                <div key={notification.id} className="flex items-start gap-2 p-2 hover:bg-muted rounded-lg">
                  <BellRing className="h-4 w-4 mt-1 text-muted-foreground" />
                  <div>
                    <p className="text-sm">{notification.message}</p>
                    <p className="text-xs text-muted-foreground">{notification.timestamp}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                Your inbox is empty
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );

  return (
    <nav className="border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center border-b px-4 justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <span className="font-bold">Vidhik AI</span>
        </Link>
        <ProfileMenu />
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