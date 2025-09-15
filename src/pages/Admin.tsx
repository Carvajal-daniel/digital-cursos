import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { CourseCard } from '@/components/CourseCard';
import { CourseForm } from '@/components/CourseForm';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search } from 'lucide-react';
import { useCourses } from '@/hooks/use-courses';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { Course, CourseFormData } from '@/types/course';

const Admin = () => {
  const { courses, addCourse, updateCourse, deleteCourse } = useCourses();
  const { toast } = useToast();
  const { role, isLoading } = useAuth();
  const navigate = useNavigate();

  const [showForm, setShowForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | undefined>();
  const [searchTerm, setSearchTerm] = useState('');

  // Protege rota: só admin pode acessar
  useEffect(() => {
    if (!isLoading && role !== 'admin') {
      navigate('/');
    }
  }, [role, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span>Carregando...</span>
      </div>
    );
  }

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (data: CourseFormData) => {
    try {
      if (editingCourse) {
        updateCourse(editingCourse.id, data);
        toast({
          title: 'Curso atualizado!',
          description: 'O curso foi atualizado com sucesso.',
        });
      } else {
        addCourse(data);
        toast({
          title: 'Curso criado!',
          description: 'O novo curso foi adicionado com sucesso.',
        });
      }
      handleCancel();
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro ao salvar o curso.',
        variant: 'destructive',
      });
    }
  };

  const handleEdit = (course: Course) => {
    setEditingCourse(course);
    setShowForm(true);
  };

  const handleDelete = (courseId: string) => {
    if (confirm('Tem certeza que deseja excluir este curso?')) {
      try {
        deleteCourse(courseId);
        toast({
          title: 'Curso excluído!',
          description: 'O curso foi removido com sucesso.',
        });
      } catch (error) {
        toast({
          title: 'Erro',
          description: 'Ocorreu um erro ao excluir o curso.',
          variant: 'destructive',
        });
      }
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingCourse(undefined);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Administração de Cursos
            </h1>
            <p className="text-muted-foreground">
              Gerencie seus cursos, adicione novos conteúdos e monitore o desempenho.
            </p>
          </div>
          {!showForm && (
            <Button
              variant="hero"
              onClick={() => setShowForm(true)}
              className="flex items-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>Novo Curso</span>
            </Button>
          )}
        </div>

        {showForm ? (
          <div className="mb-8">
            <CourseForm
              course={editingCourse}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
            />
          </div>
        ) : (
          <>
            <div className="mb-8">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Buscar cursos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-background border-border"
                />
              </div>
            </div>

            {/* Course Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="text-2xl font-bold text-foreground mb-1">
                  {courses.length}
                </div>
                <div className="text-muted-foreground">Total de Cursos</div>
              </div>
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="text-2xl font-bold text-foreground mb-1">
                  {courses.reduce((acc, course) => acc + course.studentsCount, 0).toLocaleString()}
                </div>
                <div className="text-muted-foreground">Total de Estudantes</div>
              </div>
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="text-2xl font-bold text-foreground mb-1">
                  R$ {courses.reduce((acc, course) => acc + (course.price * course.studentsCount), 0).toLocaleString()}
                </div>
                <div className="text-muted-foreground">Receita Total</div>
              </div>
            </div>

            {/* Courses Grid */}
            {filteredCourses.length === 0 ? (
              <div className="text-center py-16">
                <div className="bg-muted/30 rounded-lg p-12 max-w-md mx-auto">
                  <Plus className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {searchTerm ? 'Nenhum curso encontrado' : 'Nenhum curso criado'}
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    {searchTerm ? 'Tente ajustar os termos de busca.' : 'Comece criando seu primeiro curso.'}
                  </p>
                  {!searchTerm && (
                    <Button
                      variant="hero"
                      onClick={() => setShowForm(true)}
                      className="flex items-center space-x-2"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Criar Primeiro Curso</span>
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCourses.map((course) => (
                  <CourseCard
                    key={course.id}
                    course={course}
                    isAdmin={role === 'admin'}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Admin;
