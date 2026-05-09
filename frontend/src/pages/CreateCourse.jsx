import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function CreateCourse() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    start_date: '',
    end_date: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    
    if (error) setError(''); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (formData.name.trim().length < 3) {
      return setError('O nome do curso deve ter no mínimo 3 caracteres.');
    }
    if (!formData.start_date || !formData.end_date) {
      return setError('As datas de início e término são obrigatórias.');
    }
    if (new Date(formData.end_date) < new Date(formData.start_date)) {
      return setError('A data de término deve ser igual ou posterior à data de início.');
    }

    try {
      setLoading(true);
      await api.post('/courses/', formData);
      
      navigate('/dashboard'); 
    } catch (err) {
      console.error(err);
      setError('Erro ao criar o curso. Verifique sua conexão ou tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#010204] text-gray-100 p-8 flex items-center justify-center">
      <div className="w-full max-w-2xl bg-[#0B0C0F] p-10 rounded-2xl border border-gray-800 shadow-2xl">
        
        <button 
          onClick={() => navigate('/dashboard')}
          className="text-gray-400 hover:text-blue-400 mb-8 flex items-center gap-2 transition"
        >
          ← Voltar
        </button>

        <h1 className="text-3xl font-bold mb-2">
          Novo Curso<span className="text-blue-500">.</span>
        </h1>
        <p className="text-gray-500 mb-8 text-sm">
          Preencha as informações abaixo para criar uma nova turma.
        </p>

        {error && (
          <div className="bg-red-900/20 border border-red-500/50 text-red-400 p-4 rounded-xl mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Nome do Curso *</label>
            <input 
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Ex: Lógica de Programação com Python"
              className="w-full bg-[#060B1A] border border-gray-800 rounded-xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Descrição (Opcional)</label>
            <textarea 
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Descreva o que será ensinado neste curso..."
              rows="4"
              className="w-full bg-[#060B1A] border border-gray-800 rounded-xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition text-white resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Data de Início *</label>
              <input 
                type="date"
                name="start_date"
                value={formData.start_date}
                onChange={handleChange}
                className="w-full bg-[#060B1A] border border-gray-800 rounded-xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition text-gray-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Data de Término *</label>
              <input 
                type="date"
                name="end_date"
                value={formData.end_date}
                onChange={handleChange}
                className="w-full bg-[#060B1A] border border-gray-800 rounded-xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition text-gray-300"
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition mt-4 disabled:opacity-50 shadow-lg shadow-blue-900/20"
          >
            {loading ? 'Criando curso...' : 'Criar Curso'}
          </button>
        </form>

      </div>
    </div>
  );
}