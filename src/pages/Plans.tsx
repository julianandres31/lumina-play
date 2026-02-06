import { Check, X, Sparkles, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import Layout from "@/components/Layout";

const plans = [
  {
    name: "Gratuito",
    price: "$0",
    period: "/mes",
    description: "Acceso básico al catálogo",
    icon: Zap,
    features: [
      { text: "Catálogo limitado", included: true },
      { text: "Calidad SD", included: true },
      { text: "1 dispositivo", included: true },
      { text: "Con anuncios", included: true },
      { text: "Contenido premium", included: false },
      { text: "Descargas offline", included: false },
    ],
    cta: "Empezar Gratis",
    highlight: false,
  },
  {
    name: "Premium",
    price: "$12.99",
    period: "/mes",
    description: "La experiencia completa sin límites",
    icon: Sparkles,
    features: [
      { text: "Catálogo completo", included: true },
      { text: "Calidad 4K HDR", included: true },
      { text: "4 dispositivos", included: true },
      { text: "Sin anuncios", included: true },
      { text: "Contenido premium", included: true },
      { text: "Descargas offline", included: true },
    ],
    cta: "Obtener Premium",
    highlight: true,
  },
];

const Plans = () => {
  const { toast } = useToast();

  return (
    <Layout>
      <div className="container mx-auto px-4 lg:px-8 py-16">
        <div className="text-center mb-14">
          <h1 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-4">
            Elige tu <span className="text-gradient">plan perfecto</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Disfruta del mejor contenido sin interrupciones. Cancela cuando quieras.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-2xl p-8 transition-all duration-300 ${
                plan.highlight
                  ? "glass-card border-primary/40 neon-glow relative"
                  : "glass-card"
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-primary text-primary-foreground text-xs font-semibold">
                  Más Popular
                </div>
              )}
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${plan.highlight ? "bg-primary/20" : "bg-muted"}`}>
                  <plan.icon className={`w-5 h-5 ${plan.highlight ? "text-primary" : "text-muted-foreground"}`} />
                </div>
                <h3 className="font-display text-xl font-bold text-foreground">{plan.name}</h3>
              </div>
              <div className="mb-2">
                <span className="font-display text-4xl font-bold text-foreground">{plan.price}</span>
                <span className="text-muted-foreground text-sm">{plan.period}</span>
              </div>
              <p className="text-sm text-muted-foreground mb-6">{plan.description}</p>
              <ul className="space-y-3 mb-8">
                {plan.features.map((f) => (
                  <li key={f.text} className="flex items-center gap-3 text-sm">
                    {f.included ? (
                      <Check className="w-4 h-4 text-primary flex-shrink-0" />
                    ) : (
                      <X className="w-4 h-4 text-muted-foreground/40 flex-shrink-0" />
                    )}
                    <span className={f.included ? "text-foreground" : "text-muted-foreground/50"}>{f.text}</span>
                  </li>
                ))}
              </ul>
              <Button
                onClick={() => toast({ title: "Demo", description: "Los pagos se habilitarán próximamente." })}
                className={`w-full ${
                  plan.highlight
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "bg-muted text-foreground hover:bg-muted/80"
                }`}
              >
                {plan.cta}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Plans;
