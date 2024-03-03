import { passwordSchema } from "@/app/validation";
import { z } from "zod";

export const resetPasswordSchema = z
  .object({
    token: z.string(),
    email: z.string().email(),
    password: passwordSchema,
    password_confirmation: passwordSchema,
    recaptcha: z.string(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Les deux mots de passe ne correspondent pas",
    path: ["password_confirmation"],
  });
