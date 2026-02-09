import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Search, Menu, X, ChevronRight, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { movies } from "@/data/movies";
import { useAuth } from "@/context/AuthContext";

const navLinks = [
  { to: "/", label: "Inicio" },
  { to: "/search", label: "Explorar" },
  { to: "/plans", label: "Planes" },
  { to: "/contact", label: "Contacto" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { isAuthenticated, logout, user } = useAuth();

  
  useEffect(() => {
    setIsSearchOpen(false);
    setSearchQuery("");
  }, [location.pathname]);

  
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  }, [isSearchOpen]);

  const filteredMovies = searchQuery
    ? movies.filter((movie) =>
      movie.title.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 6)
    : [];

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isSearchOpen ? "bg-background/80 backdrop-blur-xl border-b border-border/50 h-auto shadow-lg" : "glass-card border-b border-border/50 h-16 lg:h-20"
        }`}>
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {}
            <Link to="/" className={`flex items-center gap-2 ${isSearchOpen ? "hidden md:flex" : "flex"}`}>
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="font-display font-bold text-primary-foreground text-sm">S</span>
              </div>
              <span className="font-display font-bold text-xl text-foreground">StreamVault</span>
            </Link>

            {}
            {!isSearchOpen && isAuthenticated && (
              <div className="hidden md:flex items-center gap-8 animate-fade-in">
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`text-sm font-medium transition-colors duration-200 hover:text-primary ${location.pathname === link.to ? "text-primary" : "text-muted-foreground"
                      }`}
                  >
                    {link.label}
                  </Link>
                ))}

                {}
                {user?.role?.includes("ADMIN") && (
                  <DropdownMenu>
                    <DropdownMenuTrigger className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-primary transition-colors focus:outline-none">
                      Entidades <ChevronDown className="w-4 h-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 bg-background/95 backdrop-blur-xl border-border/50 max-h-[80vh] overflow-y-auto">
                      <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">Auxiliares</div>
                      <DropdownMenuItem asChild><Link to="/admin/departments">Departamentos</Link></DropdownMenuItem>
                      <DropdownMenuItem asChild><Link to="/admin/cities">Ciudades</Link></DropdownMenuItem>
                      <DropdownMenuItem asChild><Link to="/admin/genres">Géneros</Link></DropdownMenuItem>
                      <DropdownMenuItem asChild><Link to="/admin/sex">Sexo</Link></DropdownMenuItem>
                      <DropdownMenuItem asChild><Link to="/admin/doctypes">Tipos de Documento</Link></DropdownMenuItem>

                      <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground mt-2">Talento</div>
                      <DropdownMenuItem asChild><Link to="/admin/actors">Actores</Link></DropdownMenuItem>
                      <DropdownMenuItem asChild><Link to="/admin/directors">Directores</Link></DropdownMenuItem>

                      <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground mt-2">Sistema</div>
                      <DropdownMenuItem asChild><Link to="/admin/content">Contenido Audiovisual</Link></DropdownMenuItem>
                      <DropdownMenuItem asChild><Link to="/admin/memberships">Membresías</Link></DropdownMenuItem>
                      <DropdownMenuItem asChild><Link to="/admin/users">Usuarios</Link></DropdownMenuItem>
                      <DropdownMenuItem asChild><Link to="/admin/customers">Clientes</Link></DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            )}

            {}
            <div className="flex items-center gap-3">
              {!isSearchOpen ? (
                <>
                  {isAuthenticated ? (
                    <>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsSearchOpen(true)}
                        className="text-muted-foreground hover:text-primary hover:bg-transparent"
                      >
                        <Search className="w-5 h-5" />
                      </Button>
                      <Button variant="outline" size="sm" className="hidden md:flex border-primary/30 text-primary hover:bg-primary/10" onClick={logout}>
                        Salir
                      </Button>
                    </>
                  ) : (
                    <div className="hidden md:flex items-center gap-3">
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
                  )}

                  {}
                  <button
                    className="md:hidden text-foreground"
                    onClick={() => setIsOpen(!isOpen)}
                  >
                    {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                  </button>
                </>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsSearchOpen(false)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <span className="mr-2">Cancelar</span>
                  <X className="w-5 h-5" />
                </Button>
              )}
            </div>
          </div>

          {}
          {isAuthenticated && isSearchOpen && (
            <div className="w-full pb-8 animate-slide-up">
              <div className="relative max-w-3xl mx-auto">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-muted-foreground" />
                <Input
                  ref={searchInputRef}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar películas, series, géneros..."
                  className="w-full pl-14 pr-4 py-6 text-xl bg-muted/50 border-none rounded-2xl focus-visible:ring-0 focus-visible:bg-muted/80 placeholder:text-muted-foreground/50"
                  autoComplete="off"
                />
              </div>

              {}
              {searchQuery && (
                <div className="max-w-5xl mx-auto mt-8">
                  {filteredMovies.length > 0 ? (
                    <>
                      <h3 className="text-sm font-medium text-muted-foreground mb-4 px-2">Resultados destacados</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {filteredMovies.map((movie) => (
                          <Link
                            key={movie.id}
                            to={`/movie/${movie.id}`}
                            className="group block"
                          >
                            <div className="relative aspect-[2/3] rounded-xl overflow-hidden mb-3 shadow-sm group-hover:shadow-md transition-all">
                              <img
                                src={movie.image}
                                alt={movie.title}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                              />
                            </div>
                            <h4 className="text-sm font-medium text-foreground truncate">{movie.title}</h4>
                            <p className="text-xs text-muted-foreground">{movie.year}</p>
                          </Link>
                        ))}
                      </div>
                      <div className="mt-6 text-center">
                        <Link
                          to={`/search?q=${searchQuery}`}
                          className="inline-flex items-center text-sm font-medium text-primary hover:underline"
                        >
                          Ver todos los resultados <ChevronRight className="w-4 h-4 ml-1" />
                        </Link>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-10">
                      <p className="text-muted-foreground">No encontramos coincidencias para "{searchQuery}"</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {}
          {isOpen && !isSearchOpen && (
            <div className="md:hidden py-4 border-t border-border/30 animate-fade-in">
              <div className="flex flex-col gap-3">
                {isAuthenticated ? (
                  <>
                    {navLinks.map((link) => (
                      <Link
                        key={link.to}
                        to={link.to}
                        onClick={() => setIsOpen(false)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${location.pathname === link.to
                          ? "text-primary bg-primary/10"
                          : "text-muted-foreground hover:text-foreground"
                          }`}
                      >
                        {link.label}
                      </Link>
                    ))}
                    <div className="px-3">
                      <Button variant="outline" size="sm" className="w-full border-primary/30 text-primary" onClick={() => { logout(); setIsOpen(false); }}>
                        Salir
                      </Button>
                    </div>
                  </>
                ) : (
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
                )}
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
