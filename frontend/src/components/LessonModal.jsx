import { useState, useEffect } from 'react';
import api from '../services/api';

export default function LessonModal({ isOpen, onClose, courseId, onSuccess, lessonToEdit = null }) {
  const [formData, setFormData] = useState({
    title: '',
    status: 'draft',
    video_url: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (lessonToEdit) {
      setFormData({
        title: lessonToEdit.title || '',
        status: lessonToEdit.status || 'draft',
        video_url: lessonToEdit.video_url || ''
      });
    } else {
      setFormData({ title: '', status: 'draft', video_url: '' });
    }
  }, [lessonToEdit, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    
    if (formData.title.trim().length < 3) return setError('Mínimo 3 caracteres no título.');
    
    if (formData.video_url) {
      const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
      if (!urlPattern.test(formData.video_url)) return setError('URL de vídeo inválida.');
    }

    try {
      setLoading(true);
      
      if (lessonToEdit) {
        
        await api.put(`/lessons/${lessonToEdit.id}`, formData);
      } else {
        
        await api.post(`/courses/${courseId}/lessons`, formData);
      }
      
      onSuccess(); 
    } catch (err) {
      setError(err.response?.status === 403 ? 'Sem permissão.' : 'Erro ao salvar aula.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm p-4">
      <div className="bg-[#0B0C0F] border border-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-md">
        
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">
            {lessonToEdit ? 'Editar Aula' : 'Nova Aula'}<span className="text-blue-500">.</span>
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition text-xl">&times;</button>
        </div>

        {error && <div className="bg-red-900/20 border border-red-500/50 text-red-400 p-3 rounded-lg mb-5 text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Título da Aula *</label>
            <input type="text" name="title" value={formData.title} onChange={handleChange} className="w-full bg-[#060B1A] border border-gray-800 rounded-xl px-4 py-2.5 focus:border-blue-500 text-white" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Status *</label>
            <select name="status" value={formData.status} onChange={handleChange} className="w-full bg-[#060B1A] border border-gray-800 rounded-xl px-4 py-2.5 text-white">
              <option value="draft">Rascunho (Draft)</option>
              <option value="published">Publicada (Published)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">URL do Vídeo</label>
            <input type="text" name="video_url" value={formData.video_url} onChange={handleChange} placeholder="https://..." className="w-full bg-[#060B1A] border border-gray-800 rounded-xl px-4 py-2.5 text-white" />
          </div>

          <div className="flex gap-3 mt-8">
            <button type="button" onClick={onClose} className="flex-1 bg-transparent border border-gray-700 text-white py-3 rounded-xl transition">Cancelar</button>
            <button type="submit" disabled={loading} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl transition font-bold disabled:opacity-50">
              {loading ? 'Salvando...' : lessonToEdit ? 'Salvar Alterações' : 'Criar Aula'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}