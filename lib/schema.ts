import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .email("Enter a valid email address")
    .min(1, "Email is required"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must include at least one uppercase letter")
    .regex(/[0-9]/, "Must include at least one number"),
});

export const verifySignupSchema = z
  .object({
    full_name: z
      .string()
      .min(1, "Full name is required")
      .min(2, "Name is too short"),
    email: z
      .email("Enter a valid email address")
      .min(1, "Email is required"),
    mill_name: z
      .string()
      .min(1, "Mill name is required")
      .min(2, "Mill name is too short"),
    mill_tag: z
      .string()
      .min(1, "Mill tag is required")
      .max(10, "Mill tag must be 10 characters or less")
      .regex(/^[A-Za-z0-9]+$/, "Mill tag must be alphanumeric"),
    password: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must include at least one uppercase letter")
      .regex(/[0-9]/, "Must include at least one number"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const signupSchema = z
  .object({
    email: z
      .email("Enter a valid email address")
      .min(1, "Email is required"),
    mill_id: z
      .string()
      .min(1, "Mill ID is required"),
    role: z.enum(["OWNER", "MANAGER", "MEMBER"], {
      message: "Select a valid role",
    }),
    password: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must include at least one uppercase letter")
      .regex(/[0-9]/, "Must include at least one number"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const inviteSchema = z.object({
  email: z
    .email("Enter a valid email address")
    .min(1, "Email is required"),
  role: z.enum(["MANAGER", "MEMBER"], {
    message: "Select a role",
  }),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
export type VerifySignupFormValues = z.infer<typeof verifySignupSchema>;
export type SignupFormValues = z.infer<typeof signupSchema>;
export type InviteFormValues = z.infer<typeof inviteSchema>;