import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { useAuth } from '@/hooks/use-auth';
import { useUserProfile } from '@/hooks/use-user-profile';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Save, Loader2, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const EditProfile = () => {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { userProfile, refetch } = useUserProfile();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Protege a rota: só usuários logados podem acessar
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/auth');
    }
  }, [isAuthenticated, authLoading, navigate]);

  // Preenche o formulário com os dados do usuário
  useEffect(() => {
    if (userProfile) {
      setFormData({
        name: userProfile.name,
        email: userProfile.email,
      });
    } else if (user) {
      setFormData({
        name: user.name,
        email: user.email,
      });
    }
  }, [userProfile, user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.email.trim()) {
      toast({
        title: "Erro de validação",
        description: "Nome e email são obrigatórios",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      const userId = userProfile?.id;

      if (!userId) {
        throw new Error('ID do usuário não encontrado');
      }
      if (!userId) {
        toast({
          title: "Erro",
          description: "Não foi possível identificar o usuário. Tente fazer login novamente.",
          variant: "destructive",
        });
        return;
      }

      const response = await fetch(
        `https://api-digital-cursos.vercel.app/users/${userId}`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: 'temp_password', // API requer senha, mas não vamos alterar
          }),
        }
      );

      if (response.ok) {
        toast({
          title: "Perfil atualizado!",
          description: "Suas informações foram salvas com sucesso.",
        });
        
        // Atualiza os dados locais
        refetch();
        
        // Volta para a página de perfil
        navigate('/profile');
      } else {
        const errorData = await response.json();
        toast({
          title: "Erro ao atualizar perfil",
          description: errorData.message || "Erro ao salvar alterações",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erro de conexão",
        description: "Não foi possível conectar ao servidor",
        variant: "destructive",
      });
      console.error('Erro ao atualizar perfil:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span>Carregando...</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Será redirecionado pelo useEffect
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Botão Voltar */}
        <Button
          variant="ghost"
          onClick={() => navigate('/profile')}
          className="mb-6 flex items-center space-x-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Voltar ao Perfil</span>
        </Button>

        {/* Título */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Editar Perfil
          </h1>
          <p className="text-muted-foreground">
            Atualize suas informações pessoais
          </p>
        </div>

        {/* Formulário */}
        <div className="max-w-2xl">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Save className="h-5 w-5" />
                <span>Informações Pessoais</span>
              </CardTitle>
              <CardDescription>
                Mantenha suas informações sempre atualizadas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-foreground">
                    Nome Completo
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Seu nome completo"
                    required
                    className="bg-input/50 border-border/50 focus:border-primary transition-smooth"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-foreground">
                    Email
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="seu@email.com"
                    required
                    className="bg-input/50 border-border/50 focus:border-primary transition-smooth"
                  />
                </div>

                <div className="flex space-x-4 pt-4">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center space-x-2 bg-gradient-primary hover:opacity-90 transition-smooth shadow-elegant"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Salvando...</span>
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        <span>Salvar Alterações</span>
                      </>
                    )}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/profile')}
                    disabled={isSubmitting}
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
