export const verifyPassword = async (email: string, password: string) => {
  try {
    const token = localStorage.getItem('token'); // pega o token do usuário logado
    const response = await fetch("https://api-digital-cursos.vercel.app/users/verify-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    return data; 
  } catch (error) {
    console.error("Erro ao verificar senha:", error);
    return { status: "error", message: "Erro de conexão" };
  }
};
