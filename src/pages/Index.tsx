import Layout from "@/components/Layout";
import HeroSection from "@/components/HeroSection";
import MovieRow from "@/components/MovieRow";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import { localMovieImages } from "@/data/localImages";
import type { Movie } from "@/types/content";

const Index = () => {
  const { isAuthenticated } = useAuth();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await api.get("/api/audiovisual/findAll");
        const mappedMovies: Movie[] = response.data.map((m: any) => {
          const localImgData = localMovieImages[m.id];
          const finalImage = localImgData?.poster
            ? localImgData.poster
            : "https://placehold.co/600x900?text=" + encodeURIComponent(m.tittle);

          const finalCover = localImgData?.cover;

          return {
            id: m.id,
            title: m.tittle,
            synopsis: m.description,
            genre: m.filmGenres.map((g: any) => g.movieGenre),
            year: new Date(m.relaseDate).getFullYear(),
            duration: m.duration + " min",
            rating: m.ageRating,
            image: finalImage,
            cover: finalCover,
            trailerURL: m.trailerURL,
            featured: false, // You might want to add a logic for this later
            premium: false,
          };
        });
        setMovies(mappedMovies);
      } catch (error) {
        console.error("Error fetching movies", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  // Simple logic to pick a featured movie if none marked (e.g., first one, or random)
  const featuredMovie = movies.length > 0 ? movies[0] : null;

  return (
    <Layout>
      {isAuthenticated && featuredMovie && <HeroSection featured={featuredMovie} />}

      <div className="container mx-auto px-4 lg:px-8">
        {loading ? (
          <div className="py-20 text-center text-muted-foreground">Cargando contenido...</div>
        ) : (
          <>
            <MovieRow title={isAuthenticated ? "Tendencias Ahora" : "Tendencias de películas"} movies={movies} />
            {isAuthenticated && (
              <>
                {/* Example filters for other rows */}
                <MovieRow title="Recién Añadidas" movies={[...movies].reverse().slice(0, 6)} />
              </>
            )}
          </>
        )}
      </div>
    </Layout>
  );
};

export default Index;
