import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="border-t border-border/30 bg-card/50">
    <div className="container mx-auto px-4 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="font-display font-bold text-primary-foreground text-sm">S</span>
            </div>
            <span className="font-display font-bold text-xl text-foreground">StreamVault</span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Tu plataforma de streaming favorita. Películas y series sin límites.
          </p>
        </div>
        <div>
          <h4 className="font-display font-semibold text-foreground mb-3">Explorar</h4>
          <div className="flex flex-col gap-2">
            <Link to="/search" className="text-sm text-muted-foreground hover:text-primary transition-colors">Películas</Link>
            <Link to="/search" className="text-sm text-muted-foreground hover:text-primary transition-colors">Series</Link>
            <Link to="/search" className="text-sm text-muted-foreground hover:text-primary transition-colors">Novedades</Link>
          </div>
        </div>
        <div>
          <h4 className="font-display font-semibold text-foreground mb-3">Cuenta</h4>
          <div className="flex flex-col gap-2">
            <Link to="/plans" className="text-sm text-muted-foreground hover:text-primary transition-colors">Planes</Link>
            <Link to="/login" className="text-sm text-muted-foreground hover:text-primary transition-colors">Iniciar Sesión</Link>
            <Link to="/register" className="text-sm text-muted-foreground hover:text-primary transition-colors">Registrarse</Link>
          </div>
        </div>
        <div>
          <h4 className="font-display font-semibold text-foreground mb-3">Soporte</h4>
          <div className="flex flex-col gap-2">
            <Link to="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">Contáctanos</Link>
            <span className="text-sm text-muted-foreground">FAQ</span>
            <span className="text-sm text-muted-foreground">Términos de uso</span>
          </div>
        </div>
      </div>
      <div className="mt-10 pt-6 border-t border-border/30 text-center">
        <p className="text-sm text-muted-foreground">© 2025 StreamVault. Todos los derechos reservados.</p>
      </div>
    </div>
  </footer>
);

export default Footer;
