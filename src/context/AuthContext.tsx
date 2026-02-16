import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import api from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { AuthContextType, RegisterPayload } from "@/types/auth";

interface AuthUser {
    email: string;
    name: string;
    role: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        const token = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");

        if (token && storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setIsLoading(false);
    }, []);

    const login = async (credentials: any) => {
        try {
            
            const response = await api.post("/api/auth/login", {
                username: credentials.email,
                password: credentials.password
            });

            const { token, nombreCompleto, rol } = response.data;
            const user: AuthUser = {
                email: credentials.email,
                name: nombreCompleto,
                role: rol
            };

            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));
            setUser(user);

            toast({ title: "Bienvenido", description: "Has iniciado sesión correctamente." });
        } catch (error: any) {
            console.error(error);
            const message = error.response?.data?.message || "Credenciales incorrectas";
            toast({ variant: "destructive", title: "Error", description: message });
            throw error;
        }
    };

    const register = async (userData: RegisterPayload) => {
        try {
            await api.post("/api/users/register", userData);
            toast({ title: "Cuenta creada", description: "Por favor inicia sesión con tus nuevas credenciales." });
        } catch (error: any) {
            console.error(error);
            const message = error.response?.data?.mensaje || error.response?.data?.error || "Error al registrarse";
            toast({ variant: "destructive", title: "Error", description: message });
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
        window.location.href = "/login";
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
