import { Header } from '@/components/Header';
import { useAuth } from '@/hooks/use-auth';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { User, Mail, Calendar, Shield, Settings, ArrowLeft } from 'lucide-react';

const Profile = () => {
  const { user, role, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  // Protege a rota: só usuários logados podem acessar
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/auth');
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading) {
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
                {user?.name}
              </h1>
              <p className="text-muted-foreground mb-3">
                {user?.email}
              </p>
              <Badge 
                variant={role === 'admin' ? 'default' : 'secondary'}
                className="flex items-center space-x-1 w-fit"
              >
                <Shield className="h-3 w-3" />
                <span>{role === 'admin' ? 'Administrador' : 'Usuário'}</span>
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
                <span className="text-sm">{user?.email}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Membro desde Janeiro 2024</span>
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
              <Button variant="outline" className="w-full justify-start">
                <Settings className="h-4 w-4 mr-2" />
                Editar Perfil
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Shield className="h-4 w-4 mr-2" />
                Alterar Senha
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Seção específica para Admin */}
        {role === 'admin' && (
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