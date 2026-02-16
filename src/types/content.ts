export interface Movie {
    id: string | number;
    title: string;
    synopsis: string;
    genre: string[];
    year: number;
    duration: string;
    rating: number;
    image: string;
    cover?: string;
    trailerURL?: string;
    featured?: boolean;
    premium?: boolean;
}
