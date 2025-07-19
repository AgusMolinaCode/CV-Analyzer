import { Clock, Target, CheckSquare, ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const benefits = [
  {
    icon: Clock,
    title: "Ahorro de tiempo",
    description: "Reduce el tiempo de revisión de CVs de horas a minutos. Automatiza la primera fase del proceso de selección."
  },
  {
    icon: Target,
    title: "Análisis profundo de skills",
    description: "Identifica skills técnicos, frameworks, lenguajes y nivel de experiencia de forma automática y precisa."
  },
  {
    icon: CheckSquare,
    title: "Detecta perfiles calificados automáticamente",
    description: "Algoritmo inteligente que calcula match scores y destaca candidatos que mejor se ajustan al perfil buscado."
  },
  {
    icon: ExternalLink,
    title: "Enlaces a LinkedIn, GitHub, etc.",
    description: "Extrae y organiza automáticamente todos los enlaces relevantes del candidato para una evaluación completa."
  }
];

export function Benefits() {
  return (
    <section id="benefits" className="py-20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Beneficios destacados
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Transformá tu proceso de reclutamiento técnico con inteligencia artificial
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {benefits.map((benefit, index) => (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-6 text-center">
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="h-7 w-7 text-primary" />
                </div>
                
                <h3 className="text-lg font-semibold text-foreground mb-3">
                  {benefit.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {benefit.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}