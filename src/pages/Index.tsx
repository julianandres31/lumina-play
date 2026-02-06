import Layout from "@/components/Layout";
import HeroSection from "@/components/HeroSection";
import MovieRow from "@/components/MovieRow";
import { movies } from "@/data/movies";

const Index = () => (
  <Layout>
    <HeroSection />
    <div className="container mx-auto px-4 lg:px-8">
      <MovieRow title="Tendencias Ahora" movies={movies} />
      <MovieRow title="Contenido Premium" movies={movies.filter((m) => m.premium || m.featured)} />
      <MovieRow title="Recién Añadidas" movies={[...movies].reverse()} />
    </div>
  </Layout>
);

export default Index;
