import { useState } from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Brain, Menu, X, User, Shield } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { user, profile, isAdmin } = useAuth();

  return (
    <nav className="w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Brain className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">ReBooked <span className="inline-block">Genius<sup className="text-[10px] text-muted-foreground align-super ml-1">ZA</sup></span></h1>
              <p className="text-xs text-muted-foreground">Past Papers & Study Resources</p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/nbt" className="text-sm font-medium text-foreground hover:text-primary transition-colors">NBT</Link>
            <Link to="/grades" className="text-sm font-medium text-foreground hover:text-primary transition-colors">Grades</Link>
            <Link to="/subjects" className="text-sm font-medium text-foreground hover:text-primary transition-colors">Learning Center</Link>
            <Link to="/about" className="text-sm font-medium text-foreground hover:text-primary transition-colors">About</Link>
          </div>

          {/* Auth (desktop) + Mobile toggle */}
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2">
              {user ? (
                <>
                  {isAdmin && (
                    <Link to="/admin">
                      <Button variant="outline" size="sm">
                        <Shield className="h-4 w-4 mr-2" />
                        Admin
                      </Button>
                    </Link>
                  )}
                  <Link to="/profile">
                    <Button variant="outline" size="sm">
                      <User className="h-4 w-4 mr-2" />
                      Profile
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/auth">
                    <Button variant="ghost" size="sm">Sign In</Button>
                  </Link>
                  <Link to="/auth">
                    <Button size="sm">Get Started</Button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile menu drawer */}
            <div className="md:hidden">
              <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                  <button aria-label={open ? "Close menu" : "Open menu"} className="inline-flex items-center justify-center p-2 rounded-md text-muted-foreground hover:bg-muted/20">
                    {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                  </button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[320px] sm:w-[360px] p-0">
                  <div className="p-4 border-b border-border">
                    <Link to="/" onClick={() => setOpen(false)} className="flex items-center space-x-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                        <Brain className="h-5 w-5" />
                      </div>
                      <div>
                        <h2 className="text-base font-bold">ReBooked Genius</h2>
                        <p className="text-xs text-muted-foreground">Past Papers & Study Resources</p>
                      </div>
                    </Link>
                  </div>
                  <nav className="p-4 grid gap-2">
                    <Link to="/nbt" onClick={() => setOpen(false)} className="w-full">
                      <Button variant="ghost" className="w-full justify-start">NBT</Button>
                    </Link>
                    <Link to="/grades" onClick={() => setOpen(false)} className="w-full">
                      <Button variant="ghost" className="w-full justify-start">Grades</Button>
                    </Link>
                    <Link to="/subjects" onClick={() => setOpen(false)} className="w-full">
                      <Button variant="ghost" className="w-full justify-start">Learning Center</Button>
                    </Link>
                    <Link to="/about" onClick={() => setOpen(false)} className="w-full">
                      <Button variant="ghost" className="w-full justify-start">About</Button>
                    </Link>

                    <div className="border-t border-border my-2" />
                    {user ? (
                      <>
                        {isAdmin && (
                          <Link to="/admin" onClick={() => setOpen(false)} className="w-full">
                            <Button variant="outline" className="w-full justify-start">Admin</Button>
                          </Link>
                        )}
                        <Link to="/profile" onClick={() => setOpen(false)} className="w-full">
                          <Button variant="outline" className="w-full justify-start">Profile</Button>
                        </Link>
                      </>
                    ) : (
                      <>
                        <Link to="/auth" onClick={() => setOpen(false)} className="w-full">
                          <Button variant="ghost" className="w-full justify-start">Sign In</Button>
                        </Link>
                        <Link to="/auth" onClick={() => setOpen(false)} className="w-full">
                          <Button className="w-full justify-start">Get Started</Button>
                        </Link>
                      </>
                    )}
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>

    </nav>
  );
};
