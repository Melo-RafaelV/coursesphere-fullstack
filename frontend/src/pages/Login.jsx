import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const params = new URLSearchParams();
      params.append('username', email);
      params.append('password', password);

      const response = await api.post('/login', params);
      
      localStorage.setItem('token', response.data.access_token);
      navigate('/dashboard');
    } catch (err) {
      setError('Email ou senha incorretos.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#060B1A] via-[#010204] to-[#010204]">
      <div className="bg-[#0B0C0F] p-10 rounded-2xl shadow-2xl shadow-blue-900/30 w-full max-w-md border border-gray-800/50">
        <h2 className="text-3xl font-bold text-gray-100 mb-8 tracking-tight flex items-center gap-2">
          FAÇA SEU LOGIN<span className="text-blue-500 text-4xl leading-none">.</span>
        </h2>
        
        {error && (
          <div className="bg-red-950 border border-red-800 text-red-300 px-4 py-3 rounded-lg mb-6 text-sm text-center">
            {error}
          </div>
        )}
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Email
            </label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@dominio.com"
              className="w-full px-5 py-3 border border-gray-700 bg-[#060B1A] text-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 placeholder-gray-600 transition duration-200"
              required
            />
          </div>
          
          <div> 
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Senha
            </label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-5 py-3 border border-gray-700 bg-[#060B1A] text-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 placeholder-gray-600 transition duration-200"
              required
            />
            
          
            <div className="flex justify-end mt-2">
              <a href="#" className="text-xs text-gray-300 hover:text-gray-100 font-medium transition duration-200">
                Esqueci a senha
              </a>
            </div>
          </div>
          
          <button 
            type="submit" 
            className="w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white font-bold py-3 px-6 rounded-xl hover:from-blue-600 hover:to-blue-800 transition duration-200 shadow-md shadow-blue-900/30"
          >
            Entrar
          </button>
        </form>
        
        <p className="mt-8 text-center text-sm text-gray-500">
          <Link to="/register" className="text-gray-400 hover:text-blue-400 font-semibold transition duration-200">
            Criar Conta
          </Link>
        </p>
      </div>
    </div>
  );
}