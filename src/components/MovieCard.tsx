import { Link } from "react-router-dom";
import { Star, Lock, Play } from "lucide-react";
import type { Movie } from "@/data/movies";

const MovieCard = ({ movie }: { movie: Movie }) => (
  <Link to={`/movie/${movie.id}`} className="group block">
    <div className="glass-card-hover overflow-hidden">
      <div className="relative aspect-[2/3] overflow-hidden">
        <img
          src={movie.image}
          alt={movie.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="w-14 h-14 rounded-full bg-primary/90 flex items-center justify-center backdrop-blur-sm">
            <Play className="w-6 h-6 text-primary-foreground ml-0.5" />
          </div>
        </div>
        {movie.premium && (
          <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-md bg-accent/20 backdrop-blur-sm border border-accent/30">
            <Lock className="w-3 h-3 text-accent" />
            <span className="text-xs font-medium text-accent">Premium</span>
          </div>
        )}
      </div>
      <div className="p-3">
        <h3 className="font-display font-semibold text-foreground text-sm truncate">{movie.title}</h3>
        <div className="flex items-center justify-between mt-1">
          <span className="text-xs text-muted-foreground">{movie.year}</span>
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 text-primary fill-primary" />
            <span className="text-xs text-foreground font-medium">{movie.rating}</span>
          </div>
        </div>
      </div>
    </div>
  </Link>
);

export default MovieCard;
