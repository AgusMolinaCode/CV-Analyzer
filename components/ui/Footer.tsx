import { Brain, Github, Linkedin, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer id="contact" className="bg-card border-t">
      <div className="container mx-auto px-6 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Brain className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold text-foreground">
                CVAnalyzer.ai
              </span>
            </div>
            <p className="text-muted-foreground mb-6 max-w-md">
              Revolucionamos el reclutamiento técnico con inteligencia
              artificial. Analiza CVs de forma automática y encuentra los
              mejores talentos en segundos.
            </p>
            <div className="flex gap-4">
              <a
                href="https://github.com/AgusMolinaCode"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="https://www.linkedin.com/in/agustin-molina-994635138/"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href="mailto:agustin.molina.dev@gmail.com"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* <div>
            <h3 className="font-semibold text-foreground mb-4">Producto</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Funcionalidades</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Precios</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">API</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Integraciones</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-foreground mb-4">Soporte</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Términos de servicio</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Política de privacidad</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Contacto</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Centro de ayuda</a></li>
            </ul>
          </div> */}
        </div>

        <div className="border-t mt-12 pt-8 text-center">
          <p className="text-muted-foreground">
            © {new Date().getFullYear()} CVAnalyzer.ai. Todos los derechos
            reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
