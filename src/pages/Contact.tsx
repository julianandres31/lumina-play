import { useState } from "react";
import { Send, Mail, User, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import Layout from "@/components/Layout";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().trim().min(1, "Nombre requerido").max(100),
  email: z.string().trim().email("Correo inválido").max(255),
  message: z.string().trim().min(1, "Mensaje requerido").max(1000),
});

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = contactSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    toast({ title: "Mensaje enviado", description: "Gracias por contactarnos. Te responderemos pronto." });
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 lg:px-8 py-16">
        <div className="max-w-xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">Contáctanos</h1>
            <p className="text-muted-foreground">¿Tienes preguntas? Estamos aquí para ayudarte.</p>
          </div>
          <div className="glass-card p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Tu nombre"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="pl-10 bg-muted/50 border-border/50 focus:border-primary"
                  />
                </div>
                {errors.name && <p className="text-destructive text-xs mt-1">{errors.name}</p>}
              </div>
              <div>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="correo@ejemplo.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="pl-10 bg-muted/50 border-border/50 focus:border-primary"
                  />
                </div>
                {errors.email && <p className="text-destructive text-xs mt-1">{errors.email}</p>}
              </div>
              <div>
                <div className="relative">
                  <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Textarea
                    placeholder="Tu mensaje..."
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="pl-10 bg-muted/50 border-border/50 focus:border-primary min-h-[120px] resize-none"
                  />
                </div>
                {errors.message && <p className="text-destructive text-xs mt-1">{errors.message}</p>}
              </div>
              <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
                <Send className="w-4 h-4" />
                Enviar Mensaje
              </Button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;
