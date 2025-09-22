import { z } from "zod";

export const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Senha atual é obrigatória"),
    newPassword: z.string().min(6, "A nova senha deve ter pelo menos 6 caracteres"),
    confirmPassword: z.string().min(1, "Confirmação de senha é obrigatória"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: "A nova senha deve ser diferente da senha atual",
    path: ["newPassword"],
  });

export type PasswordFormData = z.infer<typeof passwordSchema>;
