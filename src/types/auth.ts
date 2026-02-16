export interface User {
    id: number;
    login: string;
    email: string;
    activated: boolean;
    langKey: string;
    imageUrl: string;
    authorities: string[];
}

export interface DocType {
    id: number;
    documentName: string;
    initials: string;
}

export interface Sex {
    id: number;
    sexName: string;
}

export interface City {
    id: number;
    name: string;
}

export interface RegisterPayload {
    username: string;
    email: string;
    password: string;
    documentNumber: string;
    firstName: string;
    secondName?: string;
    firstLastName: string;
    secondLastName?: string;
    documentTypeId: number;
    sexId: number;
    cityId: number;
}

export interface LoginResponse {
    token: string;
    nombreCompleto: string;
    rol: string;
}

export interface AuthContextType {
    user: { name: string; role: string; email: string } | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (data: any) => Promise<void>;
    register: (data: RegisterPayload) => Promise<void>;
    logout: () => void;
}
