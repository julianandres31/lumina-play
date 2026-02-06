import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Search, Menu, X, User } from "lucide-react";
import { Button } from "@/components/ui/button";

const navLinks = [
  { to: "/", label: "Inicio" },
  { to: "/search", label: "Explorar" },
  { to: "/plans", label: "Planes" },
  { to: "/contact", label: "Contacto" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-border/50">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="font-display font-bold text-primary-foreground text-sm">S</span>
            </div>
            <span className="font-display font-bold text-xl text-foreground">StreamVault</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-sm font-medium transition-colors duration-200 hover:text-primary ${
                  location.pathname === link.to ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-3">
            <Link to="/search">
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                <Search className="w-5 h-5" />
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" size="sm" className="border-primary/30 text-primary hover:bg-primary/10">
                Iniciar Sesión
              </Button>
            </Link>
            <Link to="/register">
              <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                Registrarse
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-foreground"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Nav */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-border/30 animate-fade-in">
            <div className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsOpen(false)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    location.pathname === link.to
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex gap-2 mt-2 px-3">
                <Link to="/login" className="flex-1" onClick={() => setIsOpen(false)}>
                  <Button variant="outline" size="sm" className="w-full border-primary/30 text-primary">
                    Iniciar Sesión
                  </Button>
                </Link>
                <Link to="/register" className="flex-1" onClick={() => setIsOpen(false)}>
                  <Button size="sm" className="w-full bg-primary text-primary-foreground">
                    Registrarse
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
