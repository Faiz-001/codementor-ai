import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username cannot exceed 30 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const onboardingSchema = z.object({
  experienceLevel: z.enum(['Beginner', 'Intermediate', 'Advanced', 'Professional']),
  preferredLanguages: z.array(z.string()).min(1, 'Select at least one language'),
  learningGoals: z.array(z.string()).min(1, 'Select at least one goal'),
});