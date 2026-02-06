import movie1 from "@/assets/movie1.jpg";
import movie2 from "@/assets/movie2.jpg";
import movie3 from "@/assets/movie3.jpg";
import movie4 from "@/assets/movie4.jpg";
import movie5 from "@/assets/movie5.jpg";
import movie6 from "@/assets/movie6.jpg";

export interface Movie {
  id: string;
  title: string;
  synopsis: string;
  genre: string[];
  year: number;
  duration: string;
  rating: number;
  image: string;
  featured?: boolean;
  premium?: boolean;
}

export const movies: Movie[] = [
  {
    id: "1",
    title: "Horizonte Estelar",
    synopsis: "Dos astronautas se pierden en los confines del espacio mientras intentan descifrar una señal misteriosa proveniente de un planeta desconocido. Una odisea visual que desafía los límites de la exploración humana.",
    genre: ["Ciencia Ficción", "Aventura"],
    year: 2025,
    duration: "2h 18min",
    rating: 9.2,
    image: movie1,
    featured: true,
  },
  {
    id: "2",
    title: "Neón Oscuro",
    synopsis: "En una ciudad futurista plagada de corrupción, un detective solitario sigue la pista de un asesino que deja mensajes codificados en luces de neón. Cada pista lo acerca más a una verdad que podría destruirlo.",
    genre: ["Thriller", "Noir"],
    year: 2024,
    duration: "1h 56min",
    rating: 8.7,
    image: movie2,
    featured: true,
  },
  {
    id: "3",
    title: "El Templo Perdido",
    synopsis: "Una arqueóloga descubre un antiguo templo en la selva que guarda secretos sobre una civilización avanzada. Pero no es la única que busca su poder.",
    genre: ["Aventura", "Fantasía"],
    year: 2025,
    duration: "2h 05min",
    rating: 8.4,
    image: movie3,
    premium: true,
  },
  {
    id: "4",
    title: "La Casa del Silencio",
    synopsis: "Una familia se muda a una casa remota buscando paz, pero pronto descubre que algo habita en las sombras. El silencio es su mayor enemigo.",
    genre: ["Terror", "Suspenso"],
    year: 2024,
    duration: "1h 42min",
    rating: 7.9,
    image: movie4,
  },
  {
    id: "5",
    title: "Atardecer en Praga",
    synopsis: "Dos desconocidos se encuentran en un puente de Praga al atardecer. Lo que comienza como una conversación casual se transforma en una historia de amor que desafía el tiempo y la distancia.",
    genre: ["Romance", "Drama"],
    year: 2025,
    duration: "1h 58min",
    rating: 8.1,
    image: movie5,
    premium: true,
  },
  {
    id: "6",
    title: "Velocidad Extrema",
    synopsis: "Un ex piloto de carreras es reclutado para una misión imposible: interceptar un convoy blindado en una ciudad futurista antes de que sea demasiado tarde.",
    genre: ["Acción", "Thriller"],
    year: 2024,
    duration: "2h 10min",
    rating: 8.5,
    image: movie6,
    featured: true,
  },
];

export const genres = ["Todos", "Ciencia Ficción", "Thriller", "Aventura", "Terror", "Romance", "Drama", "Acción", "Fantasía", "Noir", "Suspenso"];
