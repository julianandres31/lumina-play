import { Link } from "react-router-dom";
import { Play, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Movie } from "@/types/content";
import dragonBall from "@/public/movies/dragon-ball.jpg";

interface HeroSectionProps {
  featured: Movie;
}

const HeroSection = ({ featured }: HeroSectionProps) => (
  <section className="relative h-[85vh] min-h-[600px] flex items-end">
    { }
    <div className="absolute inset-0">
      <img src="/movies/dragon-ball.jpg" alt="" className="w-full h-full object-cover" />
      <div className="hero-gradient-overlay absolute inset-0" />
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/40 to-transparent" />
    </div>

    { }
    <div className="relative container mx-auto px-4 lg:px-8 pb-16 lg:pb-24 max-w-3xl mr-auto">
      <div className="animate-fade-in">
        <div className="flex items-center gap-2 mb-4">
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary/20 text-primary border border-primary/30">
            Destacado
          </span>
          <span className="text-sm text-muted-foreground">{featured.year} · {featured.duration}</span>
        </div>
        <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-4 leading-tight">
          {featured.title}
        </h1>
        <p className="text-muted-foreground text-base md:text-lg max-w-xl mb-8 leading-relaxed">
          {featured.synopsis}
        </p>
        <div className="flex flex-wrap gap-3">
          <Link to={`/movie/${featured.id}`}>
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2 neon-glow">
              <Play className="w-5 h-5" />
              Ver Ahora
            </Button>
          </Link>
          <Link to={`/movie/${featured.id}`}>
            <Button size="lg" variant="outline" className="border-foreground/20 text-foreground hover:bg-foreground/10 gap-2">
              <Info className="w-5 h-5" />
              Más Información
            </Button>
          </Link>
        </div>
      </div>
    </div>
  </section>
);

export default HeroSection;
