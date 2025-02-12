import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
  const [location] = useLocation();
  const isActive = location === href;

  return (
    <Link href={href}>
      <Button 
        variant={isActive ? "secondary" : "ghost"} 
        className="w-full md:w-auto"
      >
        {children}
      </Button>
    </Link>
  );
};

export default function Navigation() {
  const [open, setOpen] = useState(false);
  const isMobile = useIsMobile();

  const NavContent = () => (
    <>
      <NavLink href="/">Dashboard</NavLink>
      <NavLink href="/consultation">AI Consultation</NavLink>
      <NavLink href="/review">Document Review</NavLink>
    </>
  );

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold">Vidhik AI</span>
          </Link>
        </div>

        {isMobile ? (
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
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
          <div className="flex items-center space-x-4">
            <NavContent />
          </div>
        )}
      </div>
    </nav>
  );
}