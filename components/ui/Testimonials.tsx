import { Card, CardContent } from "@/components/ui/card";
import { Quote } from "lucide-react";

const testimonials = [
  {
    quote: "Antes revisaba 50 CVs manualmente. Ahora la IA lo hace por mí.",
    author: "María González",
    position: "Tech Recruiter Senior",
    company: "TechCorp"
  },
  {
    quote: "El match score es increíblemente preciso. Ha mejorado mucho nuestro proceso.",
    author: "Carlos Ruiz",
    position: "Head of Talent",
    company: "StartupXYZ"
  },
  {
    quote: "Reducimos el tiempo de screening en un 80%. Una herramienta indispensable.",
    author: "Ana Martín",
    position: "HR Manager",
    company: "DevCompany"
  }
];

export function Testimonials() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Lo que dicen nuestros usuarios
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Reclutadores técnicos de todo el mundo confían en nuestra plataforma
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-0 shadow-lg">
              <CardContent className="p-8 text-center">
                <Quote className="h-8 w-8 text-primary mx-auto mb-6" />
                
                <blockquote className="text-lg text-foreground font-medium mb-6 leading-relaxed">
                  "{testimonial.quote}"
                </blockquote>
                
                <div className="space-y-1">
                  <p className="font-semibold text-foreground">
                    {testimonial.author}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {testimonial.position}
                  </p>
                  <p className="text-sm text-primary font-medium">
                    {testimonial.company}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}