import { z } from "zod";

export const loginSchema = z.object({
  email: z.email("Enter a valid email address").min(1, "Email is required"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must include at least one uppercase letter")
    .regex(/[0-9]/, "Must include at least one number"),
});

export const forgotPasswordSchema = z.object({
  email: z.email("Enter a valid email address").min(1, "Email is required"),
});

export const createMemberSchema = z.object({
  email: z.email("Enter a valid email address").min(1, "Email is required"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must include at least one uppercase letter")
    .regex(/[0-9]/, "Must include at least one number"),
  role: z.enum(["manager", "member"], { message: "Select a role" }),
});

export const resetPasswordSchema = z
  .object({
    new_password: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must include at least one uppercase letter")
      .regex(/[0-9]/, "Must include at least one number"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((d) => d.new_password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const passwordField = z
  .string()
  .min(1, "Password is required")
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Must include at least one uppercase letter")
  .regex(/[0-9]/, "Must include at least one number");

export const createMillSchema = z
  .object({
    email: z.email("Enter a valid email address").min(1, "Email is required"),
    mill_id: z.string().min(1, "Mill ID is required"),
    password: passwordField,
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const joinMillSchema = z
  .object({
    email: z.email("Enter a valid email address").min(1, "Email is required"),
    mill_id: z.string().min(1, "Mill ID is required"),
    role: z.enum(["admin", "manager"], { message: "Select a role" }),
    password: passwordField,
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

  export const signupSchema = z
  .object({
    intent: z.enum(["create", "join"]),
    email: z.email("Enter a valid email address").min(1, "Email is required"),
    mill_id: z.string().min(1, "Mill ID is required"),
    role: z.enum(["admin", "manager"]),
    password: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must include at least one uppercase letter")
      .regex(/[0-9]/, "Must include at least one number"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type LoginFormValues = z.infer<typeof loginSchema>;
export type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;
export type CreateMemberValues = z.infer<typeof createMemberSchema>;
export type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;
export type CreateMillValues = z.infer<typeof createMillSchema>;
export type JoinMillValues = z.infer<typeof joinMillSchema>;
export type SignupFormValues = z.infer<typeof signupSchema>;