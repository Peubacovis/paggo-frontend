'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:3001/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) throw new Error('Credenciais inválidas');

      const { accessToken } = await res.json();

      // ← Aqui você armazena e loga o token:
      localStorage.setItem('token', accessToken);
      console.log('Token armazenado:', accessToken);

      // Redireciona para o dashboard
      router.push('/dashboard');
    } catch (err) {
    setError(err instanceof Error ? err.message : 'Erro desconhecido');
    }
    setIsLoading(true);

    try {
      // URL do backend - ajuste se necessário
      const backendUrl = 'http://localhost:3001/auth/login';
      
      const response = await fetch(backendUrl, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      // Verifica se a resposta foi bem-sucedida
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao fazer login');
      }

      const data = await response.json();
      
      // Salva o token no localStorage
      localStorage.setItem('token', data.access_token);
      
      // Redireciona para a dashboard
      router.push('/dashboard');

    } catch (err: any) {
      console.error('Erro no login:', err);
      setError(err.message || 'Falha na conexão com o servidor. Verifique sua rede ou tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <form onSubmit={handleLogin}>
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Login</h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}

        <div className="mb-4">
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
        </label>
        <input
            type="email"
            id="email"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            value={email}
            onChange={(e) => {
            const value = e.target.value;
            setEmail(value);
            
            // Validação idêntica ao register
            if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                setError('Email inválido');
            } else {
                setError('');
            }
            }}
            required
        />
        </div>

        <div className="mb-6">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Senha
          </label>
          <input
            type="password"
            id="password"
            placeholder="••••••••"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-2 px-4 rounded-md text-white font-medium ${isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} transition-colors`}
        >
          {isLoading ? 'Carregando...' : 'Entrar'}
        </button>

        <div className="mt-4 text-center text-sm text-gray-600">
          Não tem uma conta?{' '}
          <Link href="/register" className="text-blue-600 hover:underline">
            Cadastre-se
          </Link>
        </div>
      </form>
    </div>
  );
}