import { z } from "zod";

export const loginSchema = z.object({
  email: z.email(),
  password: z
    .string()
    .min(3, { message: "Password must be at least 8 characters." }),
});

export const signupSchema = z.object({
  email: z.email(),
  username: z
    .string()
    .min(2, { message: "Name must be at least 2 characters." }),
  password: z
    .string()
    .min(3, { message: "Password must be at least 8 characters." }),
});
