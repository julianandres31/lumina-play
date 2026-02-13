import { useState } from "react";
import { Send, Mail, User, MessageSquare, Phone, CreditCard, Coins } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import Layout from "@/components/Layout";
import { z } from "zod";


const PlansPaySchema = z.object({
  name: z.string().trim().min(1, "Nombre requerido").max(100),
  apellido: z.string().trim().min(1, "Apellido requerido").max(100),
  email: z.string().trim().email("Correo inválido").max(255),
  celular: z.string().trim().regex(/^[0-9]{10}$/, "Debe tener exactamente 10 dígitos"),
  nombre_titular_tarjeta: z.string().trim().min(1,"Nombre del titular de la tarjeta").max(100),
  numero_tarjeta: z.string().min(1,"Numero de tarjeta").regex(/^[0-9]{16}$/,"Debe de tener 16 digitos"),
  fecha_de_vencimiento: z.string().date().min(1,"Numero de tarjeta").max(16),
  codigo_cvv: z.string().trim().min(1,"Codigo de seguridad CVV").max(3),
});

const PlansPay = () => {
  const [form, setForm] = useState({ name: "", email: "", celular: "", nombre_titular_tarjeta: "", numero_tarjeta: "",fecha_de_vencimiento:"", codigo_cvv:""});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = PlansPaySchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    toast({ title: "Plan pagado", description: "Gracias por comprar. Eso nos ayuda mucho <3" });
    setForm({ name: "", email: "", celular: "", nombre_titular_tarjeta: "", numero_tarjeta: "",fecha_de_vencimiento:"", codigo_cvv:""});
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 lg:px-8 py-16">
        <div className="max-w-xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">Plan Premiun</h1>
            <p className="text-muted-foreground">Llena el formulario para terminar la compra.</p>
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
                  <Phone className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="tel"
                    placeholder="Tu celular"
                    value={form.celular}
                    onChange={(e) => setForm({ ...form, celular: e.target.value })}
                    className="pl-10 bg-muted/50 border-border/50 focus:border-primary"
                  />
                </div>
                {errors.celular && <p className="text-destructive text-xs mt-1">{errors.celular}</p>}
              </div>
              <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Nombre Titular Tarjeta"
                    value={form.nombre_titular_tarjeta}
                    onChange={(e) => setForm({ ...form, nombre_titular_tarjeta: e.target.value })}
                    className="pl-10 bg-muted/50 border-border/50 focus:border-primary"
                  />
                </div>
                {errors.nombre_titular_tarjeta && <p className="text-destructive text-xs mt-1">{errors.nombre_titular_tarjeta}</p>}
              <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Numero de Tarjeta"
                    value={form.numero_tarjeta}
                    onChange={(e) => setForm({ ...form, numero_tarjeta: e.target.value })}
                    className="pl-10 bg-muted/50 border-border/50 focus:border-primary"
                  />
                </div>
                {errors.numero_tarjeta && <p className="text-destructive text-xs mt-1">{errors.numero_tarjeta}</p>}
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="date"
                    placeholder="Fecha de Vencimiento de la Tarjeta"
                    value={form.fecha_de_vencimiento}
                    onChange={(e) => setForm({ ...form, fecha_de_vencimiento: e.target.value })}
                    className="pl-10 bg-muted/50 border-border/50 focus:border-primary"
                  />
                </div>
                {errors.fecha_de_vencimiento && <p className="text-destructive text-xs mt-1">{errors.fecha_de_vencimiento}</p>}
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="tel"
                    placeholder="Codigo CVV de la Tarjeta"
                    value={form.codigo_cvv}
                    onChange={(e) => setForm({ ...form, codigo_cvv: e.target.value })}
                    className="pl-10 bg-muted/50 border-border/50 focus:border-primary"
                  />
                </div>
                {errors.codigo_cvv && <p className="text-destructive text-xs mt-1">{errors.codigo_cvv}</p>}
              <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
                <Coins className="w-4 h-4" />
                Hacer Pago
              </Button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PlansPay;