import { useState, useMemo } from "react";
import { Search as SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import Layout from "@/components/Layout";
import MovieCard from "@/components/MovieCard";
import { movies, genres } from "@/data/movies";

const years = ["Todos", "2025", "2024"];
const sortOptions = [
  { value: "rating", label: "Popularidad" },
  { value: "year", label: "Año" },
  { value: "title", label: "A-Z" },
];

const Search = () => {
  const [query, setQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("Todos");
  const [selectedYear, setSelectedYear] = useState("Todos");
  const [sortBy, setSortBy] = useState("rating");

  const filtered = useMemo(() => {
    let result = [...movies];
    if (query) result = result.filter((m) => m.title.toLowerCase().includes(query.toLowerCase()));
    if (selectedGenre !== "Todos") result = result.filter((m) => m.genre.includes(selectedGenre));
    if (selectedYear !== "Todos") result = result.filter((m) => m.year === parseInt(selectedYear));
    result.sort((a, b) => {
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "year") return b.year - a.year;
      return a.title.localeCompare(b.title);
    });
    return result;
  }, [query, selectedGenre, selectedYear, sortBy]);

  return (
    <Layout>
      <div className="container mx-auto px-4 lg:px-8 py-10">
        <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-8">Explorar</h1>

        {}
        <div className="space-y-5 mb-10">
          <div className="relative max-w-lg">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Buscar películas o series..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-11 bg-muted/50 border-border/50 focus:border-primary h-12 text-base"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {genres.slice(0, 8).map((genre) => (
              <button
                key={genre}
                onClick={() => setSelectedGenre(genre)}
                className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${
                  selectedGenre === genre
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground border border-border/50"
                }`}
              >
                {genre}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-3">
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="bg-muted/50 border border-border/50 rounded-lg px-3 py-2 text-sm text-foreground focus:border-primary outline-none"
            >
              {years.map((y) => (
                <option key={y} value={y}>{y === "Todos" ? "Todos los años" : y}</option>
              ))}
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-muted/50 border border-border/50 rounded-lg px-3 py-2 text-sm text-foreground focus:border-primary outline-none"
            >
              {sortOptions.map((o) => (
                <option key={o.value} value={o.value}>Ordenar: {o.label}</option>
              ))}
            </select>
          </div>
        </div>

        {}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {filtered.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">No se encontraron resultados</p>
            <p className="text-muted-foreground text-sm mt-1">Intenta con otros filtros o búsqueda</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Search;
