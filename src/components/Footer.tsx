import { Button } from "@/components/ui/button";
import { Facebook, Twitter, Instagram, Linkedin, Mail, Brain } from "lucide-react";
import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="bg-foreground text-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Brain className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-background">ReBooked ZA</h3>
                <p className="text-xs text-background/80">Past Papers & Study Resources</p>
              </div>
            </div>
            <p className="text-sm text-background/80">
              Access thousands of high-quality past exam papers, study guides, and resources. Boost your confidence and excel in your studies.
            </p>
            <div className="flex space-x-3">
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-background hover:bg-background/10">
                <Facebook className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-background hover:bg-background/10">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-background hover:bg-background/10">
                <Instagram className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-background hover:bg-background/10">
                <Linkedin className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-background">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/grades" className="text-sm text-background/80 hover:text-background transition-colors">Grades</Link></li>
              <li><Link to="/subjects" className="text-sm text-background/80 hover:text-background transition-colors">Learning Center</Link></li>
              <li><Link to="/study-guides" className="text-sm text-background/80 hover:text-background transition-colors">Study Guides</Link></li>
              <li><Link to="/pricing" className="text-sm text-background/80 hover:text-background transition-colors">Pricing</Link></li>
              <li><Link to="/practice-tests" className="text-sm text-background/80 hover:text-background transition-colors">Practice Tests</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h4 className="font-semibold text-background">Support</h4>
            <ul className="space-y-2">
              <li><Link to="/help-center" className="text-sm text-background/80 hover:text-background transition-colors">Help Center</Link></li>
              <li><Link to="/contact" className="text-sm text-background/80 hover:text-background transition-colors">Contact Us</Link></li>
              <li><Link to="/privacy" className="text-sm text-background/80 hover:text-background transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-sm text-background/80 hover:text-background transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-background/20 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-background/70">
            © {new Date().getFullYear()} Rebooked Solutions. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/privacy" className="text-sm text-background/80 hover:text-background transition-colors">Privacy</Link>
            <Link to="/terms" className="text-sm text-background/80 hover:text-background transition-colors">Terms</Link>
            <a href="#" className="text-sm text-background/80 hover:text-background transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
