"use client";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Header } from "@/components/Header";
import { useAuth } from "@/hooks/use-auth";
import { useUserProfile } from "@/hooks/use-user-profile";
import { useToast } from "@/hooks/use-toast";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Shield, Loader2, Eye, EyeOff } from "lucide-react";
import { passwordSchema, type PasswordFormData } from "@/lib/validation/passwordSchema";

const ChangePassword = () => {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { userProfile } = useUserProfile();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });

  useEffect(() => {
    if (!authLoading && !isAuthenticated) navigate("/auth");
  }, [authLoading, isAuthenticated, navigate]);

  const togglePasswordVisibility = (field: "current" | "new" | "confirm") => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const onSubmit = async (data: PasswordFormData) => {
    try {
      if (!userProfile?.id) throw new Error("ID do usuário não encontrado");

      const token = localStorage.getItem("token");

      const response = await fetch(`https://api-digital-cursos.vercel.app/users/${userProfile.id}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: userProfile.name,
          email: userProfile.email,
          password: data.newPassword,
        }),
      });

      if (response.ok) {
        toast({
          title: "Senha alterada!",
          description: "Sua senha foi atualizada com sucesso.",
        });
        reset();
        navigate("/profile");
      } else {
        const errorData = await response.json();
        toast({
          title: "Erro ao alterar senha",
          description: errorData.message || "Erro ao salvar nova senha",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Erro ao alterar senha:", error);
      toast({
        title: "Erro de conexão",
        description: "Não foi possível conectar ao servidor",
        variant: "destructive",
      });
    }
  };

  if (authLoading) return <div className="min-h-screen flex items-center justify-center">Carregando...</div>;
  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate("/profile")}
          className="mb-6 flex items-center space-x-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Voltar ao Perfil</span>
        </Button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Alterar Senha</h1>
          <p className="text-muted-foreground">Mantenha sua conta segura com uma senha forte</p>
        </div>

        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span>Segurança da Conta</span>
            </CardTitle>
            <CardDescription>Digite sua senha atual e escolha uma nova senha segura</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Senha Atual */}
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Senha Atual</Label>
                <div className="relative">
                  <Input
                    {...register("currentPassword")}
                    id="currentPassword"
                    type={showPasswords.current ? "text" : "password"}
                    placeholder="Digite sua senha atual"
                    className="pr-10"
                  />
                  {errors.currentPassword && (
                    <p className="text-xs text-destructive">{errors.currentPassword.message}</p>
                  )}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => togglePasswordVisibility("current")}
                  >
                    {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              {/* Nova Senha */}
              <div className="space-y-2">
                <Label htmlFor="newPassword">Nova Senha</Label>
                <div className="relative">
                  <Input
                    {...register("newPassword")}
                    id="newPassword"
                    type={showPasswords.new ? "text" : "password"}
                    placeholder="Digite sua nova senha"
                    className="pr-10"
                  />
                  {errors.newPassword && (
                    <p className="text-xs text-destructive">{errors.newPassword.message}</p>
                  )}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => togglePasswordVisibility("new")}
                  >
                    {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              {/* Confirmar Senha */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
                <div className="relative">
                  <Input
                    {...register("confirmPassword")}
                    id="confirmPassword"
                    type={showPasswords.confirm ? "text" : "password"}
                    placeholder="Confirme sua nova senha"
                    className="pr-10"
                  />
                  {errors.confirmPassword && (
                    <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>
                  )}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => togglePasswordVisibility("confirm")}
                  >
                    {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              {/* Botões */}
              <div className="flex space-x-4 pt-4">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center space-x-2 bg-gradient-primary"
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
                  onClick={() => navigate("/profile")}
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
  );
};

export default ChangePassword;
