import { z } from "zod";

export const usernameSchema = z
  .string()
  .min(4, "username must be atleast 4 characters")
  .max(20, "Username must be less than 20 characters")
  //alllowing only alphanumeric and underscores
  .regex(/^[a-zA-Z0-9_@]+$/, "Username must not contain spexial characters");

export const signUpSchema = z.object({
  username: usernameSchema,
  email: z.string().email({ message: "Invalid email address" }),
  password:z.string().min(8,{message:'password must be atleast 8 characters'})
});
