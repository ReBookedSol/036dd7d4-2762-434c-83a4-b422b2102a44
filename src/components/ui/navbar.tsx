import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Brain, Menu, X, User, Shield } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";

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
              <h1 className="text-lg font-bold text-foreground">ReBooked ZA</h1>
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

      {/* Mobile Menu with smooth animation */}
      <div className={`md:hidden overflow-hidden transition-[max-height,opacity,transform] duration-300 ease-in-out ${open ? 'max-h-[480px] opacity-100 translate-y-0' : 'max-h-0 opacity-0 -translate-y-2'}`} aria-hidden={!open}>
        <div className="bg-background/95 border-t border-border shadow-sm">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-col space-y-4">
              <div className="flex flex-col space-y-2">
                <Link to="/nbt" className="block text-base font-medium text-foreground" onClick={() => setOpen(false)}>NBT</Link>
                <Link to="/grades" className="block text-base font-medium text-foreground" onClick={() => setOpen(false)}>Grades</Link>
                <Link to="/subjects" className="block text-base font-medium text-foreground" onClick={() => setOpen(false)}>Learning Center</Link>
                <Link to="/about" className="block text-base font-medium text-foreground" onClick={() => setOpen(false)}>About</Link>
              </div>

              <div className="flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0">
                {user ? (
                  <>
                    {isAdmin && (
                      <Link to="/admin" onClick={() => setOpen(false)}>
                        <Button variant="outline" className="w-full sm:w-auto">
                          <Shield className="h-4 w-4 mr-2" />
                          Admin
                        </Button>
                      </Link>
                    )}
                    <Link to="/profile" onClick={() => setOpen(false)}>
                      <Button variant="outline" className="w-full sm:w-auto">
                        <User className="h-4 w-4 mr-2" />
                        Profile
                      </Button>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link to="/auth" onClick={() => setOpen(false)}>
                      <Button variant="ghost" className="w-full sm:w-auto">Sign In</Button>
                    </Link>
                    <Link to="/auth" onClick={() => setOpen(false)}>
                      <Button className="w-full sm:w-auto">Get Started</Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};
