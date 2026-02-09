import Layout from "@/components/Layout";
import HeroSection from "@/components/HeroSection";
import MovieRow from "@/components/MovieRow";
import { movies } from "@/data/movies";
import { useAuth } from "@/context/AuthContext";

const Index = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Layout>
      {isAuthenticated && <HeroSection />}
      <div className="container mx-auto px-4 lg:px-8">
        <MovieRow title={isAuthenticated ? "Tendencias Ahora" : "Tendencias de películas"} movies={movies} />
        {isAuthenticated && (
          <>
            <MovieRow title="Contenido Premium" movies={movies.filter((m) => m.premium || m.featured)} />
            <MovieRow title="Recién Añadidas" movies={[...movies].reverse()} />
          </>
        )}
      </div>
    </Layout>
  );
};

export default Index;
