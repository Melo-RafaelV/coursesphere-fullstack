import { useState, useEffect } from 'react';
import api from '../services/api';

export default function EditCourseModal({ isOpen, onClose, course, onSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    start_date: '',
    end_date: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (course) {
      const safeStartDate = course.start_date ? String(course.start_date).substring(0, 10) : '';
      const safeEndDate = course.end_date ? String(course.end_date).substring(0, 10) : '';

      setFormData({
        name: course.name || '',
        description: course.description || '',
        start_date: safeStartDate,
        end_date: safeEndDate
      });
    }
  }, [course, isOpen]);

  if (!isOpen) return null;

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
    if (new Date(formData.end_date) < new Date(formData.start_date)) {
      return setError('A data de término deve ser igual ou posterior à data de início.');
    }

    try {
      setLoading(true);
      await api.put(`/courses/${course.id}`, formData);
      onSuccess(); 
    } catch (err) {
      setError(err.response?.status === 403 ? 'Apenas o criador pode editar.' : 'Erro ao atualizar curso.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm p-4">
      <div className="bg-[#0B0C0F] border border-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Editar Curso<span className="text-blue-500">.</span></h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition text-xl">&times;</button>
        </div>

        {error && <div className="bg-red-900/20 border border-red-500/50 text-red-400 p-3 rounded-lg mb-5 text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Nome do Curso *</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full bg-[#060B1A] border border-gray-800 rounded-xl px-4 py-2.5 focus:border-blue-500 text-white" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Descrição</label>
            <textarea name="description" value={formData.description} onChange={handleChange} rows="3" className="w-full bg-[#060B1A] border border-gray-800 rounded-xl px-4 py-2.5 focus:border-blue-500 text-white resize-none" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Data Início *</label>
              <input type="date" name="start_date" value={formData.start_date} onChange={handleChange} className="w-full bg-[#060B1A] border border-gray-800 rounded-xl px-4 py-2.5 text-gray-300 focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Data Fim *</label>
              <input type="date" name="end_date" value={formData.end_date} onChange={handleChange} className="w-full bg-[#060B1A] border border-gray-800 rounded-xl px-4 py-2.5 text-gray-300 focus:border-blue-500" />
            </div>
          </div>

          <div className="flex gap-3 mt-8">
            <button type="button" onClick={onClose} className="flex-1 bg-transparent border border-gray-700 text-white py-3 rounded-xl transition">Cancelar</button>
            <button type="submit" disabled={loading} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl transition font-bold disabled:opacity-50">
              {loading ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}