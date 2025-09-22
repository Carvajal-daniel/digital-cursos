import { Course } from "@/types/course";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Users, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface CourseCardProps {
  course: Course;
  isAdmin?: boolean;
}

export function CourseCard({ course, isAdmin = false }: CourseCardProps) {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Checa se o curso está no localStorage
  const isUserEnrolled = (() => {
    const stored = localStorage.getItem("enrolledCourses");
    if (!stored) return false;
    const enrolledCourses: Course[] = JSON.parse(stored);
    return enrolledCourses.some((c) => c.id === course.id);
  })();

  const handleEnroll = () => {
    const storedCourses = localStorage.getItem("enrolledCourses");
    const enrolledCourses: Course[] = storedCourses ? JSON.parse(storedCourses) : [];

    if (!enrolledCourses.find((c) => c.id === course.id)) {
      enrolledCourses.push(course);
      localStorage.setItem("enrolledCourses", JSON.stringify(enrolledCourses));
    }

    toast({
      title: "Inscrição realizada!",
      description: `Você foi inscrito no curso "${course.title}".`,
    });
  };

  const handleViewDetails = () => {
    navigate(`/course/${course.id}`);
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Iniciante":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "Intermediário":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "Avançado":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <Card className="group overflow-hidden transition-all duration-500 hover:shadow-elegant hover:-translate-y-2 bg-card/80 backdrop-blur-sm border-border/50 hover:border-primary/20">
      <CardHeader className="p-0">
        <div className="aspect-video bg-gradient-secondary relative overflow-hidden">
          <img
            src={course.image}
            alt={course.title}
            className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
          />
          <div className="absolute top-4 left-4">
            <Badge className={`${getLevelColor(course.level)} backdrop-blur-sm`}>
              {course.level}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-4">
        <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2">
          {course.title}
        </h3>
        <p className="text-sm text-muted-foreground mt-1 font-medium">
          por {course.instructor}
        </p>
        <p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed">
          {course.description}
        </p>

        <div className="flex items-center justify-between">
          <Badge variant="secondary" className="bg-muted/50 text-muted-foreground border-0">
            {course.category}
          </Badge>
          <div className="flex items-center space-x-1">
            <Clock className="h-3 w-3 text-muted-foreground" />
            <span className="text-xs text-muted-foreground font-medium">{course.duration}</span>
          </div>
        </div>

        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="font-medium">{course.rating.toFixed(1)}</span>
          </div>
          <div className="flex items-center space-x-1 text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>{course.studentsCount.toLocaleString()}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="px-6 pb-6 pt-0">
        <div className="flex items-center justify-between w-full">
          <div className="space-y-1">
            <div className="text-2xl font-bold text-primary">R$ {course.price.toFixed(2)}</div>
            <div className="text-xs text-muted-foreground">
              ou 12x de R$ {(course.price / 12).toFixed(2)}
            </div>
          </div>

          {!isAdmin && (
            <Button
              variant={isUserEnrolled ? "outline" : "hero"}
              className="px-6 transform hover:scale-105 transition-all"
              onClick={isUserEnrolled ? handleViewDetails : handleEnroll}
            >
              {isUserEnrolled ? "Ver curso" : "Inscrever-se"}
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
