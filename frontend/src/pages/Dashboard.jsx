import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function Dashboard() {
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await api.get('/courses/');
        setCourses(response.data);
      } catch (err) {
        if (err.response?.status === 401) navigate('/login');
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, [navigate]);


  const filteredCourses = courses.filter(course =>
    course.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#010204] text-gray-100 p-8">
      <header className="max-w-6xl mx-auto mb-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight">
            MEUS CURSOS<span className="text-blue-500">.</span>
          </h1>
          <div className="flex gap-4">
            <button 
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-medium transition"
              onClick={() => navigate('/create-course')}
            >
              + Novo Curso
            </button>
            <button className="text-gray-400 hover:text-white transition" onClick={handleLogout}>
              Sair
            </button>
          </div>
        </div>

        <div className="relative max-w-md">
          <input 
            type="text"
            placeholder="Buscar curso pelo nome..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#0B0C0F] border border-gray-800 rounded-xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition"
          />
          <div className="absolute right-4 top-3.5 text-gray-600">
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto">
        {loading ? (
          <div className="text-center py-20 text-gray-500 font-mono">Carregando dados do servidor...</div>
        ) : filteredCourses.length === 0 ? (
          <div className="text-center py-20 bg-[#0B0C0F] rounded-2xl border border-dashed border-gray-800">
            <p className="text-gray-500">
              {searchTerm ? "Nenhum curso corresponde à sua busca." : "Nenhum curso encontrado."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map(course => (
              <div 
                key={course.id} 
                className="bg-[#0B0C0F] p-6 rounded-2xl border border-gray-800 hover:border-blue-500/50 transition-all cursor-pointer group shadow-lg"
                onClick={() => navigate(`/course/${course.id}`)}
              >
                <h3 className="text-xl font-bold mb-2 group-hover:text-blue-400 transition">
                  {course.name}
                </h3>
                <p className="text-gray-500 text-sm line-clamp-2 mb-4">
                  {course.description || "Sem descrição disponível."}
                </p>
                <div className="flex justify-between items-center text-xs text-gray-600 font-mono">
                  <span>Início: {new Date(course.start_date).toLocaleDateString()}</span>
                  <span className="text-blue-900">|</span>
                  <span>Fim: {new Date(course.end_date).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}