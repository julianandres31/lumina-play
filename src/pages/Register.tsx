import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import Layout from "@/components/Layout";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: "Demo", description: "El registro se conectará con un backend próximamente." });
  };

  return (
    <Layout>
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="glass-card p-8 md:p-10">
            <div className="text-center mb-8">
              <h1 className="font-display text-2xl font-bold text-foreground mb-2">Crea tu cuenta</h1>
              <p className="text-sm text-muted-foreground">Únete a StreamVault y disfruta del mejor contenido</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Nombre completo" className="pl-10 bg-muted/50 border-border/50 focus:border-primary" required />
              </div>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input type="email" placeholder="correo@ejemplo.com" className="pl-10 bg-muted/50 border-border/50 focus:border-primary" required />
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Contraseña"
                  className="pl-10 pr-10 bg-muted/50 border-border/50 focus:border-primary"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                Crear Cuenta
              </Button>
            </form>
            <p className="text-center text-sm text-muted-foreground mt-6">
              ¿Ya tienes cuenta?{" "}
              <Link to="/login" className="text-primary hover:underline font-medium">Inicia sesión</Link>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Register;
