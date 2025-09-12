import { Header } from '@/components/Header';
import { HeroSection } from '@/components/HeroSection';
import { StatsSection } from '@/components/StatsSection';
import { CoursesSection } from '@/components/CoursesSection';
import { CTASection } from '@/components/CTASection';


const Index = () => {

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <HeroSection />
      
      {/* Stats Section */}
      <StatsSection />
      
      {/* Courses Section */}
      <CoursesSection />
      
      {/* CTA Section */}
      

        <CTASection />
     
      
      
      {/* Footer */}
      <footer className="border-t border-border/50 py-12 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">EduPlatform</h3>
              <p className="text-muted-foreground text-sm">
                Transformando carreiras através da educação em tecnologia de alta qualidade.
              </p>
              <div className="flex space-x-4">
                <div className="w-8 h-8 bg-primary/20 rounded-full" />
                <div className="w-8 h-8 bg-primary/20 rounded-full" />
                <div className="w-8 h-8 bg-primary/20 rounded-full" />
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-semibold text-foreground">Cursos</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div>Frontend</div>
                <div>Backend</div>
                <div>Mobile</div>
                <div>Design</div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-semibold text-foreground">Empresa</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div>Sobre nós</div>
                <div>Carreiras</div>
                <div>Blog</div>
                <div>Contato</div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-semibold text-foreground">Suporte</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div>Central de ajuda</div>
                <div>Comunidade</div>
                <div>Termos de uso</div>
                <div>Privacidade</div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-border/50 mt-12 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 EduPlatform. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;