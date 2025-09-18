import { useState, useEffect } from 'react';
import { useAuth } from './use-auth';

interface UserProfile {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export const useUserProfile = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, isAuthenticated } = useAuth();

  const fetchUserProfile = async () => {
    if (!isAuthenticated || !user?.email) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      const response = await fetch(
        `https://api-digital-cursos.vercel.app/users/${user.email}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setUserProfile(data.data);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Erro ao buscar dados do usuário');
      }
    } catch (err) {
      setError('Erro de conexão com o servidor');
      console.error('Erro ao buscar perfil do usuário:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, [isAuthenticated, user?.email]);

  const refetch = () => {
    fetchUserProfile();
  };

  return {
    userProfile,
    isLoading,
    error,
    refetch,
  };
};
