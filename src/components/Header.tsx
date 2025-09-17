import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BookOpen, Settings, Menu, X, LogOut, User } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";

export function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const isAdmin = location.pathname === "/admin";
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAuthenticated, logout, role } = useAuth();

  console.log(user, role);

  return (
    <header className="border-b border-border/50 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <BookOpen className="h-8 w-8 text-primary group-hover:scale-110 transition-transform" />
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <span className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
              EduPlatform
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors hover:text-primary relative ${
                !isAdmin ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              Cursos
              {!isAdmin && (
                <div className="absolute -bottom-2 left-0 right-0 h-0.5 bg-primary rounded-full" />
              )}
            </Link>

            <a
              href="#"
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              Formações
            </a>

            <a
              href="#"
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              Blog
            </a>

            <a
              href="#"
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              Comunidade
            </a>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
              {/* User info and logout */}
<div className="flex items-center space-x-3">
  <Link 
    to="/profile" 
    className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer"
  >
    <User className="h-4 w-4" />
    <span>Olá, {user?.name}</span>
  </Link>
  <Button
                    variant="ghost"
                    size="sm"
                    onClick={logout}
                    className="flex items-center space-x-2 hover:text-destructive"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sair</span>
                  </Button>
                </div>

                {/* Admin button if on admin page */}
                {isAuthenticated && role === "admin" && (
                  <Link to="/admin">
                    <Button variant="default" size="sm">
                      Painel Admin
                    </Button>
                  </Link>
                )}
              </>
            ) : (
              <>
                <Link to="/auth">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center space-x-2"
                  >
                    <Settings className="h-4 w-4" />
                    <span>Entrar</span>
                  </Button>
                </Link>
                <Button
                  variant="hero"
                  size="sm"
                  onClick={() => navigate("/auth")}
                >
                  Começar grátis
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-border/50 bg-background/95 backdrop-blur-sm">
            <div className="py-4 space-y-4">
              <Link
                to="/"
                className="block px-4 py-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Cursos
              </Link>

              <a
                href="#"
                className="block px-4 py-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Formações
              </a>

              <a
                href="#"
                className="block px-4 py-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Blog
              </a>

              <a
                href="#"
                className="block px-4 py-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Comunidade
              </a>

              <div className="px-4 pt-4 border-t border-border/50 flex flex-col space-y-3">
                {isAuthenticated ? (
                  <>
                    {/* User info */}
                    <Link 
  to="/profile" 
  className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer px-2 py-1"
  onClick={() => setIsMenuOpen(false)}
>
  <User className="h-4 w-4" />
  <span>Olá, {user?.name}</span>
</Link>

                    {/* Admin button if on admin page */}
                    {isAdmin && (
                      <Link to="/admin" onClick={() => setIsMenuOpen(false)}>
                        <Button
                          variant="default"
                          size="sm"
                          className="w-full justify-start"
                        >
                          <Settings className="h-4 w-4 mr-2" />
                          Admin
                        </Button>
                      </Link>
                    )}

                    {/* Logout button */}
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-start hover:text-destructive"
                      onClick={() => {
                        logout();
                        setIsMenuOpen(false);
                      }}
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sair
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => {
                        navigate("/auth");
                        setIsMenuOpen(false);
                      }}
                    >
                      Entrar
                    </Button>

                    <Button
                      variant="hero"
                      size="sm"
                      className="w-full"
                      onClick={() => {
                        navigate("/auth");
                        setIsMenuOpen(false);
                      }}
                    >
                      Começar grátis
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
