import { useParams, Link } from "react-router-dom";
import { Star, Clock, Calendar, Play, ArrowLeft, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import MovieCard from "@/components/MovieCard";
import { movies } from "@/data/movies";

const MovieDetail = () => {
  const { id } = useParams();
  const movie = movies.find((m) => m.id === id);

  if (!movie) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <p className="text-muted-foreground text-lg">Película no encontrada</p>
          <Link to="/" className="text-primary hover:underline mt-4 inline-block">Volver al inicio</Link>
        </div>
      </Layout>
    );
  }

  const related = movies.filter((m) => m.id !== movie.id).slice(0, 4);

  return (
    <Layout>
      {}
      <div className="relative h-[60vh] min-h-[400px]">
        <img src={movie.image} alt={movie.title} className="w-full h-full object-cover" />
        <div className="hero-gradient-overlay absolute inset-0" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent" />
      </div>

      <div className="container mx-auto px-4 lg:px-8 -mt-48 relative z-10">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Volver
        </Link>

        <div className="flex flex-col md:flex-row gap-8">
          {}
          <div className="w-48 md:w-64 flex-shrink-0">
            <img src={movie.image} alt={movie.title} className="w-full rounded-xl shadow-2xl" />
          </div>

          {}
          <div className="flex-1 animate-fade-in">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              {movie.genre.map((g) => (
                <span key={g} className="px-3 py-1 rounded-full text-xs font-medium bg-muted/50 text-muted-foreground border border-border/50">
                  {g}
                </span>
              ))}
              {movie.premium && (
                <span className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-accent/10 text-accent border border-accent/30">
                  <Lock className="w-3 h-3" />
                  Premium
                </span>
              )}
            </div>
            <h1 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-4">{movie.title}</h1>
            <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-muted-foreground">
              <span className="flex items-center gap-1"><Star className="w-4 h-4 text-primary fill-primary" />{movie.rating}/10</span>
              <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{movie.duration}</span>
              <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{movie.year}</span>
            </div>
            <p className="text-foreground/80 leading-relaxed mb-8 max-w-2xl">{movie.synopsis}</p>
            <div className="flex flex-wrap gap-3">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2 neon-glow">
                <Play className="w-5 h-5" />
                Ver Ahora
              </Button>
            </div>
          </div>
        </div>

        {}
        <section className="mt-16 mb-8">
          <h2 className="font-display text-xl font-bold text-foreground mb-5">También te puede gustar</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {related.map((m) => (
              <MovieCard key={m.id} movie={m} />
            ))}
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default MovieDetail;
