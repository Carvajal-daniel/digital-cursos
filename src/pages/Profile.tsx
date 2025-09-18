import { Header } from '@/components/Header';
import { useAuth } from '@/hooks/use-auth';
import { useUserProfile } from '@/hooks/use-user-profile';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { User, Mail, Calendar, Shield, Settings, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Profile = () => {
  const { user, role, isAuthenticated, isLoading: authLoading } = useAuth();
  const { userProfile, isLoading: profileLoading, error, refetch } = useUserProfile();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Protege a rota: só usuários logados podem acessar
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/auth');
    }
  }, [isAuthenticated, authLoading, navigate]);

  // Mostrar toast de erro se houver
  useEffect(() => {
    if (error) {
      toast({
        title: "Erro ao carregar perfil",
        description: error,
        variant: "destructive",
      });
    }
  }, [error, toast]);

  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="text-muted-foreground">Carregando perfil...</span>
            </div>
          </div>
        </div>
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
          onClick={() => navigate('/')}
          className="mb-6 flex items-center space-x-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Voltar</span>
        </Button>

        {/* Header do Perfil */}
        <div className="mb-8">
          <div className="flex items-center space-x-6">
            {/* Avatar */}
            <div className="w-24 h-24 bg-gradient-primary rounded-full flex items-center justify-center">
              <User className="h-12 w-12 text-white" />
            </div>
            
            {/* Informações Básicas */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-foreground mb-2">
                {userProfile?.name || user?.name}
              </h1>
              <p className="text-muted-foreground mb-3">
                {userProfile?.email || user?.email}
              </p>
              <Badge 
                variant={userProfile?.role === 'admin' ? 'default' : 'secondary'}
                className="flex items-center space-x-1 w-fit"
              >
                <Shield className="h-3 w-3" />
                <span>{userProfile?.role === 'admin' ? 'Administrador' : 'Usuário'}</span>
              </Badge>
            </div>
          </div>
        </div>

        {/* Cards de Informações */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Informações Pessoais */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Informações Pessoais</span>
              </CardTitle>
              <CardDescription>
                Dados básicos da sua conta
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{userProfile?.email || user?.email}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  Membro desde {userProfile?.createdAt 
                    ? new Date(userProfile.createdAt).toLocaleDateString('pt-BR', { 
                        month: 'long', 
                        year: 'numeric' 
                      })
                    : 'Janeiro 2024'
                  }
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Estatísticas */}
          <Card>
            <CardHeader>
              <CardTitle>Estatísticas</CardTitle>
              <CardDescription>
                Sua atividade na plataforma
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Cursos Inscritos</span>
                <span className="font-semibold">0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Cursos Concluídos</span>
                <span className="font-semibold">0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Horas Estudadas</span>
                <span className="font-semibold">0h</span>
              </div>
            </CardContent>
          </Card>

          {/* Ações Rápidas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5" />
                <span>Ações</span>
              </CardTitle>
              <CardDescription>
                Configurações da conta
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => navigate('/profile/edit')}
              >
                <Settings className="h-4 w-4 mr-2" />
                Editar Perfil
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => navigate('/profile/password')}
              >
                <Shield className="h-4 w-4 mr-2" />
                Alterar Senha
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start"
                onClick={refetch}
                disabled={profileLoading}
              >
                {profileLoading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <ArrowLeft className="h-4 w-4 mr-2" />
                )}
                Atualizar Dados
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Seção específica para Admin */}
        {(userProfile?.role === 'admin' || role === 'admin') && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-primary" />
                <span>Painel Administrativo</span>
              </CardTitle>
              <CardDescription>
                Funcionalidades exclusivas para administradores
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-4">
                <Button 
                  variant="default"
                  onClick={() => navigate('/admin')}
                >
                  Gerenciar Cursos
                </Button>
                <Button variant="outline">
                  Gerenciar Usuários
                </Button>
                <Button variant="outline">
                  Relatórios
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Profile;