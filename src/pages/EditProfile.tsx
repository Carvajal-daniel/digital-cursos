"use client";

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { useAuth } from '@/hooks/use-auth';
import { useUserProfile } from '@/hooks/use-user-profile';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { verifyPassword } from '@/hooks/use-verify-password';

const EditProfile = () => {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { userProfile, refetch } = useUserProfile();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Proteção de rota
  useEffect(() => {
    if (!authLoading && !isAuthenticated) navigate('/auth');
  }, [authLoading, isAuthenticated, navigate]);

  // Preenche o formulário com dados do usuário
  useEffect(() => {
    if (userProfile) setFormData({ name: userProfile.name, email: userProfile.email, password: '' });
  }, [userProfile]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { name, email, password } = formData;
    if (!name || !email || !password) {
      toast({ title: "Erro", description: "Todos os campos são obrigatórios", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      const userId = userProfile?.id;

      if (!userId) throw new Error('ID do usuário não encontrado');

      // Verifica a senha
      const verifyResult = await verifyPassword(userProfile.email, password);

      if (verifyResult.status !== 'success') {
        toast({ title: "Senha incorreta", description: verifyResult.message || "Senha atual inválida", variant: "destructive" });
        setIsSubmitting(false);
        return;
      }

      // Atualiza o perfil
      const updateResponse = await fetch(`https://api-digital-cursos.vercel.app/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email }),
      });

      if (updateResponse.ok) {
        toast({ title: "Perfil atualizado!", description: "Alterações salvas com sucesso." });
        refetch();
        navigate('/profile');
      } else {
        const errorData = await updateResponse.json();
        toast({ title: "Erro", description: errorData.message || "Erro ao salvar alterações", variant: "destructive" });
      }
    } catch (error) {
      console.error(error);
      toast({ title: "Erro", description: "Não foi possível conectar ao servidor", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading) return <div className="min-h-screen flex items-center justify-center">Carregando...</div>;
  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">

        <Button variant="ghost" onClick={() => navigate('/profile')} className="mb-6 flex items-center space-x-2">
          <ArrowLeft className="h-4 w-4" />
          <span>Voltar ao Perfil</span>
        </Button>

        <h1 className="text-3xl font-bold text-foreground mb-2">Editar Perfil</h1>
        <p className="text-muted-foreground mb-8">Atualize suas informações pessoais</p>

        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2"><Save className="h-5 w-5"/> Informações Pessoais</CardTitle>
            <CardDescription>Mantenha suas informações sempre atualizadas</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">

              <div className="space-y-2">
                <Label htmlFor="name">Nome Completo</Label>
                <Input id="name" name="name" value={formData.name} onChange={handleInputChange} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" value={formData.email} onChange={handleInputChange} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Senha Atual</Label>
                <Input id="password" name="password" type="password" value={formData.password} onChange={handleInputChange} required />
              </div>

              <div className="flex space-x-4 pt-4">
                <Button type="submit" disabled={isSubmitting} className="flex items-center space-x-2 bg-gradient-primary">
                  {isSubmitting ? <><Loader2 className="h-4 w-4 animate-spin"/> <span>Salvando...</span></> : <><Save className="h-4 w-4"/> <span>Salvar Alterações</span></>}
                </Button>

                <Button type="button" variant="outline" onClick={() => navigate('/profile')} disabled={isSubmitting}>
                  Cancelar
                </Button>
              </div>

            </form>
          </CardContent>
        </Card>

      </div>
    </div>
  );
};

export default EditProfile;
