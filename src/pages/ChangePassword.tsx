import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { useAuth } from '@/hooks/use-auth';
import { useUserProfile } from '@/hooks/use-user-profile';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Shield, Loader2, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ChangePassword = () => {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { userProfile } = useUserProfile();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  // Protege a rota: só usuários logados podem acessar
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/auth');
    }
  }, [isAuthenticated, authLoading, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const validateForm = () => {
    if (!formData.currentPassword.trim()) {
      toast({
        title: "Erro de validação",
        description: "Senha atual é obrigatória",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.newPassword.trim()) {
      toast({
        title: "Erro de validação",
        description: "Nova senha é obrigatória",
        variant: "destructive",
      });
      return false;
    }

    if (formData.newPassword.length < 6) {
      toast({
        title: "Erro de validação",
        description: "A nova senha deve ter pelo menos 6 caracteres",
        variant: "destructive",
      });
      return false;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast({
        title: "Erro de validação",
        description: "As senhas não coincidem",
        variant: "destructive",
      });
      return false;
    }

    if (formData.currentPassword === formData.newPassword) {
      toast({
        title: "Erro de validação",
        description: "A nova senha deve ser diferente da senha atual",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      
      if (!userProfile?.id) {
        throw new Error('ID do usuário não encontrado');
      }

      const response = await fetch(
        `https://api-digital-cursos.vercel.app/users/${userProfile.id}`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: userProfile.name,
            email: userProfile.email,
            password: formData.newPassword,
          }),
        }
      );

      if (response.ok) {
        toast({
          title: "Senha alterada!",
          description: "Sua senha foi atualizada com sucesso.",
        });
        
        // Limpa o formulário
        setFormData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
        
        // Volta para a página de perfil
        navigate('/profile');
      } else {
        const errorData = await response.json();
        toast({
          title: "Erro ao alterar senha",
          description: errorData.message || "Erro ao salvar nova senha",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erro de conexão",
        description: "Não foi possível conectar ao servidor",
        variant: "destructive",
      });
      console.error('Erro ao alterar senha:', error);
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
            Alterar Senha
          </h1>
          <p className="text-muted-foreground">
            Mantenha sua conta segura com uma senha forte
          </p>
        </div>

        {/* Formulário */}
        <div className="max-w-2xl">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Segurança da Conta</span>
              </CardTitle>
              <CardDescription>
                Digite sua senha atual e escolha uma nova senha segura
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword" className="text-foreground">
                    Senha Atual
                  </Label>
                  <div className="relative">
                    <Input
                      id="currentPassword"
                      name="currentPassword"
                      type={showPasswords.current ? "text" : "password"}
                      value={formData.currentPassword}
                      onChange={handleInputChange}
                      placeholder="Digite sua senha atual"
                      required
                      className="bg-input/50 border-border/50 focus:border-primary transition-smooth pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => togglePasswordVisibility('current')}
                    >
                      {showPasswords.current ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword" className="text-foreground">
                    Nova Senha
                  </Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      name="newPassword"
                      type={showPasswords.new ? "text" : "password"}
                      value={formData.newPassword}
                      onChange={handleInputChange}
                      placeholder="Digite sua nova senha"
                      required
                      className="bg-input/50 border-border/50 focus:border-primary transition-smooth pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => togglePasswordVisibility('new')}
                    >
                      {showPasswords.new ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    A senha deve ter pelo menos 6 caracteres
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-foreground">
                    Confirmar Nova Senha
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showPasswords.confirm ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="Confirme sua nova senha"
                      required
                      className="bg-input/50 border-border/50 focus:border-primary transition-smooth pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => togglePasswordVisibility('confirm')}
                    >
                      {showPasswords.confirm ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
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
                        <span>Alterando...</span>
                      </>
                    ) : (
                      <>
                        <Shield className="h-4 w-4" />
                        <span>Alterar Senha</span>
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

export default ChangePassword;
