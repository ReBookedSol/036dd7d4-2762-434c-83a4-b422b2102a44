import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Brain, Menu, X } from "lucide-react";

export const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Brain className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">ReBooked Genius</h1>
              <p className="text-xs text-muted-foreground">Past Papers & Study Resources</p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-sm font-medium text-foreground hover:text-primary transition-colors">Home</a>
            <a href="#" className="text-sm font-medium text-foreground hover:text-primary transition-colors">Browse Papers</a>
            <a href="#" className="text-sm font-medium text-foreground hover:text-primary transition-colors">Subjects</a>
            <a href="#" className="text-sm font-medium text-foreground hover:text-primary transition-colors">About</a>
          </div>

          {/* Search and Auth (desktop) + Mobile toggle */}
          <div className="flex items-center space-x-4">
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input 
                placeholder="Search past papers..."
                className="w-64 pl-9"
              />
            </div>

            <div className="hidden md:flex items-center space-x-2">
              <Button variant="ghost" size="sm">Sign In</Button>
              <Button size="sm">Get Started</Button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                aria-label={open ? "Close menu" : "Open menu"}
                onClick={() => setOpen(!open)}
                className="inline-flex items-center justify-center p-2 rounded-md text-muted-foreground hover:bg-muted/20"
              >
                {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-background/95 border-t border-border shadow-sm">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-col space-y-4">
              <div className="flex flex-col space-y-2">
                <a href="#" className="block text-base font-medium text-foreground">Home</a>
                <a href="#" className="block text-base font-medium text-foreground">Browse Papers</a>
                <a href="#" className="block text-base font-medium text-foreground">Subjects</a>
                <a href="#" className="block text-base font-medium text-foreground">About</a>
              </div>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Search past papers..." className="pl-9" />
              </div>

              <div className="flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0">
                <Button variant="ghost">Sign In</Button>
                <Button>Get Started</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
