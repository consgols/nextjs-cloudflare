import { z } from 'zod';

export const RegisterFormSchema = z
  .object({
    email: z.string().email('Invalid email address').min(1, { message: ' email is required.' }).trim(),
    password: z.string().trim(),
    confirmPassword: z.string().trim(),
  })
  .superRefine((val, ctx) => {
    if (val.password !== val.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Passwords do not match',
        path: ['confirmPassword'],
      });
    }
  });

export const LoginFormSchema = z.object({
  email: z.string().email('Invalid email address').min(1, { message: ' email is required.' }).trim(),
  password: z.string().min(1, { message: 'password is required.' }).trim(),
});
