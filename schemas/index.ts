import * as z from "zod";

export const LoginSchema = z.object({
  email: z.string().email({
    message: "Provided email is invalid. Please try again.",
  }),
  password: z.string().min(1, {
    message: "Password is required",
  }),
});
