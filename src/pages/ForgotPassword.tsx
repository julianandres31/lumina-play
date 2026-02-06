import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import Layout from "@/components/Layout";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: "Correo enviado", description: "Si la cuenta existe, recibirás instrucciones para restablecer tu contraseña." });
  };

  return (
    <Layout>
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="glass-card p-8 md:p-10">
            <div className="text-center mb-8">
              <h1 className="font-display text-2xl font-bold text-foreground mb-2">Recuperar contraseña</h1>
              <p className="text-sm text-muted-foreground">Ingresa tu correo y te enviaremos instrucciones</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="correo@ejemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-muted/50 border-border/50 focus:border-primary"
                  required
                />
              </div>
              <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                Enviar Instrucciones
              </Button>
            </form>
            <Link to="/login" className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-primary mt-6 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Volver al inicio de sesión
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ForgotPassword;
