import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import LessonModal from '../components/LessonModal';
import EditCourseModal from '../components/EditCourseModal';

export default function CourseDetails() {
  const { id } = useParams(); 
  const navigate = useNavigate();
  
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [instructor, setInstructor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCourseEditOpen, setIsCourseEditOpen] = useState(false); 
  const [filterStatus, setFilterStatus] = useState('all'); 
  const [selectedLesson, setSelectedLesson] = useState(null);

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const courseRes = await api.get(`/courses/${id}`);
        setCourse(courseRes.data);

        const lessonsRes = await api.get(`/courses/${id}/lessons`);
        setLessons(lessonsRes.data);

        const randomUserRes = await fetch('https://randomuser.me/api/');
        const randomUserData = await randomUserRes.json();
        setInstructor(randomUserData.results[0]);

      } catch (err) {
        setError('Erro ao carregar os dados do curso.');
        if (err.response?.status === 401) navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [id, navigate]);

  const handleDeleteCourse = async () => {
    if (window.confirm("Tem certeza que deseja excluir este curso?")) {
      try {
        await api.delete(`/courses/${id}`);
        navigate('/dashboard'); 
      } catch (err) {
        alert("Erro ao excluir. Apenas o criador pode excluir o curso.");
      }
    }
  };
  const handleDeleteLesson = async (lessonId) => {
    if (window.confirm("Tem certeza que deseja excluir esta aula?")) {
      try {
        await api.delete(`/lessons/${lessonId}`);
        window.location.reload(); 
      } catch (err) {
        alert("Erro ao excluir. Apenas o criador pode realizar esta ação.");
      }
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedLesson(null);
  };

  const filteredLessons = lessons.filter(lesson => 
    filterStatus === 'all' || lesson.status === filterStatus
  );

  if (loading) {
    return <div className="min-h-screen bg-[#010204] text-gray-500 flex items-center justify-center font-mono">Carregando detalhes...</div>;
  }

  if (error || !course) {
    return <div className="min-h-screen bg-[#010204] text-red-500 flex items-center justify-center">{error || "Curso não encontrado."}</div>;
  }
  const formatSafeDate = (dateString) => {
    if (!dateString) return '';
    const [year, month, day] = String(dateString).substring(0, 10).split('-');
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="min-h-screen bg-[#010204] text-gray-100 p-8">
      <div className="max-w-5xl mx-auto">
        
        <button 
          onClick={() => navigate('/dashboard')}
          className="text-gray-400 hover:text-blue-400 mb-6 flex items-center gap-2 transition"
        >
          ← Voltar para Meus Cursos
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-[#0B0C0F] p-8 rounded-2xl border border-gray-800 shadow-xl">
              <div className="flex justify-between items-start mb-4">
                <h1 className="text-3xl font-bold text-white">{course.name}</h1>
                
                <div className="flex gap-3">
                  <button 
                    onClick={() => setIsCourseEditOpen(true)}
                    className="text-sm px-3 py-1 bg-gray-800 hover:bg-gray-700 rounded text-gray-300 transition"
                  >
                    Editar
                  </button>
                  <button 
                    onClick={handleDeleteCourse}
                    className="text-sm px-3 py-1 bg-red-900/30 text-red-400 hover:bg-red-900/60 rounded border border-red-900/50 transition"
                  >
                    Excluir
                  </button>
                </div>
              </div>
              
              <p className="text-gray-400 mb-6 leading-relaxed">
                {course.description || "Nenhuma descrição fornecida para este curso."}
              </p>
              
              <div className="flex gap-6 text-sm font-mono text-blue-400 bg-[#060B1A] p-4 rounded-xl border border-blue-900/30">
                <div>
                  <span className="text-gray-500 block text-xs">Data de Início</span>
                  {formatSafeDate(course.start_date)}
                </div>
                <div>
                  <span className="text-gray-500 block text-xs">Data de Fim</span>
                  {formatSafeDate(course.end_date)}
                </div>
              </div>
            </div>

            <div className="bg-[#0B0C0F] p-8 rounded-2xl border border-gray-800 shadow-xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  Módulos e Aulas<span className="text-blue-500">.</span>
                </h2>                
                <div className="flex items-center gap-3">
                  <select 
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="bg-[#060B1A] border border-gray-800 rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-blue-500 transition"
                  >
                    <option value="all">Todas</option>
                    <option value="published">Publicadas</option>
                    <option value="draft">Rascunhos</option>
                  </select>

                  <button 
                    onClick={() => { setSelectedLesson(null); setIsModalOpen(true); }}
                    className="bg-blue-600 hover:bg-blue-700 text-sm px-4 py-2 rounded-lg font-medium transition shadow-md shadow-blue-900/20"
                  >
                    + Criar Aula
                  </button>
                </div>
              </div>

              {filteredLessons.length === 0 ? (
                <div className="text-center py-10 border border-dashed border-gray-800 rounded-xl text-gray-500">
                  {lessons.length === 0 ? "Nenhuma aula cadastrada ainda." : "Nenhuma aula encontrada para este filtro."}
                </div>
              ) : (
                <ul className="space-y-3">
                  {filteredLessons.map((lesson, index) => (
                    <li key={lesson.id} className="flex justify-between items-center bg-[#060B1A] p-4 rounded-xl border border-gray-800 hover:border-gray-600 transition">
                      <div className="flex items-center gap-3">
                        <span className="text-blue-500 font-mono text-sm">{index + 1}.</span>
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-200">{lesson.title}</span>
                          {lesson.video_url && (
                            <a href={lesson.video_url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 hover:underline mt-1">
                              Assistir Vídeo ↗
                            </a>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <button 
                          onClick={() => { setSelectedLesson(lesson); setIsModalOpen(true); }}
                          className="text-gray-500 hover:text-blue-400 text-xs uppercase font-bold tracking-widest transition"
                        >
                          Editar
                        </button>
                        <button 
                          onClick={() => handleDeleteLesson(lesson.id)}
                          className="text-red-900 hover:text-red-500 text-xs uppercase font-bold tracking-widest transition"
                        >
                          Excluir
                        </button>

                        <span className={`text-xs px-2 py-1 rounded-full ${lesson.status === 'published' ? 'bg-green-900/30 text-green-400' : 'bg-yellow-900/30 text-yellow-500'}`}>
                          {lesson.status === 'published' ? 'Publicada' : 'Rascunho'}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-gradient-to-b from-[#0B0C0F] to-[#060B1A] p-6 rounded-2xl border border-gray-800 shadow-xl sticky top-8">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-6">Instrutor Convidado</h3>
              
              {instructor ? (
                <div className="text-center">
                  <img 
                    src={instructor.picture.large} 
                    alt="Instrutor" 
                    className="w-24 h-24 rounded-full mx-auto mb-4 border-2 border-blue-500 p-1"
                  />
                  <h4 className="text-lg font-bold text-gray-100">{instructor.name.first} {instructor.name.last}</h4>
                  <p className="text-sm text-blue-400 font-mono mb-4">{instructor.location.country}</p>
                  <p className="text-xs text-gray-500 italic">
                    Especialista convidado gerado via RandomUser API.
                  </p>
                </div>
              ) : (
                <div className="text-center text-gray-500 text-sm animate-pulse">
                  Buscando instrutor...
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
      <LessonModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        courseId={id} 
        lessonToEdit={selectedLesson}
        onSuccess={() => {
          handleCloseModal();
          window.location.reload(); 
        }} 
      />

      <EditCourseModal
        isOpen={isCourseEditOpen}
        onClose={() => setIsCourseEditOpen(false)}
        course={course}
        onSuccess={() => {
          setIsCourseEditOpen(false);
          window.location.reload();
        }}
      />

    </div>
  );
}