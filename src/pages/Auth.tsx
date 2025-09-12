import { Header } from '@/components/Header';
import { useState } from 'react';

export default function AuthComponent() {
  const [activeTab, setActiveTab] = useState('login');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  // Estados do formulário de login
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Estados do formulário de cadastro
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');

  const API_URL = 'https://api-digital-cursos.vercel.app/users';

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    if (!loginEmail || !loginPassword) {
      setMessage({ type: 'error', text: 'Por favor, preencha todos os campos.' });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: 'Login realizado com sucesso!' });
        console.log('Token:', data.token);

        if (data.token) {
          localStorage.setItem('authToken', data.token);
        }

        setTimeout(() => {
          window.location.href = 'http://localhost:8080/';
        }, 1500);
      } else {
        setMessage({ type: 'error', text: data.message || 'Email ou senha incorretos.' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Erro de conexão com o servidor. Tente novamente.' });
      console.error('Erro de requisição:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    if (!signupName || !signupEmail || !signupPassword) {
      setMessage({ type: 'error', text: 'Por favor, preencha todos os campos.' });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: signupName, email: signupEmail, password: signupPassword }),
      });
      
      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: 'Usuário cadastrado com sucesso! Faça login para continuar.' });
        console.log('Dados do usuário:', data);
        
        setSignupName('');
        setSignupEmail('');
        setSignupPassword('');
        setTimeout(() => {
          setActiveTab('login');
          setMessage(null);
        }, 2000);
      } else {
        setMessage({ type: 'error', text: data.message || 'Erro ao criar usuário.' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Erro de conexão com o servidor. Tente novamente.' });
      console.error('Erro de requisição:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <Header/>
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md overflow-hidden rounded-xl bg-white shadow-2xl">
        <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-10 text-center text-white">
          <h2 className="text-3xl font-bold">Bem-vindo!</h2>
          <p className="mt-2 text-sm opacity-90">
            {activeTab === 'login' ? 'Entre na sua conta' : 'Crie sua conta'}
          </p>
        </div>

        <div className="flex bg-gray-300">
          <button
            className={`flex-1 py-4 text-center text-lg font-semibold transition-all duration-300 ${
              activeTab === 'login'
                ? 'bg-slate-200 text-blue-600 shadow-inner'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
            onClick={() => setActiveTab('login')}
          >
            Entrar
          </button>
          <button
            className={`flex-1 py-4 text-center text-lg font-semibold transition-all duration-300 ${
              activeTab === 'signup'
                ? 'bg-white text-blue-600 shadow-inner'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
            onClick={() => setActiveTab('signup')}
          >
            Cadastrar
          </button>
        </div>

        <div className="p-8">
          {message && (
            <div
              className={`mb-6 rounded-lg border px-4 py-3 text-sm text-center font-medium ${
                message.type === 'error'
                  ? 'bg-red-50 border-red-200 text-red-700'
                  : 'bg-green-50 border-green-200 text-green-700'
              }`}
            >
              {message.text}
            </div>
          )}

          {activeTab === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-6">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  placeholder="seu@email.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="block w-full rounded-md border-gray-300 bg-gray-100 p-3 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50"
                  disabled={loading}
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Senha</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="block w-full rounded-md border-gray-300 bg-gray-100 p-3 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50"
                  disabled={loading}
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-md bg-blue-600 py-3 text-lg font-bold text-white transition-colors hover:bg-blue-700 disabled:bg-gray-400"
              >
                {loading ? 'Entrando...' : 'Entrar'}
              </button>
            </form>
          )}

          {activeTab === 'signup' && (
            <form onSubmit={handleSignupSubmit} className="space-y-6">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Nome</label>
                <input
                  type="text"
                  placeholder="Seu nome"
                  value={signupName}
                  onChange={(e) => setSignupName(e.target.value)}
                  className="block w-full rounded-md border-gray-300 bg-gray-100 p-3 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50"
                  disabled={loading}
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  placeholder="voce@email.com"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  className="block w-full rounded-md border-gray-300 bg-gray-100 p-3 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50"
                  disabled={loading}
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Senha</label>
                <input
                  type="password"
                  placeholder="Crie uma senha"
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  className="block w-full rounded-md border-gray-300 bg-gray-100 p-3 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50"
                  disabled={loading}
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-md bg-blue-600 py-3 text-lg font-bold text-white transition-colors hover:bg-blue-700 disabled:bg-gray-400"
              >
                {loading ? 'Criando conta...' : 'Criar conta'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
    </>

  );
}