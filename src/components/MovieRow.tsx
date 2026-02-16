import MovieCard from "./MovieCard";
import type { Movie } from "@/types/content";

interface MovieRowProps {
  title: string;
  movies: Movie[];
}

const MovieRow = ({ title, movies }: MovieRowProps) => (
  <section className="py-8">
    <h2 className="font-display text-xl md:text-2xl font-bold text-foreground mb-5">{title}</h2>
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  </section>
);

export default MovieRow;
