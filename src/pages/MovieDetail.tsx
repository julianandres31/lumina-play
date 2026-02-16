import { useParams, Link } from "react-router-dom";
import { Star, Clock, Calendar, Play, ArrowLeft, Lock, User, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import MovieCard from "@/components/MovieCard";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import { localMovieImages } from "@/data/localImages";

const MovieDetail = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [related, setRelated] = useState<any[]>([]);
  const [cast, setCast] = useState<any[]>([]);
  const [director, setDirector] = useState<string>("");

  useEffect(() => {
    const fetchMovie = async () => {
      setLoading(true);
      try {
        const numericId = parseInt(id || "0");

        // Fetch specific movie, cast, and directors
        const [movieRes, castRes, directorsRes, allRes] = await Promise.all([
          api.get(`/api/audiovisual/${id}`),
          api.get("/api/actor-audiovisual/findAll"),
          api.get("/api/directors/findAll"),
          api.get("/api/audiovisual/findAll")
        ]);

        const m = movieRes.data;

        // Find director name
        const dir = directorsRes.data.find((d: any) => d.id === m.directorId);
        const dirName = m.directorName || (dir ? `${dir.nameDirector} ${dir.lasNameDirector}` : "Desconocido");
        setDirector(dirName);

        // Filter cast for this movie
        console.log("Filtering cast for movie ID:", numericId);

        const movieCast = castRes.data.filter((c: any) => {
          const cId = c.audiovisualContentId || c.audiovisualContent?.id;
          // console.log("Checking cast member:", c.id, "ContentID:", cId);
          return Number(cId) === numericId;
        });

        console.log("Resulting Cast:", movieCast);
        setCast(movieCast);

        // Determine image URL
        const localImgData = localMovieImages[m.id];

        const finalPoster = localImgData?.poster
          ? localImgData.poster
          : "https://placehold.co/600x900?text=" + encodeURIComponent(m.tittle);

        const finalCover = localImgData?.cover;

        const mappedMovie = {
          id: m.id,
          title: m.tittle,
          synopsis: m.description,
          genre: m.filmGenres.map((g: any) => g.movieGenre),
          year: new Date(m.relaseDate).getFullYear(),
          duration: m.duration + " min",
          rating: m.ageRating,
          image: finalPoster,
          cover: finalCover,
          trailerURL: m.trailerURL,
          premium: false,
        };

        setMovie(mappedMovie);

        // Filter related (exclude current, take 4)
        const others = allRes.data
          .filter((item: any) => item.id !== m.id)
          .slice(0, 4)
          .map((item: any) => {
            const relatedLocalImg = localMovieImages[item.id];
            const relatedPoster = relatedLocalImg?.poster
              ? relatedLocalImg.poster
              : "https://placehold.co/600x900?text=" + encodeURIComponent(item.tittle);

            return {
              id: item.id,
              title: item.tittle,
              year: new Date(item.relaseDate).getFullYear(),
              rating: item.ageRating,
              image: relatedPoster,
            };
          });
        setRelated(others);

      } catch (error) {
        console.error("Error fetching movie details", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchMovie();
  }, [id]);

  const handleWatchNow = () => {
    if (movie?.trailerURL) {
      window.open(movie.trailerURL, "_blank");
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <p className="text-muted-foreground text-lg">Cargando...</p>
        </div>
      </Layout>
    );
  }

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

  return (
    <Layout>
      {/* Hero Section */}
      <div className="relative h-[60vh] min-h-[400px]">
        <img
          src={movie.cover || movie.image}
          alt={movie.title}
          className="w-full h-full object-cover"
        />
        <div className="hero-gradient-overlay absolute inset-0" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent" />
      </div>

      <div className="container mx-auto px-4 lg:px-8 -mt-48 relative z-10">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Volver
        </Link>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Poster */}
          <div className="w-48 md:w-64 flex-shrink-0">
            <img src={movie.image} alt={movie.title} className="w-full rounded-xl shadow-2xl" />
          </div>

          {/* Info */}
          <div className="flex-1 animate-fade-in">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              {movie.genre.map((g: string) => (
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
              <span className="flex items-center gap-1"><Video className="w-4 h-4" />{director}</span>
            </div>

            <p className="text-foreground/80 leading-relaxed mb-8 max-w-2xl">{movie.synopsis}</p>

            {/* Cast Section */}
            {cast.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                  <User className="w-4 h-4 text-primary" /> Reparto
                </h3>
                <div className="flex flex-wrap gap-3">
                  {cast.map((c: any) => (
                    <div key={c.id} className="bg-muted/30 px-3 py-2 rounded-lg border border-border/50">
                      <p className="text-sm font-medium text-foreground">{c.actor?.nameActor} {c.actor?.lastNameActor}</p>
                      <p className="text-xs text-muted-foreground">{c.character}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-3">
              <Button
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2 neon-glow"
                onClick={handleWatchNow}
              >
                <Play className="w-5 h-5" />
                Ver Ahora
              </Button>
            </div>
          </div>
        </div>

        {/* Related Content */}
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
