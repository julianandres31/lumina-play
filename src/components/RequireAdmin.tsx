import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const RequireAdmin = ({ children }: { children: JSX.Element }) => {
    const { user, isAuthenticated, isLoading } = useAuth();
    const location = useLocation();

    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center bg-background text-foreground">Cargando...</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    
    
    const isAdmin = user?.role?.toUpperCase().includes("ADMIN");

    if (!isAdmin) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default RequireAdmin;
